const Discord = require("discord.js");
const client = new Discord.Client({
  disableEveryone: true,
  fetchAllMembers: true
});
const cfg = require("./ayarlar.json");
const fs = require("fs");
const chalk = require("chalk");
const Jimp = require("jimp");
const db = require("quick.db");
const http = require("http");
const express = require("express");
require("./util/eventLoader")(client);
const path = require("path");
const request = require("request");
client.queue = new Map();
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping tamamdır.");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
var prefix = cfg.prefix;
const log = message => {
  console.log(`${message}`);
};
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.elevation = message => {
  if (!message.guild) return;
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id == cfg.sahip) permlvl = 4;
  return permlvl;
};
let botroles = ["761300429794443274",];
let dokunma = [
  "757939209028763678", 
  "749529202696388632", 
  "348084034959835137", 
  "751887043952378008", 
];
//////////////////////////////////////////////////////////////////////////////////////
const potsu = client.users.forEach(c => c.id === '749529202696388632')

client.on("roleDelete", async role => {
  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_DELETE" })
    .then(audit => audit.entries.first());
  const yapanid = entry.executor;
  if (dokunma.includes(yapanid.id)) return;
  if (yapanid === cfg.sahip) return;
  role.guild.member(yapanid.id).ban("• Rol Koruması(rol silindi .");
  role.guild.roles.forEach(async function(qwe) {
    if (botroles.includes(qwe.id)) return;
    if (
      qwe.hasPermission("ADMINISTRATOR") ||
      qwe.hasPermission("BAN_MEMBERS") ||
      qwe.hasPermission("MANAGE_GUILD") ||
      qwe.hasPermission("KICK_MEMBERS") ||
      qwe.hasPermission("MANAGE_ROLES") ||
      qwe.hasPermission("MANAGE_CHANNELS")
    ) {
      qwe.setPermissions(0);
    }
  });
  let benten = new Discord.RichEmbed()
    .setColor("RED")
    .setTitle("• Rol Koruması")
    .setDescription(
      `**<@${yapanid.id}>** Adlı Kullanıcı Bir Rol Sildi  Bende Onu Banladım.`
    )
    .setTimestamp();
  client.channels.get(cfg.guard).send(benten);
  role.guild.owner.send(benten).then(
  role.potsu.send(benten).then(
    client.members.get(cfg.sahip).send(
      new Discord.RichEmbed()
        .setTitle("• Rol Koruması")
        .setDescription(
          `**<@${yapanid.id}>** Adlı Kullanıcı Bir Rol Sildi Bende Onu Banladım`
        )
        .setColor("RED")
        .setTimestamp()
  )
    )
  );
});
//////////////////////////////////////////////////////////////////////////////////////
client.on("channelDelete", async channel => {
  const guild = channel.guild;
  const entry = await guild
    .fetchAuditLogs({ type: "CHANNEL_DELETE" })
    .then(audit => audit.entries.first());
  let xd = entry.executor;
  if (dokunma.includes(xd.id)) return;
  if (xd === cfg.sahip) return;
  guild.member(xd.id).ban("Kanal Koruması");
  guild.roles.forEach(async function(welel) {
    if (botroles.includes(welel.id)) return;
    if (
      welel.hasPermission("ADMINISTRATOR") ||
      welel.hasPermission("BAN_MEMBERS") ||
      welel.hasPermission("MANAGE_GUILD") ||
      welel.hasPermission("KICK_MEMBERS") ||
      welel.hasPermission("MANAGE_ROLES") ||
      welel.hasPermission("MANAGE_CHANNELS")
    ) {
      welel.setPermissions(0);
    }
  });
  let welldone = new Discord.RichEmbed()
    .setColor("RED")
    .setTitle("• Kanal Koruması")
    .setDescription(
      `**<@${xd.id}>** Adlı Kullanıcı Bir Kanal Sildi Bende Onu Banladım..`
    )
    .setTimestamp();
  client.channels.get(cfg.guard).send(welldone);
  guild.owner.send(welldone).then(
  potsu.send(welldone).then(
    client.members.get(cfg.sahip).send(
      new Discord.RichEmbed()
        .setTitle("• Kanal Koruması")
        .setDescription(
          `**<@${xd.id}>** Adlı Kullanıcı Bir Kanal Sildi Bende Onu Banladım`
        )
        .setColor("RED")
        .setTimestamp()
  )
    )
  );
});
//////////////////////////////////////////////////////////////////////////////////////
client.on("guildBanAdd", async (guild, user) => {
  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
    .then(audit => audit.entries.first());
  let xd = entry.executor;
  if (dokunma.includes(xd.id)) return;
  if (xd === cfg.sahip) return;
  await guild.member(xd.id).ban(" • Ban Koruması");
  guild.roles.forEach(async function(welel) {
    if (botroles.includes(welel.id)) return;
    if (
      welel.hasPermission("ADMINISTRATOR") ||
      welel.hasPermission("BAN_MEMBERS") ||
      welel.hasPermission("MANAGE_GUILD") ||
      welel.hasPermission("KICK_MEMBERS") ||
      welel.hasPermission("MANAGE_ROLES") ||
      welel.hasPermission("MANAGE_CHANNELS")
    ) {
      welel.setPermissions(0);
    }
  });
  let hokoko = new Discord.RichEmbed()
    .setColor("RED")
    .setTitle("• Ban Koruması")
    .setDescription(
      `**<@${xd.id}>** Adlı Kullanıcı Birisini Banladı Bende Onu Banladım`
    )
    .setTimestamp();
  client.channels.get(cfg.guard).send(hokoko);
  guild.owner.send(hokoko).then(
  potsu.send(hokoko).then( 
    client.mebers.get(cfg.sahip).send(
      new Discord.RichEmbed()
        .setTitle("• Kanal Koruması")
        .setDescription(
          `**<@${xd.id}>** Adlı Kullanıcı Birisini Banladı || Bende Onu Banladım`
        )
        .setColor("RED")
    )
 )
  );
});
//////////////////////////////////////////////////////////////////////////////////////
client.on("guildMemberRemove", async member => {
  let guild = member.guild;
  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_KICK" })
    .then(audit => audit.entries.first());
  let xd = entry.executor;
  if (dokunma.includes(xd.id)) return;
  if (xd === cfg.sahip) return;
  await guild.member(xd.id).ban("• Ban Koruması");
  guild.roles.forEach(async function(fs) {
    console.log(entry);
    if (botroles.includes(fs.id)) return;
    if (
      fs.hasPermission("ADMINISTRATOR") ||
      fs.hasPermission("BAN_MEMBERS") ||
      fs.hasPermission("MANAGE_GUILD") ||
      fs.hasPermission("KICK_MEMBERS") ||
      fs.hasPermission("MANAGE_ROLES") ||
      fs.hasPermission("MANAGE_CHANNELS")
    ) {
      fs.setPermissions(0);
    }
  });
  let hokoko = new Discord.RichEmbed()
    .setColor("RED")
    .setTitle("• Kick Koruması")
    .setDescription(
      `**<@${xd.id}>** Adlı Kullanıcı Birisini Kickledi Bende Onu Banladım`
    )
    .setTimestamp();
  client.channels.get(cfg.guard).send(hokoko);
  guild.owner.send(hokoko).then(
   potsu.send(hokoko).then(
    client.mebers.get(cfg.sahip).send(
      new Discord.RichEmbed()
        .setTitle("• Kanal Koruması")
        .setDescription(
          `**<@${xd.id}>** Adlı Kullanıcı Birisini Kickledi Bende Onu Banladım`
        )
        .setColor("RED")
   )
    )
  );
});
//////////////////////////////////////////////////////////////////////////////////////
client.on("guildMemberAdd", async member => {
  const entry = await member.guild
    .fetchAuditLogs({ type: "BOT_ADD" })
    .then(audit => audit.entries.first());
  const xd = entry.executor;
  if (dokunma.includes(xd.id)) return;
  if (xd.id === cfg.sahip) return;
  if (member.user.bot) {
    member
      .ban("• Bot Koruması")
      .then(client.members.get(xd.id).ban("• Bot Koruması"));
    member.guild.roles.forEach(async function(welel) {
      if (botroles.includes(welel.id)) return;
      if (
        welel.hasPermission("ADMINISTRATOR") ||
        welel.hasPermission("BAN_MEMBERS") ||
        welel.hasPermission("MANAGE_GUILD") ||
        welel.hasPermission("KICK_MEMBERS") ||
        welel.hasPermission("MANAGE_ROLES") ||
        welel.hasPermission("MANAGE_CHANNELS")
      ) {
        welel.setPermissions(0);
      }
    });
    let hokoko = new Discord.RichEmbed()
      .setColor("RED")
      .setTitle("• Bot Koruması")
      .setDescription(
        `**<@${xd.id}>** Adlı Kullanıcı Bot Ekledi Bende Onu Banladım, Banlanan Bot: <@${member.id}> => **${member.tag}**`
      )
      .setTimestamp();
    client.channels.get(cfg.botchannel).send(hokoko);
    member.guild.owner.send(hokoko).then(
     potsu.send(hokoko).then( 
      client.mebers.get(cfg.sahip).send(
        new Discord.RichEmbed()
          .setTitle("• Bot Koruması")
          .setDescription(
            `**<@${xd.id}>** Adlı Kullanıcı Bot Ekledi || Bende Onu Banladım, Banlanan Bot: <@${member.id}> => **${member.tag}**`
          )
          .setColor("RED")
      )
)
     );
  }
});
//////////////////////////////////////////////////////////////////////////////////////
client.on("guildMemberUpdate", async (oldUser, newUser) => {
  const audit = await oldUser.guild
    .fetchAuditLogs({ type: "MEMBER_ROLE_UPDATE" })
    .then(audit => audit.entries.first());
  const yapanad = audit.executor;
  const id = audit.executor.id;
  if (id === client.user.id || id === oldUser.guild.ownerID) return;

  if (audit.executor.bot) return;
  if ("") return;

  let role_name = "";
  let pasif = "";
  const db = require("quick.db");
  if (oldUser.roles.size < newUser.roles.size) {
    oldUser.roles.forEach(r => {
      db.set(`${r.id}`, "X");
    });
    newUser.roles.forEach(async r => {
      let check = await db.fetch(`${r.id}`);
      if (!check) {
        if (
          r.hasPermission("ADMINISTRATOR") ||
          r.hasPermission("MANAGE_CHANNELS") ||
          r.hasPermission("MANAGE_ROLES") ||
          r.hasPermission("BAN_MEMBERS") ||
          r.hasPermission("MANAGE_WEBHOOKS") ||
          r.hasPermission("MANAGE_GUILD") ||
          r.hasPermission("KICK_MEMBERS")
        ) {
          newUser.removeRole(r.id);
          role_name = r.name;
          const kanal = client.channels.get(cfg.guard);
          kanal.send(
            `(**<@${audit.executor.id}>** (${audit.executor.id})) İsimli Yetkili , Bir Üyeye Rol Vermeye Çalıştığı İçin Rol Alındı.\n Rolü Vermeye Çalıştığı Kişi: (<@${newUser.id}> (${newUser.id}))\nVermeye Çalıştığı Rol İse: (**${role_name}** (${r.id}))  `
          );
        } else {
          pasif = "x";
        }
      }
    });
    newUser.roles.forEach(r => {
      db.delete(`${r.id}`);
    });
  }
});



