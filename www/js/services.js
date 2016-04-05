angular.module('starter.services', [])

.factory('Menu', function() {
  var items = [{
    id: 0,
    name: 'Spots',
    text: spotData,
    img: 'img/graff-crop.png'
  }, {
    id: 1,
    name: 'Routes',
    text: spotData,
    img: 'img/route-crop.png'
  }, {
    id: 2,
    name: 'Flicks',
    text: spotData,
    img: 'img/flicks.png'
  }, {
    id: 3,
    name: 'Re-ups',
    text: spotData,
    img: 'img/cans.png'
  }, {
    id: 4,
    name: 'Shared',
    text: spotData,
    img: 'img/route-crop.png'
  }];

  return {
    all: function() {
      return items;
    },
    remove: function(item) {
      items.splice(items.indexOf(item), 1);
    },
    get: function(itemId) {
      for (var i = 0; i < chats.length; i++) {
        if (items[i].id === parseInt(itemId)) {
          return items[i];
        }
      }
      return null;
    }
  };
});
