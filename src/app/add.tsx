import {
	View,
	Text,
	Pressable,
	StyleSheet,
	TextInput,
} from "react-native";

import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

import { addVideo } from "../database/database";
import { saveVideoLocally } from "../services/videoStorage";

export default function AddVideoScreen() {
	const [videoUri, setVideoUri] = useState<string | null>(null);
	const [label, setLabel] = useState("");
	const [notes, setNotes] = useState("");

	async function chooseVideo() {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["videos"],
			allowsEditing: false,
			quality: 1,
		});

		if (!result.canceled) {
			const uri = result.assets[0].uri;

			setVideoUri(uri);

			console.log("Selected video:", uri);
		}
	}

	async function saveVideo() {
		if (!videoUri) {
			alert("Please choose a video first.");
			return;
		}

		if (!label.trim()) {
			alert("Please enter a label.");
			return;
		}

		try {
			const permanentUri = saveVideoLocally(videoUri);

			await addVideo(
				label.trim(),
				notes.trim(),
				permanentUri
			);

			alert("Video saved successfully.");

			router.replace("/");
		} catch (error) {
			console.error("Save error:", error);

			alert("Could not save the video.");
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Add Video</Text>

			{!videoUri ? (
				<>
					<Pressable style={styles.button}>
						<Text style={styles.buttonText}>
							Record Video
						</Text>
					</Pressable>

					<Pressable
						style={styles.button}
						onPress={chooseVideo}
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
						onPress={chooseVideo}
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
						placeholder="Example: Sample 01"
					/>

					<Text style={styles.inputLabel}>
						Notes
					</Text>

					<TextInput
						style={[styles.input, styles.notesInput]}
						value={notes}
						onChangeText={setNotes}
						placeholder="Optional notes..."
						multiline
					/>

					<Pressable
						style={styles.saveButton}
						onPress={saveVideo}
					>
						<Text style={styles.saveButtonText}>
							Save Video
						</Text>
					</Pressable>
				</>
			)}

			<Pressable
				style={styles.cancelButton}
				onPress={() => router.back()}
			>
				<Text style={styles.cancelText}>
					Cancel
				</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#f5f5f5",
	},

	title: {
		fontSize: 28,
		fontWeight: "700",
		marginBottom: 30,
	},

	button: {
		backgroundColor: "#111",
		padding: 18,
		borderRadius: 14,
		marginBottom: 14,
		alignItems: "center",
	},

	buttonText: {
		color: "white",
		fontSize: 17,
		fontWeight: "600",
	},

	selectedBox: {
		backgroundColor: "white",
		padding: 16,
		borderRadius: 14,
		marginBottom: 12,
	},

	selectedTitle: {
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 8,
	},

	selectedText: {
		fontSize: 13,
		opacity: 0.6,
	},

	changeButton: {
		padding: 14,
		alignItems: "center",
		marginBottom: 20,
	},

	changeButtonText: {
		fontSize: 15,
		fontWeight: "600",
	},

	inputLabel: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 8,
	},

	input: {
		backgroundColor: "white",
		padding: 14,
		borderRadius: 12,
		fontSize: 16,
		marginBottom: 20,
	},

	notesInput: {
		minHeight: 100,
		textAlignVertical: "top",
	},

	saveButton: {
		backgroundColor: "#111",
		padding: 18,
		borderRadius: 14,
		alignItems: "center",
	},

	saveButtonText: {
		color: "white",
		fontSize: 17,
		fontWeight: "700",
	},

	cancelButton: {
		marginTop: 20,
		alignItems: "center",
	},

	cancelText: {
		fontSize: 16,
	},
});