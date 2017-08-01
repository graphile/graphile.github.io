const { buildSchema, defaultPlugins } = require("graphile-build");
const { printSchema } = require("graphql/utilities");

function PersonTypePlugin(builder) {
  builder.hook(
    "init",
    (
      _,
      {
        addType,
        graphql: {
          GraphQLObjectType,
          GraphQLString,
          GraphQLEnumType,
          GraphQLNonNull,
        },
        newWithHooks,
      }
    ) => {
      const Color = newWithHooks(
        GraphQLEnumType,
        {
          name: "Color",
          values: {
            RED: { value: "red" },
            GREEN: { value: "green" },
            BLUE: { value: "blue" },
            GREY: {
              value: "grey",
              description: "@deprecated Primary colours only",
            },
          },
        },
        {}
      );
      const PersonType = newWithHooks(
        GraphQLObjectType,
        {
          name: "Person",
          fields: {
            firstName: {
              type: GraphQLString,
              description:
                "@deprecated Use 'name' instead\nThe person's first name",
            },
            lastName: {
              type: GraphQLString,
              description:
                "@deprecated Use 'name' instead\nThe person's last name",
            },
            name: {
              type: new GraphQLNonNull(GraphQLString),
              description: "The person's full name",
            },
            favouriteColor: {
              type: Color,
              description: "Person's favourite colour",
            },
          },
        },
        {}
      );

      return _;
    }
  );
  builder.hook(
    "GraphQLObjectType:fields",
    (
      fields,
      { extend, getTypeByName, graphql: { GraphQLNonNull } },
      { scope: { isRootQuery } }
    ) => {
      if (!isRootQuery) {
        return fields;
      }
      const PersonType = getTypeByName("Person");
      return extend(fields, {
        theQueen: {
          type: new GraphQLNonNull(PersonType),
          resolve() {
            return {
              firstName: "Elizabeth",
              lastName: "Mountbatten-Windsor",
              name: "Her Royal Highness Queen Elizabeth II",
            };
          },
        },
      });
    }
  );
}

const plugins = [...defaultPlugins, PersonTypePlugin];

function CommentToDeprecationPlugin(builder) {
  const replaceDeprecation = field => {
    const description = field.description;
    if (!field.description || field.deprecationReason) {
      return field;
    }
    const re = /(?:^|\n)@deprecated(.*)/;
    const matches = description.match(re);
    if (matches) {
      return Object.assign({}, field, {
        description: description.replace(re, "").trim(),
        deprecationReason: matches[1].trim(),
      });
    } else {
      return field;
    }
  };
  builder.hook("GraphQLObjectType:fields:field", replaceDeprecation);
  builder.hook("GraphQLEnumType:values:value", replaceDeprecation);
}

(async () => {
  const initialSchema = await buildSchema(plugins);
  console.log(printSchema(initialSchema));

  const updatedSchema = await buildSchema([
    ...plugins,
    CommentToDeprecationPlugin,
  ]);
  console.log(printSchema(updatedSchema));
})().catch(e => {
  console.error(e);
  process.exit(1);
});
