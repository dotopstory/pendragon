/**
 * 
 * @module ui/UI
 */
/**
 * A basic text button. 
 * @param {number} x
 * @param {number} y 
 * @param {string} text 
 * @param {string} key - object associated with button
 * @param {function} func - on click callback function
 * @param {string} fontSize
 * @property {Phaser.Text} text - modify this to change the text.
 * @property {Phaser.Button} button - modify this to change the button.
 * 
 * @constructor MenuButton
 */
function MenuButton(x, y, text, key, func, fontSize = '3em') {
    this.orignalSize = fontSize;
    // add text over the button
    this.key = key;
    this.text = game.add.text(x,
        y, text);
    this.text.anchor.setTo(.5, .5);
    this.text.font = 'Press Start 2P';
    this.text.fill = '#000000';
    this.text.fontSize = fontSize;
    this.orignalSize = fontSize;
    // the button
    this.button = game.add.button(
        x, y, null, func, this, 2, 1, 0);
    this.button.width = this.text.width;
    this.button.height = this.text.height;
    // hover effect
    this.button.anchor.setTo(.5, .5);
    this.button.onInputOver.add(function() {
        this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        this.text.fontSize = parseFloat(this.text.fontSize)+.5 + 'em';
    }, this);
    // hover off effect
    this.button.onInputOut.add(function() {
        this.text.setShadow(0, 0, 'rgba(0,0,0,0.5)', 0);
        this.text.fontSize = this.orignalSize;
        // this.text.fill = '#000000';
    }, this);
    this.button.fixedToCamera = true;
    this.text.fixedToCamera = true;

    this.kill = function() {
        this.button.kill();
        this.text.kill();
    };
}

/**
 * set the location of a MenuButton
 * @param {number} x x location
 * @param {number} y location
 */
MenuButton.prototype.setLocation = function(x, y) {
    this.button.cameraOffset.x = x;
    this.text.cameraOffset.x = x;
    this.button.cameraOffset.y = y;
    this.text.cameraOffset.y = y;
};

MenuButton.prototype.align = function(a) {
    this.text.align = a;
    this.button.align = a;
};

/**
 * Hide a button and disable it 
 * @return {any} returns itself
 */
MenuButton.prototype.hide = function() {
    this.text.visible = false;
    this.button.inputEnabled = false;
    this.text.fontSize = this.orignalSize;
    return this;
};

/**
 * Reveal the button and enable it 
 * @return {any} returns itself
 */
MenuButton.prototype.reveal = function() {
    this.text.cameraOffset.x = this.text.cameraOffset.x;
    this.button.cameraOffset.x = this.button.cameraOffset.x;
    this.button.inputEnabled = true;
    this.text.visible = true;
    return this;
};

/**
 * Cyclable list of buttons.
 * @param {*} saves  array of timestamps 
 * @param {*} func   function for buttons
 * @constructor ButtonList
 */
function ButtonList(saves, func) {
    this.saveButtons = [];
    this.saves = saves;
    this.currentPage = 0;
    let currentH = 160;
    this.startI = 0;
    this.currentI = 0;
    if (saves) {
        for (let i = this.currentI; i < saves.length; i++) {
            this.currentI = i;
            this.saveButtons.push(new MenuButton(game.camera.width / 2,
                currentH,
                saves[i].title,
                saves[i].key,
                func));
            currentH += 60;
            if (currentH > 640) {
                break;
            }
        }
    }
    console.log(this.startI, this.currentI);
    this.nextPage = new MenuButton(
        game.camera.width / 2 + 80,
        game.camera.height - 80, '>', null, () => {
            if (saves.length - this.startI < 9) return;
            this.currentPage += 1;
            for (; this.startI <= this.currentI; this.startI++) {
                this.saveButtons[this.startI].kill();
            }
            let currentH = 160;
            for (let i = this.startI; i < saves.length; i++) {
                this.currentI = i;
                this.saveButtons[i] = (new MenuButton(game.camera.width / 2,
                    currentH,
                    saves[i].title,
                    saves[i].key,
                    func));
                currentH += 60;
                if (currentH > 640) {
                    break;
                }
            }
            console.log(this.startI, this.currentI);
        });

    this.prevPage = new MenuButton(
        game.camera.width / 2 - 80,
        game.camera.height - 80, '<', null, () => {
            if (this.currentPage === 0) return;
            this.currentPage -= 1;
            for (let i = this.startI; i <= this.currentI; i++) {
                this.saveButtons[i].kill();
            }
            this.startI -= 9;
            this.currentI = this.startI;
            currentH = 160;
            for (let i = this.startI; i < saves.length; i++) {
                this.currentI = i;
                this.saveButtons[i] = (new MenuButton(game.camera.width / 2,
                    currentH,
                    saves[i].title,
                    saves[i].key,
                    func));
                currentH += 60;
                if (currentH > 640) {
                    break;
                }
            }
            console.log(this.startI, this.currentI);
        });
}

module.exports = {
  MenuButton: MenuButton,
  ButtonList: ButtonList,
};
