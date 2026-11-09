import {
	View,
	Text,
	Pressable,
	StyleSheet, ScrollView,
	TextInput,
} from "react-native";

import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState, useRef } from "react";

import { addVideo } from "../database/database";
import { saveVideoLocally, deleteVideoLocally } from "../services/videoStorage";

export default function AddVideoScreen() {
	const saving = useRef(false); const [busy, setBusy] = useState(false);
 const [videoUri, setVideoUri] = useState<string | null>(null);
	const [label, setLabel] = useState("");
	const [notes, setNotes] = useState("");

	async function chooseVideo(record = false) { try { if(record){ const permission = await ImagePicker.requestCameraPermissionsAsync(); if(!permission.granted){alert("Camera permission is required to record a video.");return;} }
		const result = await (record ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync)({
			mediaTypes:    ["videos"],
			allowsEditing: false,
			quality:       1,
		});

		if (!result.canceled) {
			const uri = result.assets[0].uri;

			setVideoUri(uri);

			
		}
 } catch { alert('Could not open the video picker. Please try again.'); }
 }

 async function saveVideo() { if(saving.current)return;
		if (!videoUri) {
			alert("Please choose a video first.");
			return;
		}

		if (!label.trim()) {
			alert("Please enter a label.");
			return;
		}

 saving.current = true; setBusy(true); let permanentUri: string | undefined;
 try {
 permanentUri = saveVideoLocally(videoUri);

			await addVideo(
				label.trim(),
				notes.trim(),
				permanentUri,
			);

			

			router.replace("/");
		} catch {
			if(permanentUri){try{deleteVideoLocally(permanentUri);}catch{}}

			alert("Could not save the video. Check available storage and retry.");
 } finally { saving.current=false; setBusy(false); }
 }

 return (
		<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
			<Text style={styles.title}>Add Video</Text>

			{!videoUri ? (
				<>
					<Pressable style={styles.button} onPress={() => chooseVideo(true)}>
						<Text style={styles.buttonText}>
							Record Video
						</Text>
					</Pressable>

					<Pressable
						style={styles.button}
						onPress={() => chooseVideo()}
					>
						<Text style={styles.buttonText}>
							Choose Existing Video
						</Text>
					</Pressable>
				</>
			) : (
				<>
					<View style={styles.selectedBox}>
						<Text style={styles.selectedTitle}>
							Video selected
						</Text>

						<Text
							style={styles.selectedText}
							numberOfLines={3}
						>
							{videoUri}
						</Text>
					</View>

					<Pressable
						style={styles.changeButton}
						onPress={() => chooseVideo()}
					>
						<Text style={styles.changeButtonText}>
							Choose Different Video
						</Text>
					</Pressable>

					<Text style={styles.inputLabel}>
						Label *
					</Text>

					<TextInput
						style={styles.input}
						value={label}
						onChangeText={setLabel}
						placeholder="Video label"
					/>

					<Text style={styles.inputLabel}>
						Notes
					</Text>

					<TextInput
						style={[styles.input, styles.notesInput]}
						value={notes}
						onChangeText={setNotes}
						placeholder="Notes (optional)"
						multiline
					/>

					<Pressable
						style={styles.saveButton}
						disabled={busy} onPress={saveVideo}
					>
						<Text style={styles.saveButtonText}>
							{busy ? "Saving…" : "Save Video"}
						</Text>
					</Pressable>
				</>
			)}

			<Pressable
				style={styles.cancelButton}
				disabled={busy} onPress={() => router.back()}
			>
				<Text style={styles.cancelText}>
					Cancel
				</Text>
			</Pressable>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow:        1,
		padding:         20,
		backgroundColor: "#f5f5f5",
	},

	title: {
		fontSize:     28,
		fontWeight:   "700",
		marginBottom: 30,
	},

	button: {
		backgroundColor: "#111",
		padding:         18,
		borderRadius:    14,
		marginBottom:    14,
		alignItems:      "center",
	},

	buttonText: {
		color:      "white",
		fontSize:   17,
		fontWeight: "600",
	},

	selectedBox: {
		backgroundColor: "white",
		padding:         16,
		borderRadius:    14,
		marginBottom:    12,
	},

	selectedTitle: {
		fontSize:     18,
		fontWeight:   "700",
		marginBottom: 8,
	},

	selectedText: {
		fontSize: 13,
		opacity:  0.6,
	},

	changeButton: {
		padding:      14,
		alignItems:   "center",
		marginBottom: 20,
	},

	changeButtonText: {
		fontSize:   15,
		fontWeight: "600",
	},

	inputLabel: {
		fontSize:     16,
		fontWeight:   "600",
		marginBottom: 8,
	},

	input: {
		backgroundColor: "white",
		padding:         14,
		borderRadius:    12,
		fontSize:        16,
		marginBottom:    20,
	},

	notesInput: {
		minHeight:         100,
		textAlignVertical: "top",
	},

	saveButton: {
		backgroundColor: "#111",
		padding:         18,
		borderRadius:    14,
		alignItems:      "center",
	},

	saveButtonText: {
		color:      "white",
		fontSize:   17,
		fontWeight: "700",
	},

	cancelButton: {
		marginTop:  20,
		alignItems: "center",
	},

	cancelText: {
		fontSize: 16,
	},
});


