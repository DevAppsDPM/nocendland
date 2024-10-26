import { SupabaseService } from "@app/api/services/supabase.service";

export abstract class supabaseService {
    public abstract tableName: string

    constructor(protected supabaseService: SupabaseService) {
        
    }

}