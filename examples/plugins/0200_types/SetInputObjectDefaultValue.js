/**
 * This plugin sets a defaultValue on all input object fields that match the
 * given criteria (specifically the 'create' input types, for columns named
 * 'name')
 */
module.exports = function SetInputObjectDefaultValue(builder) {
  builder.hook(
    "GraphQLInputObjectType:fields:field",
    (field, build, context) => {
      const {
        scope: {
          isPgRowType,
          isInputType,
          isPgPatch,
          pgFieldIntrospection: attr,
        },
      } = context;
      if (
        !isPgRowType ||
        !isInputType ||
        isPgPatch ||
        !attr ||
        attr.kind !== "attribute" ||
        attr.name !== "name"
      ) {
        return field;
      }

      return {
        ...field,
        type: build.graphql.getNamedType(field.type), // Since it has a default, it can be nullable
        defaultValue:
          // attr.tags.defaultValue: enables overriding this with a
          // `@defaultValue Alice Smith` smart comment
          attr.tags.defaultValue || "Bobby Tables",
      };
    }
  );
};
