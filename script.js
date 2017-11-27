function rotatePivot(input) {
  var el = document.querySelector('.control ' + input.dataset.pivot);

  el.style.transform = 'rotate(' + input.value + 'deg)';
}

var animation = {};
animation.frames = [];

var selectedFrame;
var selectedFrameNumber;

function deleteFrame() {
  if (selectedFrameNumber === undefined)
    return;
  animation.frames.splice(selectedFrameNumber, 1);
  selectedFrame = undefined;

  selectedFrameNumber = selectedFrameNumber == animation.frames.length ? selectedFrameNumber - 1 : selectedFrameNumber;

  if (animation.frames.length > 0) {
    selectFrame(animation.frames[selectedFrameNumber], selectedFrameNumber);
    saveAnimation();
  }

  showAllKeys();
}

function addFrame() {

  var obj = {};
  obj.keys = {};

  obj.percent = document.querySelector('input[name="persent"]').value.split(',').join('.');

  [].forEach.call(document.querySelectorAll('input[data-pivot]'), function(item) {
    obj.keys[item.dataset.pivot] = item.value;
  });

  if (!selectedFrame)
    animation.frames.push(obj);
  else
    animation.frames[selectedFrameNumber] = obj;

  selectedFrame = undefined;
  document.querySelector('button[onclick="addFrame()"]').innerHTML = 'Add cadr';

  showAllKeys();
  saveAnimation();
}

function focusOnInput(event) {
  if (event.target.tagName == 'INPUT')
    event.target.focus();
}

function saveAnimation() {
  animation.name = document.querySelector('input[name="name"]').value;
  animation.duration = document.querySelector('input[name="duration"]').value;
  document.getElementById('css').innerHTML = createAnimation(animation);
  document.querySelector('.preview').className = 'preview ' + animation.name;
  document.getElementById('preview-style').innerHTML = createAnimation(animation, '.preview');
}

function selectFrame(anim, i) {
  [].forEach.call(document.querySelectorAll('input[data-pivot]'), function(item) {
    item.value = anim.keys[item.dataset.pivot];
    rotatePivot(item);
  });

  selectedFrame = anim;
  selectedFrameNumber = i;

  document.querySelector('button[onclick="addFrame()"]').innerHTML = 'Save cadr';

  document.querySelector('input[name="persent"]').value = anim.percent;
};

function showAllKeys() {
  document.getElementById('keys').innerHTML = '';

  animation.frames.sort(function(a, b) {
    return a.percent - b.percent;
  });

  animation.frames.forEach(function(item, i) {

    var k = document.createElement('button');

    k.innerHTML = i;

    k.addEventListener('click', (function(i) { var item = this; return function() { selectFrame(item, i) } }).call(item, i));

    document.getElementById('keys').appendChild(k);

  });
};

function createAnimation(obj, prefix) {
  var strings = [];

  if (!prefix)
    prefix = '';
  var duration = obj.duration;
  var animationName = obj.name;



  for (let i = 0; i < obj.frames.length; i++) {
    let j = 0;
    let percent = obj.frames[i].percent;

    for (key in obj.frames[i].keys) {
      let strAttrAnim = key.split(/[\.:\(\)]/).join('');

      if (!strings[j]) {
        strings[j] = ' ';
        strings[j] += '@keyframes ' + animationName + strAttrAnim + '{';
      }

      if (obj.frames[i].keys[key] === null || obj.frames[i].keys[key] === undefined || obj.frames[i].keys[key].trim() === '') {
        obj.frames[i].keys[key] = 0;
      }



      strings[j] += percent + '% { transform: rotate(' + obj.frames[i].keys[key] + 'deg);}';

      if (i + 1 == obj.frames.length) {
        strings[j] += '}' + prefix + '.' + animationName + ' ' + key + '{ animation: ' + animationName + strAttrAnim + ' ' + duration + 's infinite; }';
      }
      j++;

    }
  }

  return strings.join(' ');
}