(() => {
    const HIDDEN_CLASS = 'is-hidden';
    const VISIBLE_CLASS = 'is-visible';
    const CHECKING_CLASS = 'is-checking';

    const ANSWERS = {
        1: 'Samen voltooien we de missie!',
        2: 'beveiliging',
        3: 'ga snel naar de volgende opdracht',
        4: '17',
        5: 'Avatar',
        6: 'Elke letter is een plekje opgeschoven',
        7: 'wachtwoord',
        8: 'Sammie',
        9: 'geheimagent'
    }

    const forms = document.querySelectorAll('form');
    const doors = document.querySelectorAll('.js-door-open');
    const dialogs = document.querySelectorAll("dialog");
    const openDialogButtons = document.querySelectorAll(".js-open-dialog-button");
    const closeDialogButtons = document.querySelectorAll("dialog .close-button");
    const checkButtons = document.querySelectorAll('.js-check-button');
    const answers = document.querySelectorAll('.js-answer');
    const lockContainers = document.querySelectorAll('.js-lock-container');
    const locks = document.querySelectorAll('.js-lock');
    const unlocks = document.querySelectorAll('.js-un-lock');
    const redLocks = document.querySelectorAll('.js-lock-red');
    const hints = document.querySelectorAll('[data-hint]');
    const easterEgg = document.querySelector('.js-easter-egg');

    forms.forEach(form => {
        form.onkeydown = (event) => {  
            if (event.key === 'Enter') {
                event.preventDefault();
            }
        }
    })

    easterEgg.addEventListener('click', () => {
        const door10 = document.querySelector('[data-door="10"]');

        if (door10.classList.contains('is-open')) {
            let W = window.innerWidth;
            let H = document.getElementById('confetti').clientHeight;
            const canvas = document.getElementById('confetti');
            const context = canvas.getContext("2d");
            const maxConfettis = 25;
            const particles = [];
    
            canvas.style.zIndex = "1";
    
            const possibleColors = [
                "#ff7336",
                "#f9e038",
                "#02cca4",
                "#383082",
                "#fed3f5",
                "#b1245a",
                "#f2733f"
            ];
    
            function randomFromTo(from, to) {
            return Math.floor(Math.random() * (to - from + 1) + from);
            }
    
            function confettiParticle() {
            this.x = Math.random() * W; // x
            this.y = Math.random() * H - H; // y
            this.r = randomFromTo(11, 33); // radius
            this.d = Math.random() * maxConfettis + 11;
            this.color =
                possibleColors[Math.floor(Math.random() * possibleColors.length)];
            this.tilt = Math.floor(Math.random() * 33) - 11;
            this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
            this.tiltAngle = 0;
    
            this.draw = function() {
                context.beginPath();
                context.lineWidth = this.r / 2;
                context.strokeStyle = this.color;
                context.moveTo(this.x + this.tilt + this.r / 3, this.y);
                context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
                return context.stroke();
            };
            }
    
            function Draw() {
            const results = [];
    
            // Magical recursive functional love
            requestAnimationFrame(Draw);
    
            context.clearRect(0, 0, W, window.innerHeight);
    
            for (var i = 0; i < maxConfettis; i++) {
                results.push(particles[i].draw());
            }
    
            let particle = {};
            let remainingFlakes = 0;
            for (var i = 0; i < maxConfettis; i++) {
                particle = particles[i];
    
                particle.tiltAngle += particle.tiltAngleIncremental;
                particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
                particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;
    
                if (particle.y <= H) remainingFlakes++;
    
                // If a confetti has fluttered out of view,
                // bring it back to above the viewport and let if re-fall.
                if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
                particle.x = Math.random() * W;
                particle.y = -30;
                particle.tilt = Math.floor(Math.random() * 10) - 20;
                }
            }
    
            return results;
            }
    
            // Push new confetti objects to `particles[]`
            for (var i = 0; i < maxConfettis; i++) {
            particles.push(new confettiParticle());
            }
    
            // Initialize
            canvas.width = W;
            canvas.height = H;
            Draw();
        }
    });

    openDialogButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const dataAttrValue = button.dataset.button;
            const correspondingDialog = Array.from(dialogs).find(dialog => dialog.dataset.dialog === dataAttrValue)
            correspondingDialog.showModal();
        })
    })

    closeDialogButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const dataAttrValue = button.dataset.close;
            const correspondingDialog = Array.from(dialogs).find(dialog => dialog.dataset.dialog === dataAttrValue)
            correspondingDialog.close();
        })
    })

    doors.forEach((door) => {
        door.addEventListener('click', () => {
            if (door.classList.contains('can-open')) {
                door.classList.add('is-open')
            }
        })
    });

    checkButtons.forEach(button => {
        button.addEventListener('click', () => {
            const dataAttrValue = button.dataset.check;
            const correspondingDialog = Array.from(dialogs).find(dialog => dialog.dataset.dialog === dataAttrValue);
            const correspondingLockContainer = Array.from(lockContainers).find(container => container.dataset.container === dataAttrValue);
            const correspondingLock = Array.from(locks).find(lock => lock.dataset.lock === dataAttrValue);
            const correspondingRedLock = Array.from(redLocks).find(lock => lock.dataset.redlock === dataAttrValue);
            const correspondingUnlock = Array.from(unlocks).find(lock => lock.dataset.unlock === dataAttrValue);
            const correspondingAnswer = Array.from(answers).find(answer => answer.dataset.input === dataAttrValue);
            const nextDoor = Array.from(doors).find(door => door.dataset.door === (Number(dataAttrValue) + 1).toString());

            correspondingLockContainer.classList.add(CHECKING_CLASS);
            addHiddenClass(correspondingRedLock);
            removeVisibleClass(correspondingRedLock);
            addVisibleClass(correspondingLock);

            if (correspondingAnswer.value === ANSWERS[Number(dataAttrValue)]) {
                setTimeout(() => {
                    addHiddenClass(correspondingLock);
                    removeVisibleClass(correspondingLock);
                    addHiddenClass(correspondingRedLock);
                    removeVisibleClass(correspondingRedLock)
                    removeHiddenClass(correspondingUnlock);
                }, "1400");
                setTimeout(() => {
                    correspondingDialog.close();
                }, "2600");
                setTimeout(() => {
                    nextDoor.classList.add('can-open')
                }, "3100");
            } else {
                setTimeout(() => {
                    setTimeout(() => {
                        addHiddenClass(correspondingLock);
                        removeVisibleClass(correspondingLock);
                        addVisibleClass(correspondingRedLock);
                    }, "500");
                    setTimeout(() => {
                        correspondingLockContainer.classList.remove(CHECKING_CLASS);
                    }, "1900");
                }, "800")
            }
        })
    });

    hints.forEach(hint => {
        const button = hint.querySelector('[data-button]');
        const text = hint.querySelector('[data-text]');

        button.addEventListener('click', () => {
            addVisibleClass(text);
            removeHiddenClass(text);
        })
    })

    function addHiddenClass(element) {
        element.classList.add(HIDDEN_CLASS);
    }

    function removeHiddenClass(element) {
        element.classList.remove(HIDDEN_CLASS);
    }

    function addVisibleClass(element) {
        element.classList.add(VISIBLE_CLASS);
    }

    function removeVisibleClass(element) {
        element.classList.remove(VISIBLE_CLASS);
    }

    

})();
