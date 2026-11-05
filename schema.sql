


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."matches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "student_id" "uuid",
    "recruiter_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."matches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "match_id" "uuid",
    "sender_id" "uuid",
    "content" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "role" "text" NOT NULL,
    "name" "text" NOT NULL,
    "bio" "text",
    "profile_pic_url" "text",
    "resume_url" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "waitlist" boolean,
    CONSTRAINT "profiles_role_check" CHECK (("role" = ANY (ARRAY['student'::"text", 'recruiter'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."recruiter_details" (
    "id" "uuid" NOT NULL,
    "company_name" "text",
    "company_industry" "text",
    "user_role" "text",
    "looking_for" "text"[],
    "preferred_majors" "text"[],
    "work_type" "text"
);


ALTER TABLE "public"."recruiter_details" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."recruiter_habits" (
    "id" "uuid" NOT NULL,
    "values_most" "text"[] DEFAULT '{}'::"text"[],
    "work_style" "text"[] DEFAULT '{}'::"text"[],
    "interview_theme" "text"[] DEFAULT '{}'::"text"[],
    "leader_traits" "text"[] DEFAULT '{}'::"text"[]
);


ALTER TABLE "public"."recruiter_habits" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."student_details" (
    "id" "uuid" NOT NULL,
    "school" "text",
    "birthday" "date",
    "education_level" "text",
    "major" "text",
    "graduation_year" integer,
    "industries" "text"[],
    "role_types" "text"[]
);


ALTER TABLE "public"."student_details" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."student_habits" (
    "id" "uuid" NOT NULL,
    "personality" "text"[] DEFAULT '{}'::"text"[],
    "three_words" "text"[] DEFAULT '{}'::"text"[],
    "team_role" "text"[] DEFAULT '{}'::"text"[],
    "startup_style" "text"[] DEFAULT '{}'::"text"[],
    "chaos_response" "text"[] DEFAULT '{}'::"text"[]
);


ALTER TABLE "public"."student_habits" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."surveys" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "answers" "jsonb",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."surveys" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."swipes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "swiper_id" "uuid",
    "target_id" "uuid",
    "direction" "text",
    CONSTRAINT "swipes_direction_check" CHECK (("direction" = ANY (ARRAY['like'::"text", 'dislike'::"text"])))
);


ALTER TABLE "public"."swipes" OWNER TO "postgres";


ALTER TABLE ONLY "public"."matches"
    ADD CONSTRAINT "matches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."recruiter_details"
    ADD CONSTRAINT "recruiter_details_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."recruiter_habits"
    ADD CONSTRAINT "recruiter_habits_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."student_details"
    ADD CONSTRAINT "student_details_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."student_habits"
    ADD CONSTRAINT "student_habits_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."surveys"
    ADD CONSTRAINT "surveys_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."swipes"
    ADD CONSTRAINT "swipes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."matches"
    ADD CONSTRAINT "matches_recruiter_id_fkey" FOREIGN KEY ("recruiter_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."matches"
    ADD CONSTRAINT "matches_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."recruiter_details"
    ADD CONSTRAINT "recruiter_details_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."recruiter_habits"
    ADD CONSTRAINT "recruiter_habits_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."student_details"
    ADD CONSTRAINT "student_details_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."student_habits"
    ADD CONSTRAINT "student_habits_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."surveys"
    ADD CONSTRAINT "surveys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."swipes"
    ADD CONSTRAINT "swipes_swiper_id_fkey" FOREIGN KEY ("swiper_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."swipes"
    ADD CONSTRAINT "swipes_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Participants can insert messages" ON "public"."messages" FOR INSERT WITH CHECK ((("sender_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."matches"
  WHERE (("matches"."id" = "messages"."match_id") AND (("matches"."student_id" = "auth"."uid"()) OR ("matches"."recruiter_id" = "auth"."uid"())))))));



CREATE POLICY "Participants can read messages" ON "public"."messages" FOR SELECT USING ((("sender_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."matches"
  WHERE (("matches"."id" = "messages"."match_id") AND (("matches"."student_id" = "auth"."uid"()) OR ("matches"."recruiter_id" = "auth"."uid"())))))));



CREATE POLICY "Users can insert their own swipes" ON "public"."swipes" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "swiper_id"));



CREATE POLICY "Users can read swipes relevant to them" ON "public"."swipes" FOR SELECT TO "authenticated" USING ((("auth"."uid"() = "swiper_id") OR ("auth"."uid"() = "target_id")));



ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."matches";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."messages";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."profiles";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."recruiter_details";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."recruiter_habits";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."student_details";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."student_habits";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."surveys";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."swipes";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."matches" TO "anon";
GRANT ALL ON TABLE "public"."matches" TO "authenticated";
GRANT ALL ON TABLE "public"."matches" TO "service_role";



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."recruiter_details" TO "anon";
GRANT ALL ON TABLE "public"."recruiter_details" TO "authenticated";
GRANT ALL ON TABLE "public"."recruiter_details" TO "service_role";



GRANT ALL ON TABLE "public"."recruiter_habits" TO "anon";
GRANT ALL ON TABLE "public"."recruiter_habits" TO "authenticated";
GRANT ALL ON TABLE "public"."recruiter_habits" TO "service_role";



GRANT ALL ON TABLE "public"."student_details" TO "anon";
GRANT ALL ON TABLE "public"."student_details" TO "authenticated";
GRANT ALL ON TABLE "public"."student_details" TO "service_role";



GRANT ALL ON TABLE "public"."student_habits" TO "anon";
GRANT ALL ON TABLE "public"."student_habits" TO "authenticated";
GRANT ALL ON TABLE "public"."student_habits" TO "service_role";



GRANT ALL ON TABLE "public"."surveys" TO "anon";
GRANT ALL ON TABLE "public"."surveys" TO "authenticated";
GRANT ALL ON TABLE "public"."surveys" TO "service_role";



GRANT ALL ON TABLE "public"."swipes" TO "anon";
GRANT ALL ON TABLE "public"."swipes" TO "authenticated";
GRANT ALL ON TABLE "public"."swipes" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































