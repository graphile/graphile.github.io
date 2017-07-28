const mergeSchemaPluginFactory = otherSchema => builder => {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, { extend }, { scope: { isRootMutation, isRootQuery } }) => {
      if (isRootMutation) {
        return extend(fields, otherSchema.getMutationType().getFields());
      } else if (isRootQuery) {
        return extend(fields, otherSchema.getQueryType().getFields());
      } else {
        return fields;
      }
    }
  );
};