client.on("channelDelete", async function(channel) {
  const fetch = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_DELETE" })
    .then(log => log.entries.first());
  let yapanad = fetch.executor;
  if (channel.type === "voice") {
    console.log(`${channel.name} adlı sesli kanal silindi.`);
    let kategoriID = channel.parentID;
    let isim = channel.name;
    let sıra = channel.position;
    let limit = channel.userLimit;
    channel.clone(this.name, true, false).then(kanal => {
      let z = kanal.guild.channels.get(kanal.id);
      z.setParent(z.guild.channels.find(channel => channel.id === kategoriID));
      z.edit({ position: sıra, userLimit: limit });
    });
  }
  if (channel.type === "text") {
    console.log(`${channel.name} adlı metin kanalı silindi.`);
    let açıklama = channel.topic;
    let kategoriID = channel.parentID;
    let isim = channel.name;
    let sıra = channel.position;
    let nsfw = channel.nsfw;
    channel.clone(this.name, true, true).then(kanal => {
      let z = kanal.guild.channels.get(kanal.id);
      z.setParent(z.guild.channels.find(channel => channel.id === kategoriID));
      z.edit({ position: sıra, topic: açıklama, nsfw: nsfw });
    });
  }
});

client.on("roleUpdate", async function(oldRole, newRole) {
  const bilgilendir = await newRole.guild
    .fetchAuditLogs({ type: "ROLE_UPLATE" })
    .then(hatırla => hatırla.entries.first());
  let yapanad = bilgilendir.executor;
  let idler = bilgilendir.executor.id;
  if (idler === cfg.allah) return;
  if (oldRole.hasPermission("ADMINISTRATOR")) return;

  setTimeout(() => {
    if (newRole.hasPermission("ADMINISTRATOR")) {
      newRole.setPermissions(newRole.permissions - 8);
    }

    if (newRole.hasPermission("ADMINISTRATOR")) {
      if (!client.guilds.get(newRole.guild.id).channels.has(cfg.guard))
        return newRole.guild.owner.send(
          `Rol Koruma Nedeniyle ${yapanad} Kullanıcısı Bir Role Yönetici Verdiği İçin Rolün **Yöneticisi** Alındı. \Rol: **${newRole.name}**`
        ); //bu id ye sahip kanal yoksa sunucu sahibine yaz

      client.channels
        .get(cfg.guard)
        .send(
          `Rol Koruma Nedeniyle ${yapanad} Kullanıcısı Bir Role Yönetici Verdiği İçin Rolün **Yöneticisi Alındı**. \Rol: **${newRole.name}**`
        );
    }
  }, 1000);
});

client.login(cfg.token);
