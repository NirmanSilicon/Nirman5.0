export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bids: {
        Row: {
          amount: number
          amount_usd: number | null
          bidder_id: string
          created_at: string
          id: string
          nft_id: string
          status: string
        }
        Insert: {
          amount: number
          amount_usd?: number | null
          bidder_id: string
          created_at?: string
          id?: string
          nft_id: string
          status?: string
        }
        Update: {
          amount?: number
          amount_usd?: number | null
          bidder_id?: string
          created_at?: string
          id?: string
          nft_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          added_at: string
          id: string
          nft_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          nft_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          added_at?: string
          id?: string
          nft_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          banner_url: string | null
          blockchain: Database["public"]["Enums"]["blockchain_type"] | null
          created_at: string
          creator_id: string
          description: string | null
          floor_price: number | null
          id: string
          image_url: string | null
          is_verified: boolean | null
          name: string
          royalty_percentage: number | null
          slug: string
          total_sales: number | null
          total_supply: number | null
          total_volume: number | null
          unique_owners: number | null
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          blockchain?: Database["public"]["Enums"]["blockchain_type"] | null
          created_at?: string
          creator_id: string
          description?: string | null
          floor_price?: number | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          name: string
          royalty_percentage?: number | null
          slug: string
          total_sales?: number | null
          total_supply?: number | null
          total_volume?: number | null
          unique_owners?: number | null
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          blockchain?: Database["public"]["Enums"]["blockchain_type"] | null
          created_at?: string
          creator_id?: string
          description?: string | null
          floor_price?: number | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          name?: string
          royalty_percentage?: number | null
          slug?: string
          total_sales?: number | null
          total_supply?: number | null
          total_volume?: number | null
          unique_owners?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number | null
          nft_id: string
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          nft_id: string
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          nft_id?: string
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nfts: {
        Row: {
          auction_end_date: string | null
          badges: string[] | null
          bid_increment: number | null
          blockchain: Database["public"]["Enums"]["blockchain_type"] | null
          collection_id: string | null
          created_at: string
          creator_id: string
          current_bid: number | null
          description: string | null
          editions: number | null
          editions_available: number | null
          floor_price: number | null
          highest_bidder_id: string | null
          id: string
          image_url: string
          is_auction: boolean | null
          is_listed: boolean | null
          is_minted: boolean | null
          launch_date: string | null
          likes_count: number | null
          media_type: string | null
          name: string
          owner_id: string | null
          price: number | null
          price_usd: number | null
          rarity_score: number | null
          reserve_price: number | null
          royalty_percentage: number | null
          sale_type: Database["public"]["Enums"]["sale_type"] | null
          starting_bid: number | null
          token_id: string | null
          traits: Json | null
          updated_at: string
          views_count: number | null
        }
        Insert: {
          auction_end_date?: string | null
          badges?: string[] | null
          bid_increment?: number | null
          blockchain?: Database["public"]["Enums"]["blockchain_type"] | null
          collection_id?: string | null
          created_at?: string
          creator_id: string
          current_bid?: number | null
          description?: string | null
          editions?: number | null
          editions_available?: number | null
          floor_price?: number | null
          highest_bidder_id?: string | null
          id?: string
          image_url: string
          is_auction?: boolean | null
          is_listed?: boolean | null
          is_minted?: boolean | null
          launch_date?: string | null
          likes_count?: number | null
          media_type?: string | null
          name: string
          owner_id?: string | null
          price?: number | null
          price_usd?: number | null
          rarity_score?: number | null
          reserve_price?: number | null
          royalty_percentage?: number | null
          sale_type?: Database["public"]["Enums"]["sale_type"] | null
          starting_bid?: number | null
          token_id?: string | null
          traits?: Json | null
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          auction_end_date?: string | null
          badges?: string[] | null
          bid_increment?: number | null
          blockchain?: Database["public"]["Enums"]["blockchain_type"] | null
          collection_id?: string | null
          created_at?: string
          creator_id?: string
          current_bid?: number | null
          description?: string | null
          editions?: number | null
          editions_available?: number | null
          floor_price?: number | null
          highest_bidder_id?: string | null
          id?: string
          image_url?: string
          is_auction?: boolean | null
          is_listed?: boolean | null
          is_minted?: boolean | null
          launch_date?: string | null
          likes_count?: number | null
          media_type?: string | null
          name?: string
          owner_id?: string | null
          price?: number | null
          price_usd?: number | null
          rarity_score?: number | null
          reserve_price?: number | null
          royalty_percentage?: number | null
          sale_type?: Database["public"]["Enums"]["sale_type"] | null
          starting_bid?: number | null
          token_id?: string | null
          traits?: Json | null
          updated_at?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nfts_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfts_highest_bidder_id_fkey"
            columns: ["highest_bidder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          bidder_id: string
          created_at: string
          expires_at: string | null
          id: string
          nft_id: string
          price: number
          price_usd: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          bidder_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          nft_id: string
          price: number
          price_usd?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          bidder_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          nft_id?: string
          price?: number
          price_usd?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          nft_id: string
          order_id: string
          price_at_purchase: number
          price_usd_at_purchase: number | null
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          nft_id: string
          order_id: string
          price_at_purchase: number
          price_usd_at_purchase?: number | null
          quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          nft_id?: string
          order_id?: string
          price_at_purchase?: number
          price_usd_at_purchase?: number | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          blockchain: Database["public"]["Enums"]["blockchain_type"] | null
          created_at: string
          discount_applied: number | null
          id: string
          payment_method: string | null
          status: string
          total_amount: number
          total_amount_usd: number | null
          transaction_hash: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          blockchain?: Database["public"]["Enums"]["blockchain_type"] | null
          created_at?: string
          discount_applied?: number | null
          id?: string
          payment_method?: string | null
          status?: string
          total_amount?: number
          total_amount_usd?: number | null
          transaction_hash?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          blockchain?: Database["public"]["Enums"]["blockchain_type"] | null
          created_at?: string
          discount_applied?: number | null
          id?: string
          payment_method?: string | null
          status?: string
          total_amount?: number
          total_amount_usd?: number | null
          transaction_hash?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_verifications: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          otp: string
          phone: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          otp: string
          phone: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          otp?: string
          phone?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      price_history: {
        Row: {
          collection_id: string | null
          id: string
          nft_id: string | null
          price: number
          price_usd: number | null
          recorded_at: string
        }
        Insert: {
          collection_id?: string | null
          id?: string
          nft_id?: string | null
          price: number
          price_usd?: number | null
          recorded_at?: string
        }
        Update: {
          collection_id?: string | null
          id?: string
          nft_id?: string | null
          price?: number
          price_usd?: number | null
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_history_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_history_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          followers_count: number | null
          following_count: number | null
          id: string
          is_verified: boolean | null
          notification_preferences: Json | null
          phone_number: string | null
          phone_verified: boolean | null
          total_volume: number | null
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"] | null
          username: string | null
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          is_verified?: boolean | null
          notification_preferences?: Json | null
          phone_number?: string | null
          phone_verified?: boolean | null
          total_volume?: number | null
          updated_at?: string
          user_id: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
          username?: string | null
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          is_verified?: boolean | null
          notification_preferences?: Json | null
          phone_number?: string | null
          phone_verified?: boolean | null
          total_volume?: number | null
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
          username?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          block_number: number | null
          blockchain: Database["public"]["Enums"]["blockchain_type"] | null
          collection_id: string | null
          created_at: string
          from_user_id: string | null
          gas_fee: number | null
          id: string
          nft_id: string | null
          price: number | null
          price_usd: number | null
          to_user_id: string | null
          transaction_hash: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          block_number?: number | null
          blockchain?: Database["public"]["Enums"]["blockchain_type"] | null
          collection_id?: string | null
          created_at?: string
          from_user_id?: string | null
          gas_fee?: number | null
          id?: string
          nft_id?: string | null
          price?: number | null
          price_usd?: number | null
          to_user_id?: string | null
          transaction_hash?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          block_number?: number | null
          blockchain?: Database["public"]["Enums"]["blockchain_type"] | null
          collection_id?: string | null
          created_at?: string
          from_user_id?: string | null
          gas_fee?: number | null
          id?: string
          nft_id?: string | null
          price?: number | null
          price_usd?: number | null
          to_user_id?: string | null
          transaction_hash?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_rewards: {
        Row: {
          completed_transactions: number | null
          created_at: string
          discount_percentage: number | null
          id: string
          last_reward_date: string | null
          reward_unlocked: boolean | null
          reward_used: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_transactions?: number | null
          created_at?: string
          discount_percentage?: number | null
          id?: string
          last_reward_date?: string | null
          reward_unlocked?: boolean | null
          reward_used?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_transactions?: number | null
          created_at?: string
          discount_percentage?: number | null
          id?: string
          last_reward_date?: string | null
          reward_unlocked?: boolean | null
          reward_used?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      watchlists: {
        Row: {
          alert_type: string | null
          collection_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          nft_id: string | null
          target_price: number | null
          user_id: string
        }
        Insert: {
          alert_type?: string | null
          collection_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          nft_id?: string | null
          target_price?: number | null
          user_id: string
        }
        Update: {
          alert_type?: string | null
          collection_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          nft_id?: string | null
          target_price?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchlists_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watchlists_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watchlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          nft_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nft_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nft_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      blockchain_type: "ethereum" | "polygon" | "solana" | "bitcoin"
      sale_type: "fixed" | "auction" | "offers"
      transaction_type:
        | "mint"
        | "list"
        | "delist"
        | "sale"
        | "transfer"
        | "offer_accepted"
        | "instant_sell"
        | "royalty_payout"
      user_type: "creator" | "collector"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      blockchain_type: ["ethereum", "polygon", "solana", "bitcoin"],
      sale_type: ["fixed", "auction", "offers"],
      transaction_type: [
        "mint",
        "list",
        "delist",
        "sale",
        "transfer",
        "offer_accepted",
        "instant_sell",
        "royalty_payout",
      ],
      user_type: ["creator", "collector"],
    },
  },
} as const
