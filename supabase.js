// Ganti dengan project Supabase kamu
const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_KEY = "YOUR-ANON-KEY";

async function submitScore(username,score){
  await fetch(`${SUPABASE_URL}/rest/v1/scores`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "apikey":SUPABASE_KEY,
      "Authorization":"Bearer "+SUPABASE_KEY
    },
    body:JSON.stringify({username,score})
  });
}
async function getLeaderboard(){
  let res=await fetch(`${SUPABASE_URL}/rest/v1/scores?select=*order=score.desc&limit=10`,{
    headers:{apikey:SUPABASE_KEY,Authorization:"Bearer "+SUPABASE_KEY}
  });
  return {data:await res.json()};
}