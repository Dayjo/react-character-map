'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

        try {
            _this.paletteCache = JSON.parse(localStorage.getItem('dayjoReactCharPalette'));
            _this.paletteCache = Array.isArray(_this.paletteCache) ? _this.paletteCache : [];
        } catch (error) {
            _this.paletteCache = [];
        }

        _this.secondaryPaletteCache = JSON.parse(sessionStorage.getItem('dayjoReactCharSecondaryPalette'));
        _this.secondaryPaletteCache = Array.isArray(_this.secondaryPaletteCache) ? _this.secondaryPaletteCache : [];
        _this.leastUsedCharFromPalette = false;
        _this.dirtyPalette = false;
        _this.state = {
            active: 0,
            search: '',
            categoryList: '',
            charList: '',
            fullCharList: '',
            charPalette: _this.paletteCache
        };
        _this.resultsCache = [];
        _this.handleSearchChange = _this.handleSearchChange.bind(_this);
        _this.clickCategoryHandler = _this.clickCategoryHandler.bind(_this);
        _this.setupCharactersAtTab = _this.setupCharactersAtTab.bind(_this);

        // To-do: Update handling of refs. React 16.3+ has createRef. 16.8+ has useRef.
        _this.bindInputRef = _this.bindInputRef.bind(_this);
        _this.searchInput = null;
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
            var _this2 = this;

            this.setupCharactersAtTab(0);

            // Focus search input on mount.
            if (false !== this.props.autofocus && this.searchInput && 'focus' in this.searchInput) {
                // This is more reliable after a short wait.
                window.setTimeout(function () {
                    _this2.searchInput.focus();
                }, 25);
            }
        }

        /**
         * Binds the input element to the component as a ref.
         *
         * @param {object} element The search input element.
         */

    }, {
        key: 'bindInputRef',
        value: function bindInputRef(element) {
            this.searchInput = element;
        }

        // Handle clicks to the characters, running the callback function.

    }, {
        key: 'charClickHandler',
        value: function charClickHandler(e, char) {
            e.preventDefault();
            this.setPalette(char);
            return this.props.onSelect(char, e.target);
        }

        /**
         * Sets the charPalette state.
         *
         * @param {object} char The character object
         */

    }, {
        key: 'setPalette',
        value: function setPalette(char) {
            var paletteMaxSize = 5;
            var charAtIndex = this.paletteCache.findIndex(function (p) {
                return p.hex === char.hex;
            });

            /* If the primary palette cache is not fully filled OR if the character is already
             * present in primary, then add the character to it.
             */
            if (this.paletteCache.length < paletteMaxSize || -1 !== charAtIndex) {
                this.paletteCache = this.addToPalette(char, this.paletteCache);
                /* Else add it to the secondary cache. */
            } else if (-1 === charAtIndex) {
                this.secondaryPaletteCache = this.addToPalette(char, this.secondaryPaletteCache);
            }

            /* If the primary cache is fully filled, then save the least used
             * character from the cache for future reference.
             */
            if (this.paletteCache.length === paletteMaxSize) {
                this.leastUsedCharFromPalette = this.paletteCache[paletteMaxSize - 1];
            }

            /*
             * Sort the palettes in descending order of the count.
             */
            this.paletteCache.sort(function (a, b) {
                return b.count - a.count;
            });
            this.secondaryPaletteCache.sort(function (a, b) {
                return b.count - a.count;
            });

            if (this.secondaryPaletteCache.length > 0) {
                /* If the count of the max used character in secondary is more than
                 * the count of the least used character in the primary, then remove
                 * that character from secondary and replace the least used character
                 * from primary with it.
                 */
                if (this.secondaryPaletteCache[0].count > this.paletteCache[paletteMaxSize - 1].count) {
                    var maxCountCharInSecondaryPalette = this.secondaryPaletteCache.shift();
                    this.paletteCache[paletteMaxSize - 1] = maxCountCharInSecondaryPalette;
                    this.paletteCache.sort(function (a, b) {
                        return b.count - a.count;
                    });
                }
            }

            localStorage.setItem('dayjoReactCharPalette', JSON.stringify(this.paletteCache));
            sessionStorage.setItem('dayjoReactCharSecondaryPalette', JSON.stringify(this.secondaryPaletteCache));
            this.setState({ 'charPalette': this.paletteCache });
        }

        /**
         * Adds a character to the character palette.
         *
         * @param {object} char The character object.
         * @param {array} palette The char palette array.
         * @returns {array}
         */

    }, {
        key: 'addToPalette',
        value: function addToPalette(char, palette) {
            var charAtIndex = palette.findIndex(function (p) {
                return p.hex === char.hex;
            });

            if (charAtIndex !== -1) {
                ++palette[charAtIndex].count;
            } else {
                palette.push({
                    'char': char.char,
                    'entity': char.entity,
                    'hex': char.hex,
                    'name': char.name,
                    'count': 1
                });
            }

            return palette;
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
        key: 'getCategoryName',
        value: function getCategoryName(category) {
            /**
             * The categoryNames prop is expected to be a JavaScript object with translated category names corresponding
             * to the object keys in chars.json. Keys are the untranslated names from chars.json; values are the translated
             * names.
             */
            var categoryNames = this.props.categoryNames;


            if (!categoryNames || 'object' !== (typeof categoryNames === 'undefined' ? 'undefined' : _typeof(categoryNames))) {
                return category;
            }

            if (!(category in categoryNames) || 'string' !== typeof categoryNames[category]) {
                return category;
            }

            return categoryNames[category];
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
                                    title: characters[category][p].name,
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
                        self.getCategoryName(category)
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


            var filterLabelText = this.props.filterLabelText || 'Filter';
            var categoriesLabelText = this.props.categoriesLabelText || 'Categories';
            var characterListLabelText = this.props.characterListLabelText || 'Character List';
            var mostUsedPaletteText = this.props.mostUsedPaletteLabelText || 'Most used';

            var _charListFromCharacte3 = this.charListFromCharacters({ 'Palette': this.paletteCache }, 0),
                charPalette = _charListFromCharacte3.charList;

            return _react2.default.createElement(
                'div',
                { className: 'charMap--container' },
                _react2.default.createElement(
                    'ul',
                    { className: 'charMap--filter' },
                    _react2.default.createElement(
                        'label',
                        { htmlFor: 'filter' },
                        filterLabelText + ': '
                    ),
                    _react2.default.createElement('input', {
                        type: 'text',
                        name: 'filter',
                        'aria-label': filterLabelText,
                        value: search,
                        onChange: this.handleSearchChange,
                        autoComplete: 'false',
                        ref: this.bindInputRef
                    })
                ),
                this.props.mostUsedPalette && this.paletteCache.length ? _react2.default.createElement(
                    'div',
                    { className: 'charMap--last-used-palette-wrapper' },
                    _react2.default.createElement(
                        'label',
                        null,
                        mostUsedPaletteText + ': '
                    ),
                    _react2.default.createElement(
                        'ul',
                        { className: 'charMap--last-used-palette', 'aria-label': mostUsedPaletteText },
                        charPalette
                    )
                ) : '',
                '' === search && _react2.default.createElement(
                    'ul',
                    { className: 'charMap--category-menu', 'aria-label': categoriesLabelText },
                    categoryList
                ),
                _react2.default.createElement(
                    'ul',
                    { className: 'charMap--categories', 'aria-label': characterListLabelText },
                    charList
                )
            );
        }
    }]);

    return CharacterMap;
}(_react2.default.Component);

exports.default = CharacterMap;