class BodyBumps extends Phaser.Scene {
    constructor() {
        super('bodyBumpsScene');
    }

    create() {
        // velocity constant
        this.BALL_VELOCITY = 300;

        this.soccer = this.physics.add.sprite(widthSpacer*4, halfHeight, 'soccer');
        this.soccer.body.setCircle(this.soccer.width/2);
        this.soccer.body.onCollide = true;      // must be set for collision event to work
        this.soccer.body.onWorldBounds = true;  // ditto for worldbounds
        this.soccer.body.onOverlap = true;      // ditto for overlap
        this.soccer.setDebugBodyColor(0xFFFF00);
        this.soccer.setCollideWorldBounds(true);
        this.soccer.setDepth(10);               // keep soccer ball on top

        this.football = this.physics.add.sprite(widthSpacer*2, halfHeight, 'football');
        this.football.body.setSize(20, 40);
        this.football.setDebugBodyColor(0x00FF00);
        this.football.setAngularVelocity(10);

        this.tennis = this.physics.add.sprite(widthSpacer*3, halfHeight, 'tennis').setScale(0.5);
        this.tennis.body.setCircle(50);
        this.tennis.setDebugBodyColor(0xFACADE);
        this.tennis.body.setAngularVelocity(-20);
        this.tennis.body.setImmovable(true);
        this.tennis.body.onCollide = true;

        this.basketball = this.physics.add.sprite(widthSpacer, halfHeight, 'basketball').setScale(0.5);
        this.basketball.setDebugBodyColor(0xFFFF00);
        this.basketball.setCollideWorldBounds(true);
        this.basketball.setBounce(0.5);
        this.basketball.body.onCollide = true;
        this.basketball.body.onWorldBounds = true;
        this.basketball.body.onOverlap = true;

        // add net 🥅 with compound physics bodies
        this.topNet = this.add.image(centerX, 100, 'net').setOrigin(0.5, 0);
        // create the compound bodies
        this.topNetBack = this.physics.add.image(centerX, 108);         // back of net
        this.topNetBack.setSize(128, 16);
        this.topNetBack.setDebugBodyColor(0x0000FF);
        this.topNetBack.setImmovable(true);
        this.topNetBack.onCollide = true;
        this.topNetLPost = this.physics.add.image(centerX - 72, 116);   // top left post
        this.topNetLPost.setSize(16, 32);
        this.topNetLPost.setImmovable(true);
        this.topNetLPost.setBounce(1);
        this.topNetLPost.onCollide = true;
        this.topNetRPost = this.physics.add.image(centerX + 72, 116);   // top right post
        this.topNetRPost.setSize(16, 32);
        this.topNetRPost.setImmovable(true);
        this.topNetRPost.setBounce(1);
        this.topNetRPost.onCollide = true;
        // add the compound bodies to a group
        this.netGroup = this.add.group([this.topNetBack, this.topNetLPost, this.topNetRPost]);

        // info text
        this.message = this.add.text(centerX, 32, 'Awaiting physics world events...').setOrigin(0.5);
        this.add.text(centerX, game.config.height - 64, 'Use cursor keys to move soccer ball').setOrigin(0.5);
        this.add.text(centerX, game.config.height - 32, 'S for next Scene').setOrigin(0.5);

        // create physics world events
        // note: you MUST use a .collide/.overlap check in update() AND set body.onCollide/body.onOverlap/.onWorldBounds to true for these to work
        this.physics.world.on('collide', (obj1, obj2, body1, body2)=>{
            this.message.text = `${obj1.texture.key} is colliding with ${obj2.texture.key} body`;
        });

        this.physics.world.on('overlap', (obj1, obj2, body1, body2)=>{
            this.message.text = `${obj1.texture.key} body is overlapping ${obj2.texture.key} body`;
        });

        this.physics.world.on('worldbounds', (body)=>{
            this.message.text = `${body.gameObject.texture.key} touched world bounds`;
        });

        // define cursors and S key (for Scene switching)
        cursors = this.input.keyboard.createCursorKeys();
        swap = this.input.keyboard.addKey('S');
        swap.on('down', () => {
            this.scene.start("honeySpiderScene");
        });
    }

    update() {
        // check collisions
        this.physics.collide(this.soccer, this.basketball);
        this.physics.collide(this.soccer, this.tennis);
        this.physics.collide(this.basketball, this.tennis);
        this.physics.collide(this.soccer, this.netGroup);
        this.physics.collide(this.basketball, this.netGroup);
        // check overlaps
        this.physics.overlap(this.soccer, this.football);   // note that this won't trip the world overlap signal
        this.physics.overlap(this.basketball, this.football); 

        // player input
        this.direction = new Phaser.Math.Vector2(0);
        if(cursors.left.isDown) {
            this.direction.x = -1;
        } else if(cursors.right.isDown) {
            this.direction.x = 1;
        }  
        if(cursors.up.isDown) {
            this.direction.y = -1;
        } else if(cursors.down.isDown) {
            this.direction.y = 1;
        }
        this.direction.normalize();
        this.soccer.setVelocityX(this.direction.x * this.BALL_VELOCITY);
        this.soccer.setVelocityY(this.direction.y * this.BALL_VELOCITY);

    }
}