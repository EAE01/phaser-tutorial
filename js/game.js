class Game{
  constructor(){
    console.log('Initialising game')
    this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this) });
  }

  preload(){
    const game = this.game
    game.load.image('background', 'assets/img/background.jpg')
    game.load.image('star', 'assets/img/collectible.png')
    game.load.image('ground', 'assets/img/ground.png')
    game.load.spritesheet('character', 'assets/img/character-sprite.png', 32, 48)
    console.log('Assets loaded')
  }

  create(){
    const game = this.game
    this.score = 0

    game.add.sprite(-100, 0, 'background').scale.setTo(0.6, 0.6)

    game.physics.startSystem(Phaser.Physics.ARCADE)
    this.platforms = game.add.group()
    this.platforms.enableBody = true

    this.ground = this.platforms.create(0, game.world.height - 90, 'ground')
    this.ground.scale.setTo(0.1, 0.1)
    this.ground.body.immovable = true

    this.addLedge(400, 400)

    this.addLedge(-150, 250)

    this.player = game.add.sprite(32, game.world.height - 150, 'character')
    const player = this.player

    game.physics.arcade.enable(player)
    player.body.bounce.y = 0.2
    player.body.gravity.y = 300
    player.body.collideWorldBounds = true

    player.animations.add('left', [0,1,2,3], 10, true)
    player.animations.add('right', [5,6,7,8], 10, true)
    player.idle = ()=>{
      player.animations.stop()
      player.frame = 4
    }

    this.stars = game.add.group()
    this.stars.enableBody = true

    for(var x = 0; x < 12; x++){
      let star = this.addStar(x*70 + Math.random() * 10, 0)
      star.body.gravity.y = 300
      star.body.bounce.y = Math.random() * 0.5
    }

    this.arrows = game.input.keyboard.createCursorKeys()

    this.scoreText = game.add.text(16, 16, `Score: ${this.score}`, {fontSize: '32px', fill: '#000'})
  }

  update(){
    const game = this.game
    const player = this.player
    let hitPlatform = game.physics.arcade.collide(player, this.platforms)

    player.body.velocity.x = player.body.velocity.x / 2

    if(this.arrows.left.isDown){
      player.body.velocity.x = -150
    }
    else if(this.arrows.right.isDown){
      player.body.velocity.x = 150
    }

    if(player.body.velocity.x > 10){
      player.animations.play('right')
    }else if(player.body.velocity.x < -10){
      player.animations.play('left')
    }else{
      player.idle()
    }

    if(this.arrows.up.isDown && player.body.touching.down && hitPlatform){
      player.body.velocity.y = -300
    }

    game.physics.arcade.collide(this.stars, this.platforms)
    game.physics.arcade.overlap(this.stars, player, this.collectStar, null, this)

    this.scoreText.text = `Score: ${this.score}`
  }

  addLedge(x, y, scale = [0.05, 0.05]){
    let ledge = this.platforms.create(x, y, 'ground')
    ledge.scale.setTo(scale[0], scale[1])
    ledge.body.immovable = true
    return ledge
  }

  addStar(x, y, scale = [1, 1]){
    let star = this.stars.create(x, y, 'star')
    star.scale.setTo(scale[0], scale[1])
    return star
  }

  collectStar(player, star){
    star.kill()
    this.score += 10
  }
}