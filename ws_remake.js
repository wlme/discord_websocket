$(function(){
    ws.init();
})

var ws = {

    bot_token: 'NzYwODc5MTI5MzQzNjg4NzA1.X3Sd6A.44JgJd1DTPR6g9NvvhPuPLBm5_s',
    gateway_url:  'wss://gateway.discord.gg/?v=6&encoding=json',
    send_ready: false,
    contact_owner: false,

    init: function() {
        ws.connect();
    },

    connect: function() {
        cnt = new WebSocket(ws.gateway_url);
        cnt.onmessage = ws.messageHandler;
        cnt.onclose = ws.connect;
    },

    login: function() {
        data = {
            "op": 2,
            "d": {
                "token": ws.bot_token,
                "properties": { "$os": "browser", "$browser": "chrome", "$device": "cloud9" },
                "compress": false
            }
        };

        cnt.send(JSON.stringify(data));
    },

    messageHandler: function(msg){
        json = JSON.parse(msg.data);

        if(json.op == 10) {
            ws.login();
        } else if(json.op == 0) {
            switch(json.t) {
                case 'READY':
                    if(!ws.send_ready) {
                        $('#chatbox').append("<tr> <td colspan='3'> Bot Iniciado! </td> </tr>");
                        ws.send_ready = true;
                    }
                break; // ==========================
                case 'MESSAGE_CREATE':
                    u = json.d.author;
                    m = json.d.content;
                    t = json.d.timestamp;
    
                    ws.showMessage( u.avatar, u.id, u.username, m, t );
                break; // ==========================
            }
        }
    },

    showMessage: function(avatar, user_id, user_name, msg, timestamp){
        timestamp = ws.formatTimestamp(timestamp);
        avatar = "<img src='https://cdn.discordapp.com/avatars/" + user_id + "/" + avatar + ".png' class='avatar'>";

        $('#chatbox').append("<tr class='small'> <td>"+avatar+" "+user_name+"</td> <td>"+msg+"</td> <td>"+timestamp+"</td> </tr> ");
    },

    formatTimestamp: function(string) {
        str = string.split('T');
        return str[0]+' '+(str[1].split('.'))[0]+' +'+(str[1].split('+'))[1];
    }

}