import { Directory, File, Paths } from "expo-file-system";


function getVideoDirectory(): Directory {
	return new Directory(Paths.document, "videos");
}

export function initializeVideoStorage(): void {
	const directory = getVideoDirectory();

	directory.create({
		idempotent:    true,
		intermediates: true,
	});
}

export function saveVideoLocally(sourceUri: string): string {
	const directory = getVideoDirectory();

	directory.create({
		idempotent:    true,
		intermediates: true,
	});

	const sourceFile = new File(sourceUri);

	const extension =
		sourceFile.extension || ".mp4";

	const filename =
		`video_${Date.now()}_${Math.random()
			.toString(36)
			.slice(2, 8)}${extension}`;

	const destinationFile = new File(directory, filename);

	sourceFile.copy(destinationFile);

	return destinationFile.uri;
}

export function deleteVideoLocally(fileUri: string): void {
	const file = new File(fileUri);

	if (file.exists) {
		file.delete();
	}
}
