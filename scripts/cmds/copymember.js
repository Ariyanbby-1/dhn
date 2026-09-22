module.exports = {
 config: {
 name: "copymember",
 version: "3.0.0",
 author: "EryXenX",
 countDown: 10,
 role: 2,
 shortDescription: "Copy all members with real check",
 longDescription: "Copy all members 1 by 1 and check real result",
 category: "admin",
 guide: "{prefix}copymember <new_group_id>"
 },

 onStart: async function ({ api, event, args, message }) {
 const { threadID } = event;
 const newThreadID = args[0];
 if (!newThreadID) return message.reply("❌ Please provide the new group ID.\nExample: copymember 123456789");

 try {
 message.reply("⏳ Copying members 1 by 1... This will be slow.");
 const threadInfo = await api.getThreadInfo(threadID);
 const memberIDs = threadInfo.participantIDs;
 const botID = api.getCurrentUserID();
 const newThreadInfo = await api.getThreadInfo(newThreadID);
 const beforeIDs = newThreadInfo.participantIDs;

 const toAdd = memberIDs.filter(id => id!= botID &&!beforeIDs.includes(id));
 if (toAdd.length == 0) return message.reply("✅ No new members to add.");

 let reallyAdded = 0;

 for (let i = 0; i < toAdd.length; i++) {
 const id = toAdd[i];
 try {
 await api.addUserToGroup(id, newThreadID);
 await new Promise(r => setTimeout(r, 5000)); // 5s delay
 } catch (e) {
 await new Promise(r => setTimeout(r, 30000)); // 30s delay if error
 }

 if((i+1) % 10 == 0) message.reply(`⏳ Progress: ${i+1}/${toAdd.length}`);
 }

 message.reply("⏳ Waiting 20s to check final result...");
 await new Promise(r => setTimeout(r, 20000));

 const newThreadInfoAfter = await api.getThreadInfo(newThreadID);
 const afterIDs = newThreadInfoAfter.participantIDs;
 reallyAdded = afterIDs.filter(id =>!beforeIDs.includes(id)).length;
 const failed = toAdd.length - reallyAdded;

 return message.reply(`✅ Done!\n➕ Really Added: ${reallyAdded}\n❌ Failed: ${failed}\n\nNote: Others got invite only`);

 } catch (err) {
 return message.reply(`❌ Error: ${err.message}`);
 }
 }
};
