// Supabase Configuration
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Tumhari Keys
const SUPABASE_URL = 'https://udxhhmbqakqworrwcabd.supabase.co'
const SUPABASE_KEY = 'sb_publishable_sqWZR6hPMDp_chkBLTXuQg_CFnprc3k'

// Client Create Karo
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Order Save Karne Ka Function
export async function saveOrder(orderData) {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
  
  if (error) {
    console.error('Order Error:', error)
    return false
  }
  
  return true
}