/*
 * Returns the primary email of the
 * current user; for all other users
 * this function will return null.
 */
create function "users_primaryEmail"(u users)
returns text
as $$
  select email
  from user_emails
  where user_id = current_user_id()
  and user_id = u.id
  and is_verified is true
  order by id asc
  limit 1;
$$ language sql stable set search_path from current;
