create function viewer()
returns users
as $$
  select *
  from users
  where id = current_user_id();
  /*
   * current_user_id() is a function
   * that returns the logged in user's
   * id, e.g. by extracting from the JWT
   * or indicated via pgSettings.
   */
$$ language sql stable set search_path from current;
