/**
* TV show, Book, or Film of the Day Plugin
* This is a daily activity where users get to post nominations, and the winner is randomly selected.
* 
* This is a modified form of The Studio's Artist of the Day room script for TVBF.
* Only works in a room with the id "tvbooksandfilms"
*/

exports.commands = {
	startnoms: function () {
		return this.parse('/togglenoms on');
	},

	endnoms: function () {
		return this.parse('/togglenoms off');
	},

	tnoms: 'togglenoms',
	togglenoms: function (target, room, user) {
		if (room.id !== 'tvbooksandfilms') return this.sendReply("This command can only be used in TV, Books, and Films.");
		if (!this.canTalk()) return;
		if (!this.can('mute', null, room)) return;
		if (!target) {
			return this.sendReply("/togglenoms [on / off] - If on, this will start nominations, if off, this will no longer allow people to use /nom.");
		}
		if (target === 'on') {
			if (room.nomsOn) return this.sendReply("The Artist of the Day has already started.");
			room.addRaw(
				'<div class="broadcast-blue"><center>' +
					'<h3>Nominations for the day have started!</h3>' +
					"<p>(Started by " + Tools.escapeHTML(user.name) + ")</p>" +
					"<p>Use <strong>/noms</strong> [show/book/film] to nominate!</p>" +
				'</center></div>'
			);
			room.nomsOn = true;
			this.logModCommand("Nominations for the Day were started by " + Tools.escapeHTML(user.name) + ".");
		}
		if (target === 'off') {
			if (!room.nomsOn) return this.sendReply("The nominations for the day have already ended.");
			room.addRaw("<b>Nominations are over!</b> (Turned off by " + Tools.escapeHTML(user.name) + ")");
			room.nomsOn = false;
		}
	},

	nomfaq: 'nomhelp',
	nomhelp: function (target, room) {
		if (!this.canBroadcast()) return;
		if (room.id !== 'tvbooksandfilms') return this.sendReply("This command can only be used in TV, Books, and Films.");
		this.sendReplyBox(
			"<h3>TV, Book, or Film of the Day:</h3>" +
			"<p>This is a room activity where users nominate things for the title of '[media] of the Day'.</p>" +
			'<p>' +
				"Command List:" +
				'<ul>' +
					"<li>/nom (nomination) - This will nominate your choice of the day; only do this once, please.</li>" +
					"<li>/winner - This allows you to see who the current Artist of the Day is.</li>" +
					"<li>/winner (artist) - Sets the winner of the day. (requires %, @, #)</li>" +
					"<li>/startnoms - Will start AOTD (requires %, @, #)</li>" +
					"<li>/endnoms - Will turn off the use of /noms, ending nominations. (requires %, @, #)</li>" +
				'</ul>' +
			'</p>'
		);
	},

	nominateforoftheday: 'nom',
	nom: function (target, room, user) {
		if (room.id !== 'tvbooksandfilms') return this.sendReply("This command can only be used in TV, Books, and Films.");
		if (!room.nomsOn) return this.sendReply("The winner of the Day has already been chosen.");
		if (!target) return this.sendReply("/nom [nomination] - Submits nomination for the Day.");
		if (target.length > 25) return this.sendReply("This nomination\'s name is too long; it cannot exceed 25 characters.");
		if (!this.canTalk()) return;
		room.addRaw(Tools.escapeHTML(user.name) + "'s nomination is: <strong><em>" + Tools.escapeHTML(target) + "</em></strong>");
	},

	winneroftheday: 'winner',
	winner: function (target, room, user) {
		if (room.id !== 'tvbooksandfilms') return this.sendReply("This command can only be used in TV, Books, and Films.");
		if (!target) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox("The current winner of the Day is: <b>" + Tools.escapeHTML(room.winner) + "</b>");
			return;
		}
		if (!this.canTalk()) return;
		if (target.length > 25) return this.sendReply("This nominations\'s name is too long; it cannot exceed 25 characters.");
		if (!this.can('mute', null, room)) return;
		room.winner = target;
		room.addRaw(
			'<div class="broadcast-green">' +
				"<h3>The winner of the Day is now <font color=\"black\">" + Tools.escapeHTML(target) + "</font></h3>" +
				"<p>(Set by " + Tools.escapeHTML(user.name) + ".)</p>" +
				"<p>This winner will be posted on our <a href=\"http://tvbooksandfilms.weebly.com/tvbfotd-wins\">winner of the Day page</a>.</p>" +
			'</div>'
		);
		room.nomsOn = false;
		this.logModCommand("The winner of the Day was changed to " + Tools.escapeHTML(target) + " by " + Tools.escapeHTML(user.name) + ".");
	}
};
