---
layout: page
path: /postgraphile/function-restrictions/
title: PostGraphile Function Restrictions
---

## Function Restrictions

PostGraphile doesn't support all PostgreSQL functions yet (though there's [a
PR almost complete](https://github.com/graphile/graphile-engine/pull/296) to
add much broader support!); here's some common restrictions that effect
Custom Queries, Custom Mutations and Computed Columns, and how to work around
the restrictions.

~~If you'd like to help lift these restrictions, the place to start would be
[`makeProcField`](https://github.com/graphile/graphile-engine/blob/69d7b1cbe48ea5f50e3121916e7b1e12d1c70008/packages/graphile-build-pg/src/plugins/makeProcField.js)~~

### Must return a named type

PostGraphile uses the type name to determine what type to add to the schema;
we do not currently construct a dynamic type specific to the function so
we do not support "anonymous" or "inline" types.

Here's some examples of functions that are not supported, and how to solve it:

```sql
# NOT SUPPORTED:
CREATE FUNCTION my_func()
RETURNS TABLE (a int, b text)
AS $$
  ...
$$ LANGUAGE SQL STABLE;

# Workaround:
CREATE TABLE my_func_return_type (
  a int,
  b text
);
# or:
#CREATE TYPE my_func_return_type AS (
#  a int,
#  b text
#);

CREATE FUNCTION my_func()
RETURNS my_func_return_type
AS $$
  ...
$$ LANGUAGE SQL STABLE;
```

```sql
# NOT SUPPORTED:
CREATE FUNCTION my_func()
RETURNS RECORD
AS $$
  ...
$$ LANGUAGE SQL STABLE;

# Workaround:
CREATE TYPE my_func_return_type AS (
  ...
);
CREATE FUNCTION my_func()
RETURNS my_func_return_type
AS $$
  ...
$$ LANGUAGE SQL STABLE;
```

### Must not be VARIADIC

We don't support VARIADIC functions yet.

### Must not use IN / OUT / INOUT arguments

We currently don't support these; but it should be easy to rewrite most
functions to omit this syntax.

```sql
# NOT SUPPORTED:
CREATE FUNCTION add(IN a int, IN b int, OUT result int)
AS $$
BEGIN
  result = a + b;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

# Workaround
CREATE FUNCTION add(a int, b int) RETURNS int
AS $$
BEGIN
  return a + b;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

# Alternative workaround
CREATE FUNCTION add(a int, b int) RETURNS int
AS $$
DECLARE
  result int;
BEGIN
  result = a + b;
  return result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```
