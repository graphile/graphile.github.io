/**
 * Occasionally you'll want to create a bunch of rows in different tables in a
 * single mutation. Here's an example of how to do that.
 *
 * Pretend we're registering quiz entries, and we want to store each answer in
 * its own table as we want to be able to operate on the answers independently
 * later.
 *
 * This means we want:
 *
 *  1. A mutation that takes input data for inserting one quiz entry and
 *  multiple answers.
 *  2. A function that inserts a new quiz entry, inserts an answer for each
 *  answer provided in the input data, and connects each answer to the created
 *  quiz entry.
 *  3. Finally, we want the function to return the inserted quiz entry itself.
 */

/**
 * These are the tables we're using in this example
 */
create table quiz (
  id serial primary key,
  name text not null
);

create table quiz_entry (
  id serial primary key,
  user_id int not null references users(id),
  quiz_id int not null references quiz(id)
);

create table quiz_entry_answer (
  id serial primary key,
  quiz_entry_id int not null references quiz_entry(id),
  question text not null,
  answer int
);

/**
 * This type is used for input in the mutation
 */
create type quiz_entry_input as (
  question text,
  answer int
);

/**
 * Here's the function that gets turned into a "custom mutation"
 */
create function add_quiz_entry(
  quiz_id int,
  answers quiz_entry_input[]
)
returns quiz_entry
as $$
  declare
    q quiz_entry;
    a quiz_entry_answer;
  begin
    insert into quiz_entry(user_id, quiz_id)
      values(current_user_id(), quiz_id)
      returning * into q;

    foreach a in array answers loop
      insert into quiz_entry_answer(quiz_entry_id, question, answer)
        values (quiz_id, a.question, a.answer);
    end loop;

    return q;
  end;
$$ language plpgsql volatile strict set search_path from current;
