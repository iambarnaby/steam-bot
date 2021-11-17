//websession Trading put below "console.on('logged on')"
client.on('webSession', (sid, cookies) => {
	manager.setCookies(cookies);
	community.setCookies(cookies);
	community.startConfirmationChecker(20000, config.identitySecret)
});
manager.on('newOffer', offer => {
	console.log('offer detected');
	if (offer.partner.getSteamID64() ==='76561198819840145') {
		offer.accept((err, status) => {
			if (err) {
				console.log(err);
			} else {
				console.log(status);
			}
		})
	} else {
		console.log('unknown sender');
		offer.decline(err => {
			if (err) {
				console.log(err);
			} else {
			console.log('trade from stranger declined');
		    }
	    })
    }
})


//pending invite temp code
client.on('friendRelationship', (steamid, relationship) => {
  if (relationship === 2) {
    client.addFriend(steamid);
    client.chatMessage(steamid, 'Hello there! Thanks for adding me!');
  }
});