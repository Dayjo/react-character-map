'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _chars = require('./chars.json');

var _chars2 = _interopRequireDefault(_chars);

require('./style.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * <CharacterMap /> Element
 *
 * @example <CharacterMap onSelect={function(char,el){ console.log(char, el); }} />
 * @extends React
 */
var CharacterMap = function (_React$Component) {
    _inherits(CharacterMap, _React$Component);

    function CharacterMap(props) {
        _classCallCheck(this, CharacterMap);

        var _this = _possibleConstructorReturn(this, (CharacterMap.__proto__ || Object.getPrototypeOf(CharacterMap)).call(this, props));

        _this.state = {
            active: 0,
            search: '',
            categoryList: '',
            charList: '',
            fullCharList: ''
        };
        _this.resultsCache = [];
        _this.handleSearchChange = _this.handleSearchChange.bind(_this);
        _this.clickCategoryHandler = _this.clickCategoryHandler.bind(_this);
        _this.setupCharactersAtTab = _this.setupCharactersAtTab.bind(_this);
        return _this;
    }

    /**
     * Handle clicks to the category tabs.
     *
     * @param {Event} e The React synthetic event.
     */


    _createClass(CharacterMap, [{
        key: 'clickCategoryHandler',
        value: function clickCategoryHandler(e) {
            var cat = e.target.getAttribute('data-category-index');
            this.setupCharactersAtTab(cat);
        }

        /**
         * Extract character data at a tab.
         *
         * @param {Number} tab The tab to display.
         */

    }, {
        key: 'setupCharactersAtTab',
        value: function setupCharactersAtTab(tab) {
            var characterData = this.props.characterData;

            var characters = characterData || _chars2.default;

            var _charListFromCharacte = this.charListFromCharacters(characters, tab),
                charList = _charListFromCharacte.charList,
                categoryList = _charListFromCharacte.categoryList;

            this.setState({ charList: charList, categoryList: categoryList, fullCharList: charList });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.setupCharactersAtTab(0);
        }

        // Handle clicks to the characters, running the callback function.

    }, {
        key: 'charClickHandler',
        value: function charClickHandler(e, char) {
            e.preventDefault();
            return this.props.onSelect(char, e.target);
        }

        /**
         * Perform the character search.
         *
         * @param {string} search The search string.
         */

    }, {
        key: 'performSearch',
        value: function performSearch(search) {
            var characterData = this.props.characterData;

            var characters = characterData || _chars2.default;
            var filteredCharacters = { 'Results': [] };
            var sortedResults = [];
            Object.keys(characters).forEach(function (group) {
                Object.keys(characters[group]).forEach(function (character) {
                    if (!characters[group][character].name) {
                        return;
                    }
                    // If search string is one character long, look for names that start with that character.
                    if (1 === search.length) {
                        if (0 === characters[group][character].name.toLowerCase().indexOf(search.toLowerCase())) {
                            filteredCharacters['Results'].push(characters[group][character]);
                        }
                    } else {

                        // When the search string is two or more characters, do a full search of the name.
                        var index = characters[group][character].name.toLowerCase().indexOf(search.toLowerCase());
                        if (-1 !== index) {
                            // Store the results in a sorted array of buckets based on search result index.
                            // Matches with index of 20 or more are stored in the final bucket.
                            var sortPosition = index < 20 ? index : 20;
                            sortedResults[index] = sortedResults[index] || [];
                            sortedResults[index].push(characters[group][character]);
                        }
                    }
                });
            });

            // If we built a sorted array, map that to filteredCharacters, preserving the sert order.
            if (0 !== sortedResults.length) {
                sortedResults.forEach(function (results) {
                    results.forEach(function (result) {
                        filteredCharacters['Results'].push(result);
                    });
                });
            }

            return filteredCharacters;
        }

        // Filter the displayed characters.

    }, {
        key: 'handleSearchChange',
        value: function handleSearchChange(e) {
            var search = e.target.value;
            var _state = this.state,
                fullCharList = _state.fullCharList,
                charList = _state.charList;

            if ('' === search) {
                this.setState({ charList: fullCharList });
            } else {
                var filteredCharacters = this.resultsCache[search] ? this.resultsCache[search] : this.performSearch(search);
                this.resultsCache[search] = filteredCharacters;

                var _charListFromCharacte2 = this.charListFromCharacters(filteredCharacters, 0),
                    _charList = _charListFromCharacte2.charList;

                this.setState({ charList: _charList });
            }
            this.setState({ search: search });
        }
    }, {
        key: 'charListFromCharacters',
        value: function charListFromCharacters(characters, active) {
            var self = this;
            var categoryList = [];
            var i = -1;
            self.activeTab = parseInt(active, 10);
            // Loop through each category
            var charList = Object.keys(characters).map(function (category) {
                i++;

                if (self.activeTab === i) {
                    // In the active category, loop through the characters and create the list
                    var currentItems = Object.keys(characters[category]).map(function (p, c) {
                        return _react2.default.createElement(
                            'li',
                            { key: 'topli' + p },
                            _react2.default.createElement(
                                'button',
                                {
                                    'data-hex': characters[category][p].hex,
                                    'data-entity': characters[category][p].entity,
                                    'data-char': characters[category][p].char,
                                    'data-title': characters[category][p].name,
                                    onClick: function onClick(e) {
                                        return self.charClickHandler(e, characters[category][p]);
                                    }
                                },
                                characters[category][p].char
                            )
                        );
                    });
                }
                categoryList.push(_react2.default.createElement(
                    'li',
                    { key: 'clli' + category + i, className: "charMap--category-menu-item" + (self.activeTab === i ? ' active' : '') },
                    _react2.default.createElement(
                        'button',
                        {
                            'data-category-index': i,
                            onClick: self.clickCategoryHandler
                        },
                        category
                    )
                ));

                return _react2.default.createElement(
                    'li',
                    { key: 'innerli' + category + i,
                        'data-category-name': category
                    },
                    _react2.default.createElement(
                        'ul',
                        {
                            className: "charMap--category " + (self.activeTab === i ? ' active' : '')
                        },
                        currentItems
                    )
                );
            });
            return { charList: charList, categoryList: categoryList };
        }
    }, {
        key: 'render',
        value: function render() {
            var _state2 = this.state,
                categoryList = _state2.categoryList,
                charList = _state2.charList,
                search = _state2.search;

            return _react2.default.createElement(
                'div',
                { className: 'charMap--container' },
                _react2.default.createElement(
                    'ul',
                    null,
                    _react2.default.createElement(
                        'label',
                        { 'for': 'filter' },
                        'Filter: '
                    ),
                    _react2.default.createElement('input', {
                        type: 'text',
                        name: 'filter',
                        'aria-label': 'Filter',
                        value: search,
                        onChange: this.handleSearchChange,
                        autoComplete: false
                    })
                ),
                '' === search && _react2.default.createElement(
                    'ul',
                    { className: 'charMap--category-menu', 'aria-label': 'Categories' },
                    categoryList
                ),
                _react2.default.createElement(
                    'ul',
                    { className: 'charMap--categories', 'aria-label': 'Character List' },
                    charList
                )
            );
        }
    }]);

    return CharacterMap;
}(_react2.default.Component);

exports.default = CharacterMap;