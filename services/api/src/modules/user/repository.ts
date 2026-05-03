import { getSupabaseAdminClient } from "core/supabase/supabase.js";
import { throwIfErrorBasic, throwIfErrorRegister } from "./utils.js";
import { BadRequestError, UnauthorizedError } from "src/errors/httpError.js";
import { SupabaseError } from "src/errors/internalError.js";
import type { ProfileRow } from "src/core/supabase/type.js";
import { deleteCookie } from "hono/cookie";

async function loginWithEmailPassword(email: string, password: string)
: Promise<{ userId: string; username: string; timezone: string; accesstoken: string; refreshtoken: string }>
{
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    throwIfErrorBasic(error);

    if (!data.user || !data.session) {
        throw new SupabaseError("No user or session returned", undefined, undefined);
    }

    if (!data.session.refresh_token) {
        throw new SupabaseError("No refresh token returned", undefined, undefined);
    }

    const username: string =
        data.user.user_metadata?.["username"] ??
        data.user.email ??
        "user";

    const { data: profileData } = await supabase
        .from("profiles")
        .select("settings")
        .eq("id", data.user.id)
        .single();

    const settings = (profileData?.settings ?? {}) as { timezone?: string };
    const timezone: string = settings.timezone ?? "Asia/Bangkok";

    return {
        userId: data.user.id,
        username,
        timezone,
        accesstoken: data.session.access_token,
        refreshtoken: data.session.refresh_token,
    };
}


async function registerWithEmailPassword(username: string, email: string, password: string, timezone: string)
: Promise<string>
{
    const supabase = getSupabaseAdminClient();

    // Create user in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username }
        },
    });

    throwIfErrorRegister(authError, "Registration Error");
    if (!authData.user) {
        throw new SupabaseError("No user returned", undefined, undefined);
    }

    const { error } = await supabase
        .from("profiles")
        .insert({
            id: authData.user.id,
            settings: { timezone }
        });

    throwIfErrorRegister(error, "Profile creation error");

    return authData.user.id;
}


async function getUserById(userId: string)
: Promise<{ username: string; timezone: string } | null>
{
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase.auth.admin.getUserById(userId);

    throwIfErrorBasic(error);

    if (!data.user) return null;

    const username: string =
        data.user.user_metadata?.["username"] ??
        data.user.email ??
        "user";

    const { data: profileData } = await supabase
        .from("profiles")
        .select("settings")
        .eq("id", userId)
        .single();

    const settings = (profileData?.settings ?? {}) as { timezone?: string };
    const timezone: string = settings.timezone ?? "Asia/Bangkok";

    return { username, timezone };
}


async function validateAccessToken(accesstoken: string)
: Promise<{ userId: string }>
{
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase.auth.getUser(accesstoken);

    if (error || !data.user) {
        throw new UnauthorizedError("Invalid or expired access token");
    }

    return { userId: data.user.id };
}


async function refreshAccessToken(refreshtoken: string)
: Promise<{ accesstoken: string; refreshtoken: string }>
{
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshtoken,
    });

    throwIfErrorBasic(error);

    if (!data.session || !data.session.access_token || !data.session.refresh_token) {
        throw new SupabaseError("No tokens returned from refresh", undefined, undefined);
    }

    return {
        accesstoken: data.session.access_token,
        refreshtoken: data.session.refresh_token,
    };
}


// FIXME: no item is created on the "profiles" page right now;
async function updateUserSettings(userId: string, settings: { timezone: string })
: Promise<void> 
{
    const supabase = getSupabaseAdminClient();

    const { error } = await supabase.rpc("update_profile", {
        "param_users_id": userId,
        "param_settings": settings
    });

    throwIfErrorBasic(error);
}


export {
    loginWithEmailPassword,
    registerWithEmailPassword,
    getUserById,
    validateAccessToken,
    refreshAccessToken,
    updateUserSettings,
};
