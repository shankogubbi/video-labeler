import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, Text, TextInput } from 'react-native';
import { getVideos, updateVideo, removeVideo, VideoRecord } from '../database/database';
import { deleteVideoLocally } from '../services/videoStorage';
import Player from '../components/player';
export default function VideoScreen() {
 const {id} = useLocalSearchParams<{id:string}>();
 const [video,setVideo] = useState<VideoRecord>();
 const [label,setLabel] = useState(''); const [notes,setNotes] = useState('');
 const [message,setMessage] = useState('Loading…'); const [busy,setBusy] = useState(false);
 useEffect(() => { let active=true; getVideos().then(rows=>{if(!active)return; const row=rows.find(v=>String(v.id)===id); if(row){setVideo(row);setLabel(row.label);setNotes(row.notes ?? '');}else setMessage('Video not found.');}).catch(()=>setMessage('Could not load video.')); return()=>{active=false;}; },[id]);
 if(!video)return <Text style={{padding:24}}>{message}</Text>;
 async function save(){if(!video || busy)return;if(!label.trim()){Alert.alert('Enter a label');return;}setBusy(true);try{await updateVideo(video.id,label.trim(),notes.trim());router.back();}catch{Alert.alert('Could not save changes');}finally{setBusy(false);}}
 function remove(){Alert.alert('Delete video?','This permanently removes the saved copy and its label.',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:async()=>{if(!video || busy)return;setBusy(true);try{await removeVideo(video.id);try{deleteVideoLocally(video.file_uri);}catch{}router.replace('/');}catch{Alert.alert('Could not delete video');setBusy(false);}}}]);}
 return <ScrollView contentContainerStyle={{padding:20,gap:16}}><Player uri={video.file_uri}/><Text>Label</Text><TextInput accessibilityLabel="Label" value={label} onChangeText={setLabel} style={{backgroundColor:'white',padding:14}}/><Text>Notes</Text><TextInput accessibilityLabel="Notes" value={notes} onChangeText={setNotes} multiline style={{backgroundColor:'white',padding:14,minHeight:100}}/><Button title="Save changes" disabled={busy} onPress={save}/><Button title="Delete video" color="#b91c1c" disabled={busy} onPress={remove}/></ScrollView>;
}
