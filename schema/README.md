# W H A T
The codes for tables, columns, rpc functions that are needed in **Supabase** 
and the indices for **Redis Stack**.

# W H Y
To setup everything needed in **Supabase** and partially needed in **Redis Stack**.

# H O W
> *You must have already made a project on the Supabase at [Supabase](https://supabase.com/)*

## 1. Run the Schema
- Go to your Supabase project dashboard
- Navigate to **SQL Editor** (left sidebar)
- Copy the **entire content** of `supabase/schema.sql` and paste it into the editor, then click **Run**
- In the same **SQL Editor**, copy the **entire content** of `supabase/rpc.sql` and paste it into the editor, then click **Run**

> *Run `schema.sql` before `rpc.sql` — the functions depend on the tables being created first*


*in case you're wondering, leave `dictIndex.redis ` there*