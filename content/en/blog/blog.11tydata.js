const getFolderName = (data) => {
	const path = data.page.filePathStem;
	const parts = path.split("/");
	const folderName = parts[parts.length - 2];
	return folderName;
};

export default {
	tags: ["posts"],
	layout: "layouts/post.njk",
	eleventyComputed: {
		// Compute the `date` property for each post
		date: (data) => {
			const folderName = getFolderName(data);
			const datePart = folderName.split("_")[0]; // 'YYYY-MM-DD'
			const [year, month, day] = datePart.split("-").map(Number);
			return new Date(year, month - 1, day);
		},
		// Compute the `permalink` property for each post
		permalink: (data) => {
			const folderName = getFolderName(data);
			// Remove the date part from the folder name
			const slug = folderName.split("_").slice(1).join("_");
			// Construct the permalink
			return `/blog/${slug}/`;
		},
	},
};
