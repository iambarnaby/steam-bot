const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const config = require('./config');


const client = new SteamUser();
const Community = new SteamCommunity();
const manager = new TradeOfferManager({
	steam: client,
	community: Community,
	language: 'en'
});
//login nd online
const logInOptions = {
	accountName: config.accountName,
	password: config.password,
	twoFactorCode: SteamTotp.generateAuthCode(config.sharedSecret)
};

client.logOn(logInOptions);

client.on('loggedOn', () => {
	console.log('logged on');

	client.setPersona(SteamUser.EPersonaState.Online, '1Up Leveling');
	client.gamesPlayed('Under Maintenance');
});

client.on('webSession', (sessionid, cookies) => {
	console.log(`${cookies}`)
	community.setCookies(cookies);
	manager.setCookies(cookies);
	community.startConfirmationChecker(10000, `${config.identSec}`);
});

//recieving trade manager also accepts donos
manager.on('newOffer', offer => {
  console.log('test')
  if (offer.itemsToGive.length === 0) {

    offer.accept((err, status) => {
      if (err) {
        console.log('something went wrong');
      } else {
        console.log(`Donation accepted. Status: ${status}.`);
      }
    });
  } else {
    offer.decline(err => {
      if (err) {
        console.log(err);
      } else {
        console.log('Donation declined (wanted our items).');
      }
    });
  }
});

//pending invitee (2)
client.on('friendRelationship', (steamid, relationship) => {
  if (relationship === 2) {
    client.addFriend(steamid);
    client.chatMessage(steamid, '');
    client.chatMessage(steamid, '');
    client.chatMessage(steamid, '');
  }
});

//new and improved replyBOT
client.on("friendMessage", function(steamID, message) {
  //command list
  const help ='!help';
  const buy = '!buy';
  const sell = '!sell';
  const owner = '!owner'
  const donate = '!donate';
  const support = '!support';
  
  const helpList ='COMMANDS: \n \n!help \n!buy x  :  replace x with number of sets \n!sell \n!donate \n!owner  :  for more help add my speak with my owner!';
  const msg = message.toLowerCase().trim();

  switch(msg){
    case help:
    client.chatMessage(steamID, helpList);
    break;
    case owner:
    client.chatMessage(steamID, `Need further help? You can contact the owner @ https://steamcommunity.com/id/LampShed/` );
    break;
    case support:
    client.chatMessage(steamID, 'I have let someone know you need help. You may be contacted by the owner or a moderator in the next hour.')
    console.log(steamID + ' needs help on BOT1');
    break;
    case buy:
    client.chatMessage(steamID, 'We are not yet ready for buy orders. Sorry!');
    break;
    case sell:
    client.chatMessage(steamID, 'We are not currently selling anything!');
    break;
    case donate:
    client.chatMessage(steamID, 'Send me a trade offer and I will accept the donation. Thanks for the contribution!');
    break;
    default:
    client.chatMessage(steamID, `"${msg}" is not recognised. Type !help for a list of commands`);
    break;
  };
});

//old replyBOT
/*
client.on("friendMessage", function(steamID, message) {
  if(message == "!buy 1") {
    client.chatMessage(steamID, "Sure! Please check your trade offers.");

  } else {
    client.chatMessage(steamID, "sorry, if you want a list of commands type '!commands'");
  }
});
*/


//listening


//sending random items to specific people

function sendRandomItem() {
  const partner = '76561198819840145';
  const appid = 440;
  const contextid = 2;

  const offer = manager.createOffer(partner);

  manager.loadInventory(appid, contextid, true, (err, myInv) => {
    if (err) {
      console.log(err);
    } else {
      const myItem = myInv[Math.floor(Math.random() * myInv.length - 1)];
      offer.addMyItem(myItem);

      manager.loadUserInventory(
        partner,
        appid,
        contextid,
        true,
        (err, theirInv) => {
          if (err) {
            console.log(err);
          } else {
            const theirItem =
              theirInv[Math.floor(Math.random() * theirInv.length - 1)];
            offer.addTheirItem(theirItem);

            offer.setMessage(
              `Will you trade your ${theirItem.name} for my ${myItem.name}?`
            );
            offer.send((err, status) => {
              if (err) {
                console.log(err);
              } else {
                console.log(`Sent offer. Status: ${status}.`);
              }
            });
          }
        }
      );
    }
  });
}

client.on('webSession', (sessionid, cookies) => {

	sendRandomItem();

});

