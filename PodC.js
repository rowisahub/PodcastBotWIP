const Discord = require('discord.js');
const { Readable, PassThrough } = require('stream');
const Stream = require('stream');
const mergeStream = require('merge-stream');
// var VideoStreamMerger = require('video-stream-merger');
const fs = require('fs');

const client = new Discord.Client();

client.once('ready', async() => {
	console.log(`Logged in as ${client.user.tag}`);
	
});

const prefix = '.'

// client.on('voiceStateUpdate', async(oldState, newState) =>{
	
	
	
// })

const SILENCE_FRAME = Buffer.from([0xF8, 0xFF, 0xFE]);
class Silence extends Readable {
  _read() {
    this.push(SILENCE_FRAME);
    this.destroy();
  }
}

var SEND;
var RESV;

client.on('message', async(message,member) => {
	// console.log(SEND.receiver.packets)
	
	let args = message.content.slice(prefix.length).trim().split(' ');
	let cmd = args.shift().toLowerCase();
	if (message.author.bot) return;
	
	if(cmd==='on'){
		
		const member = message.member;
		if (!member) {
			return;
		}
		if (!member.voice.channel) {
			await message.reply(`you're not in a voice channel`);
			return;
		}
		
		
		
		const SNchannel = await client.channels.cache.get("805868781033095218");
		if (!SNchannel) return console.error("The channel does not exist!");
		await SNchannel.join().then(connection => {
			console.log("Successfully connected to VC!");
			SEND = connection;
		}).catch(e => {
			console.error(e);
		});
		
		RESV = await message.member.voice.channel.join();
		RESV.play(new Silence(), { type: 'opus' });
		RESV.voice.setSelfDeaf(false);
		
		// const mergedStreams = concatStreams([stream1, stream2, stream3]);
		// Temp
		// var stream2 = new Stream();
		// // Temp
		// var stream1 = new Stream();
		
		// var merged = mergeStream(stream1, stream2);
		// var streams = [stream1];
		
		// let joined = streams.reduce((pt, s, i, a) => {
		  // s.pipe(pt, {end: false})
		  // s.once('end', () => a.every(s => s.ended) && pt.emit('end'))
		  // return pt
		// }, new PassThrough())
		
		// merger.addStream(screenStream)
		
		RESV.on('speaking', async (user, speaking) => {
			console.log(`User ${user.username} is speaking!`)
			// if(user.bot) return
			
			var curS = RESV.receiver.createStream(user, { mode: 'opus' });
			// merger.addStream(curS);
			// audioStream = RESV.receiver.createStream(user, { mode: 'opus' });
			const reS = SEND.play(curS, { type: 'opus' })
			
			reS.on('error', console.error);
		})
		
		// const reS = SEND.play(merger.result, { type: 'opus' });
		// reS.on('error', console.error);
		
		// const audio = connection.receiver.createStream(message.member.id, { mode: 'opus' });
		
		// audio.pipe(fs.createWriteStream('user_audio'));
	}else if(cmd==='off'){
		const member = message.member;
		if (!member) {
			return;
		}
		if (!member.voice.channel) {
			await message.reply(`you're not in a voice channel`);
			return;
		}
		if(!RESV) return message.channel.send('No resive found');
		if(!SEND) return message.channel.send('No send found');
		
		RESV.disconnect();
		SEND.disconnect();
		
		console.log("Successfully disconnected from VC!");
		
	}
	
	// val.voice_Channel.leave()
	
})

client.login("ODA0OTgyNTc0NjIyNTcyNTQ1.YBUQcQ.9iXZFFvByrypJVPxieB5Q8yi9qc");