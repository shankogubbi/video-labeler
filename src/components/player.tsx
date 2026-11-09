import { useVideoPlayer, VideoView } from 'expo-video';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
export default function Player({uri}:{uri:string}) {
 const player = useVideoPlayer(uri);
 useFocusEffect(useCallback(() => () => { player.pause(); }, [player]));
 return <VideoView player={player} nativeControls style={{width:'100%',height:240,backgroundColor:'black'}}/>;
}
