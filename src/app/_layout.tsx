import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { initDatabase } from '../database/database';
import { initializeVideoStorage } from '../services/videoStorage';
export default function Layout() {
 const [ready, setReady] = useState(false);
 const [error, setError] = useState(false);
 async function initialize() {

  try { await initDatabase(); initializeVideoStorage(); setReady(true); } catch { setError(true); }
 }
 useEffect(() => { let active = true; initDatabase().then(() => { initializeVideoStorage(); if (active) setReady(true); }).catch(() => { if (active) setError(true); }); return () => { active = false; }; }, []);
 if (!ready) return <View style={{flex:1,justifyContent:'center',padding:24}}>{error ? <><Text>Could not open local storage. Free some device space and retry.</Text><Button title="Retry" onPress={() => { setError(false); void initialize(); }}/></> : <ActivityIndicator/>}</View>;
 return <Stack screenOptions={{contentStyle:{backgroundColor:'#f5f5f5'}}}><Stack.Screen name="index" options={{title:'VideoLabeler'}}/><Stack.Screen name="add" options={{title:'Add video'}}/><Stack.Screen name="video" options={{title:'Video details'}}/></Stack>;
}



