
These are code that needed in Supabase  

<br>

# Setup
> *You must have already made a project on the Supabase at [Supabase](https://supabase.com/)*

## 1. Run the Schema
- Go to your Supabase project dashboard
- Navigate to **SQL Editor** (left sidebar)
- Copy the **entire content** of `supabase/schema.sql` and paste it into the editor, then click **Run**
- In the same **SQL Editor**, copy the **entire content** of `supabase/rpc.sql` and paste it into the editor, then click **Run**

> *Run `schema.sql` before `rpc.sql` — the functions depend on the tables being created first*


*in case you're wondering, leave `dictIndex.redis ` there*