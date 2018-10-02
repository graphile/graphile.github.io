module.exports = function PgNumericToFloatPlugin(
  builder,
  { pgNumericToFloatPrecisionCap = 12, pgNumericToFloatScaleCap = 2 }
) {
  builder.hook("init", (_init, build) => {
    // Register a type handler for NUMERIC / DECIMAL (oid = 1700)
    build.pgRegisterGqlTypeByTypeId("1700", (_set, modifier) => {
      if (modifier && typeof modifier === "number" && modifier > 0) {
        // Ref: https://stackoverflow.com/a/3351120/141284
        const precision = ((modifier - 4) >> 16) & 65535;
        const scale = (modifier - 4) & 65535;
        if (
          precision <= pgNumericToFloatPrecisionCap &&
          scale <= pgNumericToFloatScaleCap
        ) {
          // This number is no more precise than our cap, so we're declaring
          // that we can handle it as a float:
          return build.graphql.GraphQLFloat;
        }
      }
      // If all else fails, let PostGraphile do it's default handling - i.e.
      // BigFloat
      return null;
    });

    // We didn't modify _init, but we still must return it.
    return _init;
  });
};
