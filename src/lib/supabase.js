import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signUp = (email, password) => 
  supabase.auth.signUp({ email, password })

export const signIn = (email, password) => 
  supabase.auth.signInWithPassword({ email, password })

export const signOut = () => supabase.auth.signOut()

export const getSession = () => supabase.auth.getSession()

// Database helpers
export const getProfile = async (userId) => {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data
}

export const getBrands = async (userId) => {
  const { data } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data
}

export const getCampaigns = async (brandId) => {
  const { data } = await supabase
    .from('campaigns')
    .select('*')
    .eq('brand_id', brandId)
    .order('created_at', { ascending: false })
  return data
}

export const getContent = async (campaignId) => {
  const { data } = await supabase
    .from('content')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false })
  return data
}

export const getMessages = async (userId) => {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  return data
}

export const saveMessage = async (userId, content, sender) => {
  const { data } = await supabase
    .from('messages')
    .insert({ user_id: userId, content, sender })
    .select()
    .single()
  return data
}

export const updateContentStatus = async (contentId, status, reviewedBy) => {
  const { data } = await supabase
    .from('content')
    .update({ status, reviewed_by: reviewedBy, reviewed_at: new Date().toISOString() })
    .eq('id', contentId)
    .select()
    .single()
  return data
}

// File uploads
export const uploadAsset = async (userId, file, folder = 'assets') => {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${Date.now()}.${ext}`
  
  const { data, error } = await supabase.storage
    .from(folder)
    .upload(path, file)
  
  if (error) throw error
  
  const { data: urlData } = supabase.storage
    .from(folder)
    .getPublicUrl(path)
  
  return urlData.publicUrl
}