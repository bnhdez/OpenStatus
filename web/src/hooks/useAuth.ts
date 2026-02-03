import { useEffect, useState } from "react";
import { supabaseClient } from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";

export function useAuth() {

    const [session, setSession] = useState<Session | null>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        // Revisar si hay sesion activa
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false)
        })

        // listener para saber si usuario se loguea o desloguea
        const {
            data: { subscription },
        } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        })

        return () => subscription.unsubscribe();

    }, [])
    
    return {
        session,
        loading,
        // login con otp
        login: async (email: string, password: string) => {
            const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
            return { error }
        },
        logout: () => supabaseClient.auth.signOut()
    }

}