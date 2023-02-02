import { Command } from "../../types/command";

module.exports = {
	description: "Plays a random song from a list",
	aliases: ["pt"],

	async run(client, message, _args, guildData, userData, isSlashCommand) {
		const pickedSong = songList[Math.floor(Math.random() * songList.length)];
		return require("../music/play").run(client, message, [pickedSong], guildData, userData, isSlashCommand);
	}
} as Command;

const songList = [
	"https://www.youtube.com/watch?v=52Gg9CqhbP8&list=RDMM&index=1",
	"https://www.youtube.com/watch?v=NkRkuI0ZgX0&list=RDMM&index=2",
	"https://www.youtube.com/watch?v=PcR8I-7oCnU&list=RDMM&index=3",
	"https://www.youtube.com/watch?v=myiJB8SiIcU&list=RDMM&index=4",
	"https://www.youtube.com/watch?v=H87GqJujcOk&list=RDMM&index=5",
	"https://www.youtube.com/watch?v=EHyoAXILbA8&list=RDMM&index=6",
	"https://www.youtube.com/watch?v=XRP9k9nlAfE&list=RDMM&index=7",
	"https://www.youtube.com/watch?v=bXE6B6Usj6o&list=RDMM&index=8",
	"https://www.youtube.com/watch?v=ZPqZyIKtW0Y&list=RDMM&index=9",
	"https://www.youtube.com/watch?v=StYkb5kbM3o&list=RDMM&index=10",
	"https://www.youtube.com/watch?v=7pA8hZqXWHY&list=RDMM&index=11",
	"https://www.youtube.com/watch?v=3nlSDxvt6JU&list=RDMM&index=12",
	"https://www.youtube.com/watch?v=jpw2ebhTSKs&list=RDMM&index=13",
	"https://www.youtube.com/watch?v=IDmjQigyZiE&list=RDMM&index=14",
	"https://www.youtube.com/watch?v=1RaKSRU60bw&list=RDMM&index=15",
	"https://www.youtube.com/watch?v=74ekU02fxAQ&list=RDMM&index=16",
	"https://www.youtube.com/watch?v=-kWFRyQ5VU8&list=RDMM&index=17",
	"https://www.youtube.com/watch?v=On_ZA4RNfyU&list=RDMM&index=18",
	"https://www.youtube.com/watch?v=DBXTRtm07RA&list=RDMM&index=19",
	"https://www.youtube.com/watch?v=MaeRXppkzdA&list=RDMM&index=20",
	"https://www.youtube.com/watch?v=PDJLvF1dUek&list=RDMM&index=21",
	"https://www.youtube.com/watch?v=US3VTVDRbjE&list=RDMM&index=22",
	"https://www.youtube.com/watch?v=VJr6jP4e14M&list=RDMM&index=23",
	"https://www.youtube.com/watch?v=_Fxil2QY0wE&list=RDMM&index=24",
	"https://www.youtube.com/watch?v=fripFSuqztY&list=RDMM&index=25",
	"https://www.youtube.com/watch?v=9BoaOsvZmpw&list=RDMM&index=26",
	"https://www.youtube.com/watch?v=BTthtlT80Rc&list=RDMM&index=27",
	"https://www.youtube.com/watch?v=fBGSJ3sbivI&list=RDMM&index=28",
	"https://www.youtube.com/watch?v=EKLWC93nvAU&list=RDMM&index=29",
	"https://www.youtube.com/watch?v=9RHFFeQ2tu4&list=RDMM&index=30",
	"https://www.youtube.com/watch?v=VRwD9JL2sO0&list=RDMM&index=31",
	"https://www.youtube.com/watch?v=8UVNT4wvIGY&list=RDMM&index=32",
	"https://www.youtube.com/watch?v=lXnw5hrc1bs&list=RDMM&index=33",
	"https://www.youtube.com/watch?v=FtutLA63Cp8&list=RDMM&index=34",
	"https://www.youtube.com/watch?v=bOsKlHMfqbE&list=RDMM&index=35",
	"https://www.youtube.com/watch?v=zhIScvlFn2w&list=RDMM&index=36",
	"https://www.youtube.com/watch?v=LX5ntwkUa48&list=RDMM&index=37",
	"https://www.youtube.com/watch?v=UbQgXeY_zi4&list=RDMM&index=38",
	"https://www.youtube.com/watch?v=XEDb8hrHiKw&list=RDMM&index=39",
	"https://www.youtube.com/watch?v=gaFh71YwZ4Y&list=RDMM&index=40",
	"https://www.youtube.com/watch?v=scGd4fmGrTE&list=RDMM&index=41",
	"https://www.youtube.com/watch?v=FPjJW5iTFN0&list=RDMM&index=42",
	"https://www.youtube.com/watch?v=JpxLaTsylBU&list=RDMM&index=43",
	"https://www.youtube.com/watch?v=AlYdp8P1s6c&list=RDMM&index=44",
	"https://www.youtube.com/watch?v=9B1M3IPVcXs&list=RDMM&index=45",
	"https://www.youtube.com/watch?v=H4PZ7mju5QQ&list=RDMM&index=46",
	"https://www.youtube.com/watch?v=9Zj0JOHJR-s&list=RDMM&index=47",
	"https://www.youtube.com/watch?v=PZbkF-15ObM&list=RDMM&index=48",
	"https://www.youtube.com/watch?v=7T2sjD4bJU8&list=RDMM&index=49",
	"https://www.youtube.com/watch?v=yebo5ILBMC0&list=RDMM&index=50",
	"https://www.youtube.com/watch?v=-N4jf6rtyuw&list=RDMM&index=51"
]
