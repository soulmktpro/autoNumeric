/**
 * Unit tests for autoNumeric.js
 * @author Alexandre Bonneau <alexandre.bonneau@linuxfr.eu>
 * @copyright © 2016 Alexandre Bonneau
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sub license, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/* eslint space-in-parens: 0 */
/* eslint spaced-comment: 0 */
// eslint-disable-next-line
/* global describe, it, xdescribe, xit, fdescribe, fit, expect, beforeEach, afterEach, spyOn */

import AutoNumeric from '../../src/AutoNumeric';

// The autoNumeric tests :

//-----------------------------------------------------------------------------
//---- Options & settings
const autoNumericOptionsEuro = {
    digitGroupSeparator        : '.',
    decimalCharacter           : ',',
    decimalCharacterAlternative: '.',
    currencySymbol             : ' €',
    currencySymbolPlacement    : 's',
    roundingMethod             : 'U',
};
const autoNumericOptionsEuroNumber = {
    digitGroupSeparator        : '.',
    decimalCharacter           : ',',
    decimalCharacterAlternative: '.',
    currencySymbol             : ' €',
    currencySymbolPlacement    : 's',
    roundingMethod             : 'U',
    outputFormat               : 'number',
};
const autoNumericOptionsDollar = {
    digitGroupSeparator    : ',',
    decimalCharacter       : '.',
    currencySymbol         : '$',
    currencySymbolPlacement: 'p',
    roundingMethod         : 'U',
};

describe('The autoNumeric object', () => {
    describe('manages default options', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput); // Initiate the autoNumeric input
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        const defaultOption = {
            allowDecimalPadding          : true,
            currencySymbol               : '',
            currencySymbolPlacement      : 'p',
            decimalCharacter             : '.',
            decimalCharacterAlternative  : null,
            decimalPlacesOverride        : null,
            decimalPlacesShownOnFocus    : null,
            defaultValueOverride         : null,
            digitalGroupSpacing          : '3',
            digitGroupSeparator          : ',',
            emptyInputBehavior           : 'focus',
            failOnUnknownOption          : false,
            formatOnPageLoad             : true,
            isCancellable                : true,
            leadingZero                  : 'deny',
            maximumValue                 : '9999999999999.99',
            minimumValue                 : '-9999999999999.99',
            modifyValueOnWheel           : true,
            negativeBracketsTypeOnBlur   : null,
            negativePositiveSignPlacement: null,
            noEventListeners             : false,
            noSeparatorOnFocus           : false,
            onInvalidPaste               : 'error',
            outputFormat                 : null,
            overrideMinMaxLimits         : null,
            readOnly                     : false,
            roundingMethod               : 'S',
            saveValueToSessionStorage    : false,
            scaleDecimalPlaces           : null,
            scaleDivisor                 : null,
            scaleSymbol                  : null,
            selectNumberOnly             : true,
            serializeSpaces              : '+',
            showPositiveSign             : false,
            showWarnings                 : true,
            suffixText                   : '',
            unformatOnHover              : true,
            unformatOnSubmit             : false,
            wheelStep                    : 'progressive',
        };

        it('should return some default values', () => {
            // Test the options one by one, which makes it easier to spot the error
            //XXX This loop is useful to spot the faulty options, since only those that are not equal to the default are shown
            const defaultSettings = AutoNumeric.getDefaultConfig();
            let i = 0;
            for (const prop in defaultSettings) {
                i++;
                if (defaultSettings.hasOwnProperty(prop)) {
                    if (defaultSettings[prop] !== defaultOption[prop]) {
                        console.log(`${i}: Setting ${prop} = [${defaultSettings[prop]}][${defaultOption[prop]}]`); //DEBUG
                    }
                    expect(defaultSettings[prop]).toEqual(defaultOption[prop]);
                }
            }

            // Global test
            expect(defaultSettings).toEqual(defaultOption);
        });

        it('should return the predefined language options', () => {
            const defaultLanguageOption = {
                French       : { // Français
                    selectNumberOnly             : true,
                    digitGroupSeparator          : '.',
                    decimalCharacter             : ',',
                    decimalCharacterAlternative  : '.',
                    currencySymbol               : '\u202f€',
                    currencySymbolPlacement      : AutoNumeric.options.currencySymbolPlacement.suffix,
                    negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.prefix,
                    roundingMethod               : 'U',
                    leadingZero                  : 'deny',
                    minimumValue                 : '-9999999999999.99',
                    maximumValue                 : '9999999999999.99',
                },
                NorthAmerican: {
                    selectNumberOnly             : true,
                    digitGroupSeparator          : ',',
                    decimalCharacter             : '.',
                    currencySymbol               : '$',
                    currencySymbolPlacement      : AutoNumeric.options.currencySymbolPlacement.prefix,
                    negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.right,
                    roundingMethod               : 'U',
                    leadingZero                  : 'deny',
                    minimumValue                 : '-9999999999999.99',
                    maximumValue                 : '9999999999999.99',
                },
            };

            // Test the options one by one, which makes it easier to spot the error
            //XXX This loop is useful to spot the faulty options, since only those that are not equal to the default are shown
            const predefinedLanguages = AutoNumeric.getPredefinedOptions();
            let i = 0;
            for (const lang in defaultLanguageOption) { //XXX Here I test only this language subset
                i++;
                if (predefinedLanguages.hasOwnProperty(lang)) {
                    for (const prop in predefinedLanguages[lang]) {
                        if (predefinedLanguages[lang].hasOwnProperty(prop)) {
                            if (predefinedLanguages[lang][prop] !== defaultLanguageOption[lang][prop]) {
                                console.log(`${i}: Setting ${prop} = [${predefinedLanguages[lang][prop]}][${defaultLanguageOption[lang][prop]}]`); //DEBUG
                            }
                            expect(predefinedLanguages[lang][prop]).toEqual(defaultLanguageOption[lang][prop]);
                        }
                    }
                }
            }

            // Global test
            // expect(an.getPredefinedOptions()).toEqual(defaultLanguageOption); //XXX Here I test only a language subset, not all language options
        });

        it('should be initiated with the default values', () => {
            const defaultSettings = AutoNumeric.getDefaultConfig();
            const aNInputSettings = aNInput.getSettings();
            /* let i = 0;
            for (let prop in defaultSettings) { //XXX This loop fails since the decimalPlacesOverride default is overridden by maximumValue/minimumValue (cf. following test cases)
                i++;
                if (defaultSettings.hasOwnProperty(prop)) {
                    console.log(`${i}: Setting ${prop} = [${defaultSettings[prop]}][${aNInputSettings[prop]}]`); //DEBUG
                    expect(defaultSettings[prop]).toEqual(aNInputSettings[prop]);
                }
            } */

            expect(defaultSettings.digitGroupSeparator        ).toEqual(aNInputSettings.digitGroupSeparator        );
            expect(defaultSettings.noSeparatorOnFocus         ).toEqual(aNInputSettings.noSeparatorOnFocus         );
            expect(defaultSettings.digitalGroupSpacing        ).toEqual(aNInputSettings.digitalGroupSpacing        );
            expect(defaultSettings.decimalCharacter           ).toEqual(aNInputSettings.decimalCharacter           );
            expect(defaultSettings.decimalCharacterAlternative).toEqual(aNInputSettings.decimalCharacterAlternative);
            expect(defaultSettings.currencySymbol             ).toEqual(aNInputSettings.currencySymbol             );
            expect(defaultSettings.currencySymbolPlacement    ).toEqual(aNInputSettings.currencySymbolPlacement    );

            // Special case for `negativePositiveSignPlacement`, see the related tests
            // expect(defaultSettings.negativePositiveSignPlacement).toEqual(aNInputSettings.negativePositiveSignPlacement);
            expect(defaultSettings.suffixText                   ).toEqual(aNInputSettings.suffixText                   );
            expect(defaultSettings.overrideMinMaxLimits         ).toEqual(aNInputSettings.overrideMinMaxLimits         );
            expect(defaultSettings.maximumValue                 ).toEqual(aNInputSettings.maximumValue                 );
            expect(defaultSettings.minimumValue                 ).toEqual(aNInputSettings.minimumValue                 );

            // Special case for 'decimalPlacesOverride': when it's set to 'null' (which is the default), then its value is overwritten by the greater minimumValue or maximumValue number of decimals
            const [, decimalPart] = aNInputSettings.minimumValue.split('.');
            let decimalPartLength = 0;
            if (decimalPart !== void(0)) {
                decimalPartLength = decimalPart.length;
            }
            expect(decimalPartLength).toEqual(2);
            expect(aNInputSettings.decimalPlacesOverride).toEqual(decimalPartLength);

            expect(defaultSettings.decimalPlacesShownOnFocus ).toEqual(aNInputSettings.decimalPlacesShownOnFocus );
            expect(defaultSettings.scaleDivisor              ).toEqual(aNInputSettings.scaleDivisor              );
            expect(defaultSettings.scaleDecimalPlaces        ).toEqual(aNInputSettings.scaleDecimalPlaces        );
            expect(defaultSettings.scaleSymbol               ).toEqual(aNInputSettings.scaleSymbol               );
            expect(defaultSettings.saveValueToSessionStorage ).toEqual(aNInputSettings.saveValueToSessionStorage );
            expect(defaultSettings.roundingMethod            ).toEqual(aNInputSettings.roundingMethod            );
            expect(defaultSettings.allowDecimalPadding       ).toEqual(aNInputSettings.allowDecimalPadding       );
            expect(defaultSettings.negativeBracketsTypeOnBlur).toEqual(aNInputSettings.negativeBracketsTypeOnBlur);
            expect(defaultSettings.emptyInputBehavior        ).toEqual(aNInputSettings.emptyInputBehavior        );
            expect(defaultSettings.leadingZero               ).toEqual(aNInputSettings.leadingZero               );
            expect(defaultSettings.formatOnPageLoad          ).toEqual(aNInputSettings.formatOnPageLoad          );
            expect(defaultSettings.selectNumberOnly          ).toEqual(aNInputSettings.selectNumberOnly          );
            expect(defaultSettings.defaultValueOverride      ).toEqual(aNInputSettings.defaultValueOverride      );
            expect(defaultSettings.unformatOnSubmit          ).toEqual(aNInputSettings.unformatOnSubmit          );
            expect(defaultSettings.outputFormat              ).toEqual(aNInputSettings.outputFormat              );
            expect(defaultSettings.showWarnings              ).toEqual(aNInputSettings.showWarnings              );
        });

        it('should update the options values accordingly', () => {
            aNInput.update({ digitGroupSeparator: '.', decimalCharacter: ',', currencySymbol: '€' });
            const defaultSettings = AutoNumeric.getDefaultConfig();
            const aNInputSettings = aNInput.getSettings();

            expect(defaultSettings.digitGroupSeparator).not.toEqual(aNInputSettings.digitGroupSeparator );
            expect(defaultSettings.decimalCharacter   ).not.toEqual(aNInputSettings.decimalCharacter    );
            expect(defaultSettings.currencySymbol     ).not.toEqual(aNInputSettings.currencySymbol      );
            expect(aNInputSettings.digitGroupSeparator).toEqual('.');
            expect(aNInputSettings.decimalCharacter   ).toEqual(',');
            expect(aNInputSettings.currencySymbol     ).toEqual('€');
        });
    });

    describe('manages the negativePositiveSignPlacement configuration option specially', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        /*
         * Special case for `negativePositiveSignPlacement`:
         * If the user has not set the placement of the negative sign (`negativePositiveSignPlacement`), but has set a currency symbol (`currencySymbol`),
         * then the default value of `negativePositiveSignPlacement` is modified in order to keep the resulting output logical by default :
         * - "$-1,234.56" instead of "-$1,234.56" ({currencySymbol: "$", negativePositiveSignPlacement: "r"})
         * - "-1,234.56$" instead of "1,234.56-$" ({currencySymbol: "$", currencySymbolPlacement: "s", negativePositiveSignPlacement: "p"})
         */
        it(`this should set the negativePositiveSignPlacement differently based on the currencySymbol and currencySymbolPlacement (s) values`, () => {
            // Case 1 : settings.currencySymbolPlacement equals 's'
            aNInput = new AutoNumeric(newInput, { currencySymbol: '$', currencySymbolPlacement: 's' }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.getSettings();

            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('p');
        });

        it(`this should set the negativePositiveSignPlacement differently based on the currencySymbol and currencySymbolPlacement (p) values`, () => {
            // Case 2 : settings.currencySymbolPlacement equals 'p'
            aNInput = new AutoNumeric(newInput, { currencySymbol: '$', currencySymbolPlacement: 'p' }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.getSettings();

            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('l');
        });

        /*
         * Default cases
         */
        it(`this should set the default negativePositiveSignPlacement value if it's not set by the user, to -1,234.56`, () => {
            aNInput = new AutoNumeric(newInput, { negativePositiveSignPlacement : null }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.getSettings();

            expect(aNInputSettings.currencySymbol).toEqual('');
            expect(aNInputSettings.currencySymbolPlacement).toEqual('p');
            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('l');
        });


        it(`this should set the default negativePositiveSignPlacement value if it's not set by the user, to -$1,234.56`, () => {
            aNInput = new AutoNumeric(newInput, { currencySymbol: '$', negativePositiveSignPlacement : null }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.getSettings();

            expect(aNInputSettings.currencySymbol).toEqual('$');
            expect(aNInputSettings.currencySymbolPlacement).toEqual('p');
            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('l');
        });

        it(`this should not override the negativePositiveSignPlacement value 'p' if it has been set by the user`, () => {
            aNInput = new AutoNumeric(newInput, { negativePositiveSignPlacement : 'p' }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.getSettings();
            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('p');
        });

        it(`this should not override the negativePositiveSignPlacement value 's' if it has been set by the user`, () => {
            aNInput = new AutoNumeric(newInput, { negativePositiveSignPlacement : 's' }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.getSettings();
            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('s');
        });

        it(`this should not override the negativePositiveSignPlacement value 'l' if it has been set by the user`, () => {
            aNInput = new AutoNumeric(newInput, { negativePositiveSignPlacement : 'l' }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.getSettings();
            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('l');
        });

        it(`this should not override the negativePositiveSignPlacement value 'r' if it has been set by the user`, () => {
            aNInput = new AutoNumeric(newInput, { negativePositiveSignPlacement : 'r' }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.getSettings();
            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('r');
        });
    });

    describe('manages the decimalPlacesOverride configuration option specially', () => {
        let localANInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
        });

        afterEach(() => { // Un-initialization
            localANInput.remove();
            document.body.removeChild(newInput);
        });

        it('should set the default value for decimalPlacesOverride', () => {
            // Setup
            localANInput = new AutoNumeric(newInput); // Initiate the autoNumeric input
            const localANInputSettings = localANInput.getSettings();

            //--------------- The tests
            // Default value overridden
            let [, decimalPart] = localANInputSettings.minimumValue.split('.');
            let decimalPartLength = 0;
            if (decimalPart !== void(0)) {
                decimalPartLength = decimalPart.length;
            }
            expect(decimalPartLength).toEqual(2);

            [, decimalPart] = localANInputSettings.maximumValue.split('.');
            decimalPartLength = 0;
            if (decimalPart !== void(0)) {
                decimalPartLength = decimalPart.length;
            }
            expect(decimalPartLength).toEqual(2);

            expect(localANInputSettings.decimalPlacesOverride).toEqual(decimalPartLength); // Special case for 'decimalPlacesOverride': when it's set to 'null' (which is the default), then its value is overwritten by the greater minimumValue or maximumValue decimal part
        });

        it('should set the default value for decimalPlacesOverride when minimumValue and maximumValue have different decimal sizes, maximumValue being bigger', () => {
            // Setup
            localANInput = new AutoNumeric(newInput, { minimumValue: '-99.99', maximumValue: '99.999' }); // Initiate the autoNumeric input
            const localANInputSettings = localANInput.getSettings();

            //--------------- The tests
            // Default value overridden
            let [, decimalPart] = localANInputSettings.minimumValue.split('.');
            let minimumValueDecimalPartLength = 0;
            if (decimalPart !== void(0)) {
                minimumValueDecimalPartLength = decimalPart.length;
            }
            expect(minimumValueDecimalPartLength).toEqual(2);

            [, decimalPart] = localANInputSettings.maximumValue.split('.');
            let maximumValueDecimalPartLength = 0;
            if (decimalPart !== void(0)) {
                maximumValueDecimalPartLength = decimalPart.length;
            }
            expect(maximumValueDecimalPartLength).toEqual(3);

            expect(localANInputSettings.decimalPlacesOverride).toEqual(Math.max(minimumValueDecimalPartLength, maximumValueDecimalPartLength)); // Special case for 'decimalPlacesOverride': when it's set to 'null' (which is the default), then its value is overwritten by the greater minimumValue or maximumValue decimal part
        });

        it('should set the default value for decimalPlacesOverride when minimumValue and maximumValue have different decimal sizes, minimumValue being bigger', () => {
            // Setup
            localANInput = new AutoNumeric(newInput, { minimumValue: '-99.999', maximumValue: '99.99' }); // Initiate the autoNumeric input
            const localANInputSettings = localANInput.getSettings();

            //--------------- The tests
            // Default value overridden
            let [, decimalPart] = localANInputSettings.minimumValue.split('.');
            let minimumValueDecimalPartLength = 0;
            if (decimalPart !== void(0)) {
                minimumValueDecimalPartLength = decimalPart.length;
            }
            expect(minimumValueDecimalPartLength).toEqual(3);

            [, decimalPart] = localANInputSettings.maximumValue.split('.');
            let maximumValueDecimalPartLength = 0;
            if (decimalPart !== void(0)) {
                maximumValueDecimalPartLength = decimalPart.length;
            }
            expect(maximumValueDecimalPartLength).toEqual(2);

            expect(localANInputSettings.decimalPlacesOverride).toEqual(Math.max(minimumValueDecimalPartLength, maximumValueDecimalPartLength)); // Special case for 'decimalPlacesOverride': when it's set to 'null' (which is the default), then its value is overwritten by the greater minimumValue or maximumValue decimal part
        });

        it(`should set the decimalPlacesOverride value if it's not set to 'null', overwriting minimumValue and maximumValue settings`, () => {
            // Setup
            spyOn(console, 'warn'); // The next statement will output a warning since we override the decimals places declared in minimumValue
            localANInput = new AutoNumeric(newInput, { minimumValue: '-99.999', maximumValue: '99.99', decimalPlacesOverride: '4' }); // Initiate the autoNumeric input
            expect(console.warn).toHaveBeenCalled();
            const localANInputSettings = localANInput.getSettings();

            //--------------- The tests
            // Default value overridden
            let [, decimalPart] = localANInputSettings.minimumValue.split('.');
            let minimumValueDecimalPartLength = 0;
            if (decimalPart !== void(0)) {
                minimumValueDecimalPartLength = decimalPart.length;
            }
            expect(minimumValueDecimalPartLength).toEqual(3);

            [, decimalPart] = localANInputSettings.maximumValue.split('.');
            let maximumValueDecimalPartLength = 0;
            if (decimalPart !== void(0)) {
                maximumValueDecimalPartLength = decimalPart.length;
            }
            expect(maximumValueDecimalPartLength).toEqual(2);

            expect(localANInputSettings.decimalPlacesOverride).toEqual(4); // Special case for 'decimalPlacesOverride': when it's set to 'null' (which is the default), then its value is overwritten by the greater minimumValue or maximumValue decimal part, otherwise it takes precedence over minimumValue/maximumValue
        });

        it(`should set the decimalPlacesOverride value, and show a warning when setting a greater decimalPlacesShownOnFocus`, () => {
            // Setup
            spyOn(console, 'warn'); // The next statement will output a warning since decimalPlacesShownOnFocus is lower than decimalPlacesOverride
            localANInput = new AutoNumeric(newInput, { minimumValue: '-99.99', maximumValue: '99.99', decimalPlacesOverride: '5', decimalPlacesShownOnFocus: '3' }); // Initiate the autoNumeric input
            expect(console.warn).toHaveBeenCalled();
            const localANInputSettings = localANInput.getSettings();

            expect(localANInputSettings.decimalPlacesOverride).toEqual(5); // 'decimalPlacesOverride' is not overwritten by a greater decimalPlacesShownOnFocus
        });

        it(`should set the decimalPlacesOverride value when decimalPlacesOverride is not defined, and show a warning when setting a greater decimalPlacesShownOnFocus`, () => {
            // Setup
            spyOn(console, 'warn'); // The next statement will output a warning since decimalPlacesShownOnFocus is lower than decimalPlacesOverride
            localANInput = new AutoNumeric(newInput, { minimumValue: '-99.9999', maximumValue: '99.9999', decimalPlacesShownOnFocus: '3' }); // Initiate the autoNumeric input
            expect(console.warn).toHaveBeenCalled();
            const localANInputSettings = localANInput.getSettings();

            expect(localANInputSettings.decimalPlacesOverride).toEqual(4); // 'decimalPlacesOverride' is not overwritten by a greater decimalPlacesShownOnFocus
        });

        it(`should set the decimalPlacesOverride value, and show a warning when setting a greater decimalPlacesShownOnFocus`, () => {
            // Setup
            spyOn(console, 'warn'); // The next statement will output a warning since decimalPlacesShownOnFocus is lower than decimalPlacesOverride
            localANInput = new AutoNumeric(newInput, { minimumValue: '-99.99', maximumValue: '99.99', decimalPlacesOverride: '5', decimalPlacesShownOnFocus: '3' }); // Initiate the autoNumeric input
            expect(console.warn).toHaveBeenCalled();
            const localANInputSettings = localANInput.getSettings();

            expect(localANInputSettings.decimalPlacesOverride).toEqual(5); // 'decimalPlacesOverride' is not overwritten by a greater decimalPlacesShownOnFocus
        });

        it(`should set the decimalPlacesOverride value when decimalPlacesOverride is not defined, and show a warning when setting a greater decimalPlacesShownOnFocus`, () => {
            // Setup
            spyOn(console, 'warn'); // The next statement will output a warning since decimalPlacesShownOnFocus is lower than decimalPlacesOverride
            localANInput = new AutoNumeric(newInput, { minimumValue: '-99.9999', maximumValue: '99.9999', decimalPlacesShownOnFocus: '3' }); // Initiate the autoNumeric input
            expect(console.warn).toHaveBeenCalled();
            const localANInputSettings = localANInput.getSettings();

            expect(localANInputSettings.decimalPlacesOverride).toEqual(4); // 'decimalPlacesOverride' is not overwritten by a greater decimalPlacesShownOnFocus
        });
    });

    describe(`autoNumeric 'getSettings' options`, () => {
        let aNInput;
        let newInput;
        const anOptions = { decimalCharacter: ',', digitGroupSeparator: '.' };

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput, anOptions); // Initiate the autoNumeric input
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('should return a correct raw value with a point as a decimal character', () => {
            aNInput.set('1234.56');
            expect(aNInput.get()).toEqual('1234.56');
            expect(aNInput.getNumber()).toEqual(1234.56);
            expect(aNInput.getSettings().rawValue).toEqual('1234.56');

            aNInput.set('-1234.56');
            expect(aNInput.get()).toEqual('-1234.56');
            expect(aNInput.getNumber()).toEqual(-1234.56);
            expect(aNInput.getSettings().rawValue).toEqual('-1234.56');

            aNInput.set('1234');
            expect(aNInput.get()).toEqual('1234');
            expect(aNInput.getNumber()).toEqual(1234);
            expect(aNInput.getSettings().rawValue).toEqual('1234');

            aNInput.set('-1234');
            expect(aNInput.get()).toEqual('-1234');
            expect(aNInput.getNumber()).toEqual(-1234);
            expect(aNInput.getSettings().rawValue).toEqual('-1234');
        });
    });

//TODO Complete the tests in order to test every single option separately

//-----------------------------------------------------------------------------
//---- Methods

    describe('provides public static methods', () => { //FIXME à terminer
        //FIXME à terminer
        // test
        // validate
        // areSettingsValid, getDefaultConfig, getPredefinedOptions, format, unformat,
    });

    describe('provides public methods', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput); // Initiate the autoNumeric input
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('should recognize only a specific list of methods', () => {
            const otherDomElement = document.createElement('input');
            document.body.appendChild(otherDomElement);

            // The 'init' method is implicit tested since we use that to setup those tests
            expect(() => aNInput.update({})).not.toThrow();
            expect(() => aNInput.getSettings()).not.toThrow();
            expect(() => aNInput.set(1234)).not.toThrow();
            expect(() => aNInput.set(1234.56)).not.toThrow();
            expect(() => aNInput.setUnformatted(123456.789)).not.toThrow();
            expect(() => aNInput.get()).not.toThrow();
            expect(() => aNInput.getNumericString()).not.toThrow();
            expect(() => aNInput.getFormatted()).not.toThrow();
            expect(() => aNInput.getNumber()).not.toThrow();
            expect(() => aNInput.getLocalized()).not.toThrow();
            expect(() => aNInput.getLocalized('number')).not.toThrow();
            expect(() => aNInput.reformat()).not.toThrow();
            expect(() => aNInput.unformat()).not.toThrow();
            expect(() => aNInput.unformatLocalized('number')).not.toThrow();
            expect(() => aNInput.isPristine()).not.toThrow();
            expect(() => aNInput.select()).not.toThrow();
            expect(() => aNInput.selectNumber()).not.toThrow();
            expect(() => aNInput.selectInteger()).not.toThrow();
            expect(() => aNInput.selectDecimal()).not.toThrow();
            expect(() => aNInput.node()).not.toThrow();
            expect(() => aNInput.parent()).not.toThrow();
            expect(() => aNInput.detach()).not.toThrow();

            const yetAnotherDomElement = document.createElement('input');
            document.body.appendChild(yetAnotherDomElement);
            const anYetAnotherDomElement = new AutoNumeric(yetAnotherDomElement);
            expect(() => aNInput.attach(anYetAnotherDomElement)).not.toThrow();

            expect(() => aNInput.formatOther(27368)).not.toThrow();
            expect(() => aNInput.unformatOther('1.234.789,89 €')).not.toThrow();
            expect(() => aNInput.init(otherDomElement)).not.toThrow();
            expect(() => aNInput.init(otherDomElement, true)).not.toThrow();

            // Calling the pre-defined options
            expect(() => aNInput.french()).not.toThrow();
            expect(() => aNInput.northAmerican()).not.toThrow();
            expect(() => aNInput.british()).not.toThrow();
            expect(() => aNInput.swiss()).not.toThrow();
            expect(() => aNInput.japanese()).not.toThrow();
            expect(() => aNInput.spanish()).not.toThrow();
            expect(() => aNInput.chinese()).not.toThrow();

            document.body.removeChild(otherDomElement);
        });

        it(`should recognize the 'form*' methods`, () => {
            // Create a form element, 3 inputs, and only 2 autoNumeric ones
            const theForm = document.createElement('form');
            document.body.appendChild(theForm);
            const input1 = document.createElement('input');
            const input2 = document.createElement('input');
            const input3 = document.createElement('input');
            theForm.appendChild(input1);
            theForm.appendChild(input2);
            theForm.appendChild(input3);
            // Initialize the two autoNumeric inputs
            const aNInput1 = new AutoNumeric(input1);
            const aNInput3 = new AutoNumeric(input3);
            // Set their value (and the option at the same time)
            aNInput1.set(13567.897, AutoNumeric.getPredefinedOptions().French);
            expect(aNInput1.getFormatted()).toEqual('13.567,90\u202f€');
            aNInput3.set(2987367.0262, AutoNumeric.getPredefinedOptions().NorthAmerican);
            expect(aNInput3.getFormatted()).toEqual('$2,987,367.03');
            input2.value = 666;

            // Create a dummy form submit callback in order to prevent the code to really submit
            spyOn(theForm, 'submit').and.callFake(() => false);

            // Use the from* functions
            expect(() => aNInput1.form()).not.toThrow();
            expect(() => aNInput1.formNumericString()).not.toThrow();
            expect(() => aNInput1.formFormatted()).not.toThrow();
            expect(() => aNInput1.formLocalized()).not.toThrow();
            expect(() => aNInput1.formArrayNumericString()).not.toThrow();
            expect(() => aNInput1.formArrayFormatted()).not.toThrow();
            expect(() => aNInput1.formArrayLocalized()).not.toThrow();
            expect(() => aNInput1.formJsonNumericString()).not.toThrow();
            expect(() => aNInput1.formJsonFormatted()).not.toThrow();
            expect(() => aNInput1.formJsonLocalized()).not.toThrow();
            expect(() => aNInput1.formUnformat()).not.toThrow();
            expect(() => aNInput1.formReformat()).not.toThrow();
            expect(() => aNInput1.formSubmitNumericString()).not.toThrow();
            expect(() => aNInput1.formSubmitFormatted()).not.toThrow();
            expect(() => aNInput1.formSubmitLocalized()).not.toThrow();
            expect(() => aNInput1.formSubmitArrayNumericString(() => {})).not.toThrow();
            expect(() => aNInput1.formSubmitArrayFormatted(() => {})).not.toThrow();
            expect(() => aNInput1.formSubmitArrayLocalized(() => {})).not.toThrow();
            expect(() => aNInput1.formSubmitJsonNumericString(() => {})).not.toThrow();
            expect(() => aNInput1.formSubmitJsonFormatted(() => {})).not.toThrow();
            expect(() => aNInput1.formSubmitJsonLocalized(() => {})).not.toThrow();

            expect(theForm.submit).toHaveBeenCalled();

            // Test the behavior of some of those form* functions
            expect(aNInput1.form()).toEqual(theForm);

            // Remove the 3 inputs and the form elements
            theForm.removeChild(input1);
            theForm.removeChild(input2);
            theForm.removeChild(input3);
            document.body.removeChild(theForm);
        });

        /*
        xit('should not allow to call private methods', () => {
            //TODO In an ideal world, JS would allow us to declare attributes and methodes `private` (or `protected`), in order to provide a clear API (cf. http://stackoverflow.com/a/33533611/2834898). This is unfortunately not the case so until this is fixed, the following function will be visible...
            expect(() => aNInput._createEventListeners()).toThrow();
            expect(() => aNInput._getChildANInputElement()).toThrow();
            expect(() => aNInput._createGlobalList()).toThrow();
            expect(() => aNInput._doesGlobalListExists()).toThrow();
            expect(() => aNInput._addToGlobalList()).toThrow();
            expect(() => aNInput._removeFromGlobalList()).toThrow();
            expect(() => aNInput._isInGlobalList()).toThrow();
            expect(() => aNInput._createLocalList()).toThrow();
            expect(() => aNInput._addToLocalList()).toThrow();
            expect(() => aNInput._removeFromLocalList()).toThrow();
            expect(() => aNInput._runCallbacksFoundInTheSettingsObject()).toThrow();
            expect(() => aNInput._maximumVMinAndVMaxDecimalLength()).toThrow();
            expect(() => aNInput._stripAllNonNumberCharacters()).toThrow();
            expect(() => aNInput._toggleNegativeBracket()).toThrow();
            expect(() => aNInput._convertToNumericString()).toThrow();
            expect(() => aNInput._toLocale()).toThrow();
            expect(() => aNInput._modifyNegativeSignAndDecimalCharacterForRawValue()).toThrow();
            expect(() => aNInput._modifyNegativeSignAndDecimalCharacterForFormattedValue()).toThrow();
            expect(() => aNInput._checkEmpty()).toThrow();
            expect(() => aNInput._addGroupSeparators()).toThrow();
            expect(() => aNInput._truncateZeros()).toThrow();
            expect(() => aNInput._roundValue()).toThrow();
            expect(() => aNInput._truncateDecimal()).toThrow();
            expect(() => aNInput._checkIfInRangeWithOverrideOption()).toThrow();
            expect(() => aNInput._getCurrentElement()).toThrow(); //FIXME à terminer
            expect(() => aNInput._keepAnOriginalSettingsCopy()).toThrow();
            expect(() => aNInput._readCookie()).toThrow();
            expect(() => aNInput._storageTest()).toThrow();
            expect(() => aNInput._isInputTypeSupported()).toThrow();
            expect(() => aNInput._cleanLeadingTrailingZeros()).toThrow();
            expect(() => aNInput._trimPaddedZerosFromDecimalPlaces()).toThrow();
            expect(() => aNInput._saveValueToPersistentStorage()).toThrow();
            expect(() => aNInput._getStringOrArray()).toThrow();
            expect(() => aNInput._onFocusInAndMouseEnter()).toThrow();
            expect(() => aNInput._onFocus()).toThrow();
            expect(() => aNInput._onKeydown()).toThrow();
            expect(() => aNInput._onKeypress()).toThrow();
            expect(() => aNInput._onKeyup()).toThrow();
            expect(() => aNInput._onFocusOutAndMouseLeave()).toThrow();
            expect(() => aNInput._onPaste()).toThrow();
            expect(() => aNInput._onBlur()).toThrow();
            expect(() => aNInput._onWheel()).toThrow();
            expect(() => aNInput._onFormSubmit()).toThrow();
            expect(() => aNInput._isElementSupported()).toThrow();
            expect(() => aNInput._formatDefaultValueOnPageLoad()).toThrow();
            expect(() => aNInput._correctNegativePositiveSignPlacementOption()).toThrow();
            expect(() => aNInput._calculateVMinAndVMaxIntegerSizes()).toThrow();
            expect(() => aNInput._correctDecimalPlacesOverrideOption()).toThrow();
            expect(() => aNInput._setAlternativeDecimalSeparatorCharacter()).toThrow();
            expect(() => aNInput._cachesUsualRegularExpressions()).toThrow();
            expect(() => aNInput._transformOptionsValuesToDefaultTypes()).toThrow();
            expect(() => aNInput._convertOldOptionsToNewOnes()).toThrow();
            expect(() => aNInput._setSettings()).toThrow();
            expect(() => aNInput._toNumericValue()).toThrow();
            expect(() => aNInput._preparePastedText()).toThrow();
            expect(() => aNInput._checkIfInRange()).toThrow();
            expect(() => aNInput._updateInternalProperties()).toThrow();
            expect(() => aNInput._updateEventKeycode()).toThrow();
            expect(() => aNInput._saveCancellableValue()).toThrow();
            expect(() => aNInput._setSelection()).toThrow();
            expect(() => aNInput._setCaretPosition()).toThrow();
            expect(() => aNInput._getLeftAndRightPartAroundTheSelection()).toThrow();
            expect(() => aNInput._getUnformattedLeftAndRightPartAroundTheSelection()).toThrow();
            expect(() => aNInput._normalizeParts()).toThrow();
            expect(() => aNInput._setValueParts()).toThrow();
            expect(() => aNInput._getSignPosition()).toThrow();
            expect(() => aNInput._expandSelectionOnSign()).toThrow();
            expect(() => aNInput._checkPaste()).toThrow();
            expect(() => aNInput._skipAlways()).toThrow();
            expect(() => aNInput._defaultSelectAll()).toThrow();
            expect(() => aNInput._processCharacterDeletionIfTrailingNegativeSign()).toThrow();
            expect(() => aNInput._processCharacterDeletion()).toThrow();
            expect(() => aNInput._processCharacterInsertion()).toThrow();
            expect(() => aNInput._formatValue()).toThrow();
        });
        */

        it(`should recognize the 'clear' method`, () => {
            // Special case that needs to be done alone since it reset the AutoNumeric element content
            expect(() => aNInput.clear()).not.toThrow();
            expect(() => aNInput.clear(true)).not.toThrow();
        });

        it(`should recognize the 'remove' method`, () => {
            // Special case that needs to be done alone since it remove the AutoNumeric object
            expect(() => aNInput.remove()).not.toThrow();
        });

        it(`should recognize the 'wipe' method`, () => {
            // Special case that needs to be done alone since it remove the AutoNumeric object
            expect(() => aNInput.wipe()).not.toThrow();
        });

        it(`should recognize the 'nuke' method`, () => {
            const anotherInput = document.createElement('input');
            anotherInput.id = 'randomStringThatIsUnique_eech6Ohv';
            document.body.appendChild(anotherInput);
            const anotherAnInput = new AutoNumeric(anotherInput); // Initiate the autoNumeric input

            // Special case that needs to be done alone since it remove the AutoNumeric object
            expect(() => anotherAnInput.nuke()).not.toThrow();
            // Test that the anInput.node() element is no more
            const verifNoMoreElement = document.getElementById('randomStringThatIsUnique_eech6Ohv');
            expect(verifNoMoreElement).toBeNull();
        });

        it('should not recognize non-existant methods', () => {
            expect(() => aNInput(1)).toThrow();
            expect(() => aNInput(-10)).toThrow();
            expect(() => aNInput.foobar('foobar')).toThrow();
        });
    });

    describe('provides public methods for modifying multiple AutoNumeric objects sharing the same local list at once', () => {
        let newInput1;
        let newInput2;
        let newInput3;
        let newInput4;
        let newInput5;
        const options = { currencySymbol: ' €', currencySymbolPlacement: 's', decimalCharacter: ',', digitGroupSeparator: ' ', outputFormat: ',-' };

        beforeEach(() => { // Initialization
            newInput1 = document.createElement('input');
            newInput2 = document.createElement('input');
            newInput3 = document.createElement('input');
            newInput4 = document.createElement('input');
            newInput5 = document.createElement('input');
            document.body.appendChild(newInput1);
            document.body.appendChild(newInput2);
            document.body.appendChild(newInput3);
            document.body.appendChild(newInput4);
            document.body.appendChild(newInput5);
            newInput1.name = 'nameInput1';
            newInput2.name = 'nameInput2';
            newInput3.name = 'nameInput3';
            newInput4.name = 'nameInput4';
            newInput5.name = 'nameInput5';
        });

        afterEach(() => { // Un-initialization
            document.body.removeChild(newInput1);
            document.body.removeChild(newInput2);
            document.body.removeChild(newInput3);
            document.body.removeChild(newInput4);
            document.body.removeChild(newInput5);
        });

        it('should initialize other DOM element from an existing AutoNumeric object, and `set` the values globally across those elements', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            expect(anElement1.set(22).getFormatted()).toEqual('22,00 €');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.set(187568.243).getFormatted()).toEqual('187 568,24 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            expect(anElement5.set(1028.005).getFormatted()).toEqual('1 028,01 €');
            expect(anElement4.global.size()).toEqual(5);

            // Then test that those elements share the same local list
            anElement2.global.set(1223355.66);
            expect(anElement1.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement2.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement3.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement4.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement5.getFormatted()).toEqual('1 223 355,66 €');

            // ...and that removing one from the list is taken into account
            anElement3.global.removeObject(newInput3);
            expect(anElement4.global.size()).toEqual(4);
            anElement2.global.set(42);
            expect(anElement1.getFormatted()).toEqual('42,00 €');
            expect(anElement2.getFormatted()).toEqual('42,00 €');
            expect(anElement3.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement4.getFormatted()).toEqual('42,00 €');
            expect(anElement5.getFormatted()).toEqual('42,00 €');
        });

        it('should `setUnformatted` the values globally across those elements', () => {
            newInput5.value = '88764.24';
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            expect(anElement1.set(22).getFormatted()).toEqual('22,00 €');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.set(187568.243).getFormatted()).toEqual('187 568,24 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            expect(anElement5.getFormatted()).toEqual('88 764,24 €');

            // Test that those elements share the same local list
            anElement2.global.setUnformatted(1223355.66);
            expect(anElement1.getFormatted()).toEqual('1223355.66');
            expect(anElement2.getFormatted()).toEqual('1223355.66');
            expect(anElement3.getFormatted()).toEqual('1223355.66');
            expect(anElement4.getFormatted()).toEqual('1223355.66');
            expect(anElement5.getFormatted()).toEqual('1223355.66');

            // The unformatted value can be formatted using `reformat`. This does not affect the other elements.
            expect(anElement3.reformat().getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement4.getFormatted()).toEqual('1223355.66');
        });

        it('should `reformat` the values globally across those elements', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            expect(anElement1.set(22).getFormatted()).toEqual('22,00 €');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.set(187568.243).getFormatted()).toEqual('187 568,24 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            expect(anElement5.getFormatted()).toEqual('');

            // Test that those elements share the same local list
            anElement2.global.setUnformatted(20241.08);
            expect(anElement1.getFormatted()).toEqual('20241.08');
            expect(anElement2.getFormatted()).toEqual('20241.08');
            expect(anElement3.getFormatted()).toEqual('20241.08');
            expect(anElement4.getFormatted()).toEqual('20241.08');
            expect(anElement5.getFormatted()).toEqual('20241.08');

            // Reformat the elements globally
            anElement3.global.reformat();
            expect(anElement1.getFormatted()).toEqual('20 241,08 €');
            expect(anElement2.getFormatted()).toEqual('20 241,08 €');
            expect(anElement3.getFormatted()).toEqual('20 241,08 €');
            expect(anElement4.getFormatted()).toEqual('20 241,08 €');
            expect(anElement5.getFormatted()).toEqual('20 241,08 €');
        });

        it('should `unformat` the values globally across those elements', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            expect(anElement1.set(22).getFormatted()).toEqual('22,00 €');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.set(187568.243).getFormatted()).toEqual('187 568,24 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            expect(anElement5.getFormatted()).toEqual('');

            // Unformat the elements globally
            anElement3.global.unformat();
            expect(anElement1.getFormatted()).toEqual('22');
            expect(anElement2.getFormatted()).toEqual('13568.24');
            expect(anElement3.getFormatted()).toEqual('187568.24');
            expect(anElement4.getFormatted()).toEqual('21613568.24');
            expect(anElement5.getFormatted()).toEqual('');
        });

        it('should `unformatLocalized` the values globally across those elements', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            expect(anElement1.set(22).getFormatted()).toEqual('22,00 €');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.set(-187568.243).getFormatted()).toEqual('-187 568,24 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            expect(anElement5.getFormatted()).toEqual('');

            // Unformat the elements globally
            anElement3.global.unformatLocalized();
            expect(anElement1.getFormatted()).toEqual('22');
            expect(anElement2.getFormatted()).toEqual('13568,24');
            expect(anElement3.getFormatted()).toEqual('187568,24-');
            expect(anElement4.getFormatted()).toEqual('21613568,24');
            expect(anElement5.getFormatted()).toEqual('');
        });

        it('should `unformatLocalized` the values globally across those elements, while forcing the output format', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            expect(anElement1.set(22).getFormatted()).toEqual('22,00 €');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.set(-187568.243).getFormatted()).toEqual('-187 568,24 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            expect(anElement5.getFormatted()).toEqual('');

            // Unformat the elements globally
            anElement3.global.unformatLocalized('-.');
            expect(anElement1.getFormatted()).toEqual('22');
            expect(anElement2.getFormatted()).toEqual('13568.24');
            expect(anElement3.getFormatted()).toEqual('-187568.24');
            expect(anElement4.getFormatted()).toEqual('21613568.24');
            expect(anElement5.getFormatted()).toEqual('');
        });

        it('should check if the values have not changed with `isPristine`', () => {
            newInput5.value = '88764.24';
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            // Check each element individually
            expect(anElement1.isPristine()).toBe(true);
            expect(anElement2.isPristine()).toBe(true);
            expect(anElement3.isPristine()).toBe(true);
            expect(anElement4.isPristine()).toBe(true);

            expect(anElement1.isPristine(false)).toBe(true);
            expect(anElement2.isPristine(false)).toBe(true);
            expect(anElement3.isPristine(false)).toBe(true);
            expect(anElement4.isPristine(false)).toBe(true);

            expect(anElement5.isPristine(false)).toBe(false); // During initialization, the format changed
            expect(anElement5.isPristine()).toBe(true);

            // Then check all the elements globally
            expect(anElement5.global.isPristine()).toBe(true);
            expect(anElement1.set(22).getFormatted()).toEqual('22,00 €');
            expect(anElement1.isPristine()).toBe(false);
            expect(anElement1.isPristine(false)).toBe(false);
            expect(anElement5.global.isPristine()).toBe(false);
            //FIXME Test the case where the raw value have not changed, but the formatting has
        });

        //FIXME Test the other methods: getNumericString, getFormatted, getNumber, getLocalized, clear, remove, wipe, has, addObject, removeObject, empty, elements, getList
    });

    describe('initialization methods with the `multiple()` function', () => {
        let newInput1;
        let newInput2;
        let newInput3;
        let newInput4;
        let newInput5;
        const options = { currencySymbol: ' €', currencySymbolPlacement: 's', decimalCharacter: ',', digitGroupSeparator: ' ' };

        beforeEach(() => { // Initialization
            newInput1 = document.createElement('input');
            newInput2 = document.createElement('input');
            newInput3 = document.createElement('input');
            newInput4 = document.createElement('input');
            newInput5 = document.createElement('input');
            document.body.appendChild(newInput1);
            document.body.appendChild(newInput2);
            document.body.appendChild(newInput3);
            document.body.appendChild(newInput4);
            document.body.appendChild(newInput5);
        });

        afterEach(() => { // Un-initialization
            document.body.removeChild(newInput1);
            document.body.removeChild(newInput2);
            document.body.removeChild(newInput3);
            document.body.removeChild(newInput4);
            document.body.removeChild(newInput5);
        });

        it('should throw when calling `multiple()` the wrong way', () => {
            expect(() => AutoNumeric.multiple([newInput1])).not.toThrow();
            expect(() => AutoNumeric.multiple(newInput1)).toThrow();
            expect(() => AutoNumeric.multiple(42)).toThrow();
            expect(() => AutoNumeric.multiple(true)).toThrow();
        });

        it('should show a warning when calling `multiple()` with an empty array', () => {
            spyOn(console, 'warn');
            AutoNumeric.multiple([]);
            expect(console.warn).toHaveBeenCalled();
        });

        it('should correctly initialize multiple AutoNumeric elements, with an array of elements', () => {
            const [anElement2, anElement3, anElement4, anElement5] = AutoNumeric.multiple([newInput2, newInput3, newInput4, newInput5]);
            expect(anElement2.getFormatted()).toEqual('');
            expect(anElement3.getFormatted()).toEqual('');
            expect(anElement4.getFormatted()).toEqual('');
            expect(anElement5.getFormatted()).toEqual('');

            expect(anElement2.set(13568.243).getFormatted()).toEqual('13,568.24');
            expect(anElement3.set(187568.243).getFormatted()).toEqual('187,568.24');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21,613,568.24');
            expect(anElement5.set(1028.005).getFormatted()).toEqual('1,028.01');

            //TODO Use .global.update() here instead of manually changing each option object one by one -->
            expect(anElement2.update(options).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.update(options).getFormatted()).toEqual('187 568,24 €');
            expect(anElement4.update(options).getFormatted()).toEqual('21 613 568,24 €');
            expect(anElement5.update(options).getFormatted()).toEqual('1 028,01 €');
        });

        it('should correctly initialize multiple AutoNumeric elements, with an array of one element', () => {
            const [anElement4] = AutoNumeric.multiple([newInput4]);
            expect(anElement4.getFormatted()).toEqual('');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21,613,568.24');

            //TODO Use .global.update() here instead of manually changing each option object one by one -->
            expect(anElement4.update(options).getFormatted()).toEqual('21 613 568,24 €');
        });

        it('should correctly initialize multiple AutoNumeric elements, with an empty array', () => {
            spyOn(console, 'warn'); // Suppress the warning message
            const result = AutoNumeric.multiple([]);
            expect(Array.isArray(result)).toEqual(true);
            expect(result.length).toEqual(0);
        });

        it('should correctly initialize multiple AutoNumeric elements, with an array of elements with options', () => {
            const [anElement2, anElement3, anElement4, anElement5] = AutoNumeric.multiple([newInput2, newInput3, newInput4, newInput5], null, options);
            expect(anElement2.getFormatted()).toEqual('');
            expect(anElement3.getFormatted()).toEqual('');
            expect(anElement4.getFormatted()).toEqual('');
            expect(anElement5.getFormatted()).toEqual('');

            expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.set(187568.243).getFormatted()).toEqual('187 568,24 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            expect(anElement5.set(1028.005).getFormatted()).toEqual('1 028,01 €');
        });

        it('should correctly initialize multiple AutoNumeric elements, with a selector string that select nothing', () => {
            spyOn(console, 'warn'); // Suppress the warning message
            const result = AutoNumeric.multiple('.randomSelectThatDoesNotExists_Ge6coo5a > input');
            expect(Array.isArray(result)).toEqual(true);
            expect(result.length).toEqual(0);
        });

        it('should correctly initialize multiple AutoNumeric elements, with a selector string that select only one element', () => {
            newInput4.classList.add('id_multiple_pieb5Aex');
            const result = AutoNumeric.multiple('.id_multiple_pieb5Aex');
            expect(result.length).toEqual(1);
            const [anElement4] = result;

            expect(anElement4.getFormatted()).toEqual('');
            expect(anElement4.set(-21613968.243).getFormatted()).toEqual('-21,613,968.24');
            expect(anElement4.update(options).getFormatted()).toEqual('21 613 968,24- €');
        });

        it('should correctly initialize multiple AutoNumeric elements, with a selector string that select multiple elements', () => {
            newInput1.classList.add('id_multiple_toh1og1I');
            newInput2.classList.add('id_multiple_toh1og1I');
            newInput4.classList.add('id_multiple_toh1og1I');
            const result = AutoNumeric.multiple('.id_multiple_toh1og1I');
            expect(result.length).toEqual(3);
            const [anElement1, anElement2, anElement4] = result;

            expect(anElement1.getFormatted()).toEqual('');
            expect(anElement2.getFormatted()).toEqual('');
            expect(anElement4.getFormatted()).toEqual('');

            expect(anElement1.set(187568.243).getFormatted()).toEqual('187,568.24');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13,568.24');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21,613,568.24');

            //TODO Use .global.update() here instead of manually changing each option object one by one -->
            expect(anElement1.update(options).getFormatted()).toEqual('187 568,24 €');
            expect(anElement2.update(options).getFormatted()).toEqual('13 568,24 €');
            expect(anElement4.update(options).getFormatted()).toEqual('21 613 568,24 €');
        });

        it('should correctly initialize multiple AutoNumeric elements, with a selector string that select multiple elements, and options', () => {
            newInput1.classList.add('id_multiple_ahXee8je');
            newInput2.classList.add('id_multiple_ahXee8je');
            newInput4.classList.add('id_multiple_ahXee8je');
            const result = AutoNumeric.multiple('.id_multiple_ahXee8je', options);
            expect(result.length).toEqual(3);
            const [anElement1, anElement2, anElement4] = result;

            expect(anElement1.set(187568.243).getFormatted()).toEqual('187 568,24 €');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
        });

        it('should correctly initialize multiple AutoNumeric elements, with an array of elements and one initial value', () => {
            const [anElement2, anElement3, anElement4, anElement5] = AutoNumeric.multiple([newInput2, newInput3, newInput4, newInput5]);
            expect(anElement2.getFormatted()).toEqual('');
            expect(anElement3.getFormatted()).toEqual('');
            expect(anElement4.getFormatted()).toEqual('');
            expect(anElement5.getFormatted()).toEqual('');

            expect(anElement2.set(13568.243).getFormatted()).toEqual('13,568.24');
            expect(anElement3.set(187568.243).getFormatted()).toEqual('187,568.24');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21,613,568.24');
            expect(anElement5.set(1028.005).getFormatted()).toEqual('1,028.01');

            //TODO Use .global.update() here instead of manually changing each option object one by one -->
            expect(anElement2.update(options).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.update(options).getFormatted()).toEqual('187 568,24 €');
            expect(anElement4.update(options).getFormatted()).toEqual('21 613 568,24 €');
            expect(anElement5.update(options).getFormatted()).toEqual('1 028,01 €');
        });

        it('should correctly initialize multiple AutoNumeric elements, with multiple elements, one initial value, and options', () => {
            newInput1.classList.add('id_multiple_Gur0hei6');
            newInput2.classList.add('id_multiple_Gur0hei6');
            newInput4.classList.add('id_multiple_Gur0hei6');
            const result = AutoNumeric.multiple('.id_multiple_Gur0hei6', 187568.243, options);
            expect(result.length).toEqual(3);
            const [anElement1, anElement2, anElement4] = result;

            expect(anElement1.getFormatted()).toEqual('187 568,24 €');
            expect(anElement2.getFormatted()).toEqual('187 568,24 €');
            expect(anElement4.getFormatted()).toEqual('187 568,24 €');
        });

        it('should correctly initialize multiple AutoNumeric elements, with multiple elements, multiple initial values (complete), and options', () => {
            newInput1.classList.add('id_multiple_Gaet4zaa');
            newInput2.classList.add('id_multiple_Gaet4zaa');
            newInput4.classList.add('id_multiple_Gaet4zaa');
            const result = AutoNumeric.multiple('.id_multiple_Gaet4zaa', [187568.243, 13568.243, 21613568.243], options);
            expect(result.length).toEqual(3);
            const [anElement1, anElement2, anElement4] = result;

            expect(anElement1.getFormatted()).toEqual('187 568,24 €');
            expect(anElement2.getFormatted()).toEqual('13 568,24 €');
            expect(anElement4.getFormatted()).toEqual('21 613 568,24 €');
        });

        it('should correctly initialize multiple AutoNumeric elements, with multiple elements, multiple initial values (incomplete), and options', () => {
            newInput1.classList.add('id_multiple_RaePhut1');
            newInput2.classList.add('id_multiple_RaePhut1');
            newInput4.classList.add('id_multiple_RaePhut1');
            const result = AutoNumeric.multiple('.id_multiple_RaePhut1', [187568.243, 13568.243], options);
            expect(result.length).toEqual(3);
            const [anElement1, anElement2, anElement4] = result;

            expect(anElement1.getFormatted()).toEqual('187 568,24 €');
            expect(anElement2.getFormatted()).toEqual('13 568,24 €');
            expect(anElement4.getFormatted()).toEqual('');
        });
    });

    describe('initialization methods with the `multiple()` function and the `parentElement`/`exclude` object', () => {
        let formElement;
        let newInput1;
        let newInput2;
        let newInput3;
        let newInput4;
        let newInput5;
        const options = { currencySymbol: ' €', currencySymbolPlacement: 's', decimalCharacter: ',', digitGroupSeparator: ' ' };

        beforeEach(() => { // Initialization
            formElement = document.createElement('form');
            newInput1 = document.createElement('input');
            newInput2 = document.createElement('input');
            newInput3 = document.createElement('input');
            newInput4 = document.createElement('input');
            newInput5 = document.createElement('input');
            document.body.appendChild(newInput5);
            document.body.appendChild(formElement);
            formElement.appendChild(newInput1);
            formElement.appendChild(newInput2);
            formElement.appendChild(newInput3);
            formElement.appendChild(newInput4);
        });

        afterEach(() => { // Un-initialization
            formElement.removeChild(newInput1);
            formElement.removeChild(newInput2);
            formElement.removeChild(newInput3);
            formElement.removeChild(newInput4);
            document.body.removeChild(newInput5);
            document.body.removeChild(formElement);
        });

        it('should correctly initialize multiple AutoNumeric elements, with only the `parentElement` attribute initialized, and without options', () => {
            const result = AutoNumeric.multiple({ rootElement: formElement });
            expect(result.length).toEqual(4);
            const [anElement1, anElement2, anElement3, anElement4] = result;

            expect(anElement1.getFormatted()).toEqual('');
            expect(anElement2.getFormatted()).toEqual('');
            expect(anElement3.getFormatted()).toEqual('');
            expect(anElement4.getFormatted()).toEqual('');

            expect(anElement1.set(1028.005).getFormatted()).toEqual('1,028.01');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13,568.24');
            expect(anElement3.set(187568.243).getFormatted()).toEqual('187,568.24');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21,613,568.24');
        });

        it('should correctly initialize multiple AutoNumeric elements, with only the `parentElement` attribute initialized, with options', () => {
            const result = AutoNumeric.multiple({ rootElement: formElement }, options);
            expect(result.length).toEqual(4);
            const [anElement1, anElement2, anElement3, anElement4] = result;

            expect(anElement1.getFormatted()).toEqual('');
            expect(anElement2.getFormatted()).toEqual('');
            expect(anElement3.getFormatted()).toEqual('');
            expect(anElement4.getFormatted()).toEqual('');

            expect(anElement1.set(1028.005).getFormatted()).toEqual('1 028,01 €');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.set(187568.243).getFormatted()).toEqual('187 568,24 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
        });

        it('should correctly initialize multiple AutoNumeric elements, with the `parentElement` and `exclude` attributes initialized, and without options', () => {
            const result = AutoNumeric.multiple({ rootElement: formElement, exclude: [newInput2, newInput3] });
            expect(result.length).toEqual(2);
            const [anElement1, anElement4] = result;

            expect(anElement1.getFormatted()).toEqual('');
            expect(anElement4.getFormatted()).toEqual('');

            expect(anElement1.set(1028.005).getFormatted()).toEqual('1,028.01');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21,613,568.24');
        });

        it('should correctly initialize multiple AutoNumeric elements, with the `parentElement` and `exclude` attributes initialized, with options', () => {
            const result = AutoNumeric.multiple({ rootElement: formElement, exclude: [newInput2, newInput3] }, options);
            expect(result.length).toEqual(2);
            const [anElement1, anElement4] = result;

            expect(anElement1.getFormatted()).toEqual('');
            expect(anElement4.getFormatted()).toEqual('');

            expect(anElement1.set(1028.005).getFormatted()).toEqual('1 028,01 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
        });

        it('should throw when trying to initialize multiple AutoNumeric elements, with an invalide `exclude` attributes', () => {
            expect(() => AutoNumeric.multiple({ rootElement: formElement, exclude: 'foobar' })).toThrow();
        });
    });

    describe('initialization methods', () => { //FIXME à terminer -->
        let newInput;
        const options = { decimalCharacter: ',', digitGroupSeparator: '.' };

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
        });

        afterEach(() => { // Un-initialization
            document.body.removeChild(newInput);
        });

        it('should correctly initialize non-input elements', () => {
            // Create elements
            const p1 = document.createElement('p');
            p1.textContent = '0.0214';
            document.body.appendChild(p1);
            const p2 = document.createElement('p');
            document.body.appendChild(p2);
            const code = document.createElement('code');
            code.textContent = '12345.67';
            document.body.appendChild(code);
            const div = document.createElement('div');
            div.textContent = '12345.67';
            document.body.appendChild(div);
            const h5 = document.createElement('h5');
            h5.textContent = '12345.67';
            document.body.appendChild(h5);
            const label = document.createElement('label');
            label.textContent = '12345.67';
            document.body.appendChild(label);
            const span = document.createElement('span');
            span.textContent = '12345.67';
            document.body.appendChild(span);

            expect(() => new AutoNumeric(newInput)).not.toThrow();
            expect(new AutoNumeric(p1, { scaleDecimalPlaces: 3, scaleDivisor: 0.01, scaleSymbol: '%', maximumValue: '999.9999' }).getFormatted()).toEqual('2.140%');
            expect(new AutoNumeric(p2, 666.42).french().getFormatted()).toEqual('666,42 €');
            expect(new AutoNumeric(code, AutoNumeric.getPredefinedOptions().Japanese).getFormatted()).toEqual('¥12,345.67');
            expect(new AutoNumeric(div).northAmerican().getFormatted()).toEqual('$12,345.67');
            expect(new AutoNumeric(h5, 666.42).swiss().getFormatted()).toEqual('666.42 CHF');
            expect(new AutoNumeric(label).getFormatted()).toEqual('12,345.67');
            expect(new AutoNumeric(span, '').getFormatted()).toEqual('');

            // Remove the elements
            document.body.removeChild(p1);
            document.body.removeChild(p2);
            document.body.removeChild(code);
            document.body.removeChild(div);
            document.body.removeChild(h5);
            document.body.removeChild(label);
            document.body.removeChild(span);
        });

        it('should fail initializing an input element of type `number`', () => {
            // Create the element
            const inputTel = document.createElement('input');
            inputTel.type = 'number';
            inputTel.value = '663241800.0214';
            document.body.appendChild(inputTel);

            expect(() => new AutoNumeric(inputTel)).toThrow();

            // Remove the element
            document.body.removeChild(inputTel);
        });

        it('should correctly initialize input element of type `tel`', () => {
            // Create the element
            const inputTel = document.createElement('input');
            inputTel.type = 'tel';
            inputTel.value = '663241800.0214';
            document.body.appendChild(inputTel);

            expect(new AutoNumeric(inputTel).french().getFormatted()).toEqual('663.241.800,02 €');

            // Remove the element
            document.body.removeChild(inputTel);
        });

        it('should correctly initialize the AutoNumeric element', () => {
            expect(() => new AutoNumeric(newInput)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element', () => {
            expect(() => new AutoNumeric(newInput, options)).not.toThrow(); // With one option object
        });

        it('should correctly initialize the AutoNumeric element', () => {
            expect(() => new AutoNumeric(newInput).french()).not.toThrow(); // With one pre-defined language object
        });

        it('should correctly initialize the AutoNumeric element', () => {
            expect(() => new AutoNumeric(newInput).french(options)).not.toThrow(); // With one pre-defined language object and additional options that will override the defaults
        });

        it('should correctly initialize the AutoNumeric element', () => {
            // ...or init and set the value in one call :
            expect(() => new AutoNumeric(newInput, 12345.789)).not.toThrow(); // With the default options, and an initial value
        });

        it('should correctly initialize the AutoNumeric element', () => {
            expect(() => new AutoNumeric(newInput, 12345.789, options)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element', () => {
            expect(() => new AutoNumeric(newInput, '12345.789', options)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element', () => {
            expect(() => new AutoNumeric(newInput, 12345.789).french(options)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element', () => {
            expect(() => new AutoNumeric(newInput, 12345.789, options).french(options)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element', () => {
            // The AutoNumeric constructor class can also accept a string as a css selector. Under the hood this use `QuerySelector` and limit itself to only the first element it finds.
            expect(() => new AutoNumeric('input')).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element', () => {
            expect(() => new AutoNumeric('input', options)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element', () => {
            expect(() => new AutoNumeric('input', 12345.789)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element', () => {
            expect(() => new AutoNumeric('input', 12345.789, options)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element', () => {
            const an = new AutoNumeric('input', 12300.789); //FIXME Move those tests in another test suite
            expect(AutoNumeric.test(an.node())).toEqual(true);
            expect(an.getFormatted()).toEqual('12,300.79');
            an.french();
            expect(an.getFormatted()).toEqual('12.300,79 €');
            an.french({ currencySymbol : '#' });
            expect(an.getFormatted()).toEqual('12.300,79#');
            // expect(() => new AutoNumeric('input', 12300.789).french(options)).not.toThrow(); //FIXME uncomment
        });

        it('should correctly initialize the AutoNumeric element', () => {
            expect(() => new AutoNumeric('input', 12345.789, options).french(options)).not.toThrow();
        });

        it('should not correctly initialize the AutoNumeric element and throw', () => {
            expect(() => new AutoNumeric(0)).toThrow();
            expect(() => new AutoNumeric(null)).toThrow();
            expect(() => new AutoNumeric(undefined)).toThrow();
            expect(() => new AutoNumeric([])).toThrow();
            expect(() => new AutoNumeric({})).toThrow();
            expect(() => new AutoNumeric('42')).toThrow();
            expect(() => new AutoNumeric('foobar')).toThrow();

            expect(() => new AutoNumeric('input', 'foobar')).toThrow();
            expect(() => new AutoNumeric('input', 1235, 'foobar')).toThrow();
            expect(() => new AutoNumeric('input', [])).toThrow();
        });
    });
});

describe(`autoNumeric 'init' method should init with predefined options`, () => {
    let aNInput;
    let newInput;

    it('with French', () => {
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
        aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().French); // Initiate the autoNumeric input

        aNInput.set('1234567.89');
        expect(aNInput.get()).toEqual('1234567.89');
        expect(aNInput.getNumericString()).toEqual('1234567.89');
        expect(aNInput.getNumber()).toEqual(1234567.89);
        expect(aNInput.getFormatted()).toEqual('1.234.567,89\u202f€');

        aNInput.remove();
        document.body.removeChild(newInput);
    });

    it('with North American', () => {
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
        aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().NorthAmerican); // Initiate the autoNumeric input

        aNInput.set('1234567.89');
        expect(aNInput.get()).toEqual('1234567.89');
        expect(aNInput.getNumericString()).toEqual('1234567.89');
        expect(aNInput.getNumber()).toEqual(1234567.89);
        expect(aNInput.getFormatted()).toEqual('$1,234,567.89');

        aNInput.remove();
        document.body.removeChild(newInput);
    });

    it('with Japanese', () => {
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
        aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().Japanese); // Initiate the autoNumeric input

        aNInput.set('1234567.89');
        expect(aNInput.get()).toEqual('1234567.89');
        expect(aNInput.getNumericString()).toEqual('1234567.89');
        expect(aNInput.getNumber()).toEqual(1234567.89);
        expect(aNInput.getFormatted()).toEqual('¥1,234,567.89');

        aNInput.remove();
        document.body.removeChild(newInput);
    });
});

describe(`autoNumeric initialization calls`, () => {
    let aNInput;
    let newInput;

    beforeEach(() => { // Initialization
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
    });

    afterEach(() => { // Un-initialization
        aNInput.remove();
        document.body.removeChild(newInput);
    });

    it('should init the element with the correct settings (Euro)', () => {
        newInput.value = '6789,02';
        aNInput = new AutoNumeric(newInput, autoNumericOptionsEuro);
        expect(aNInput.getNumericString()).toEqual('6789.02');
        expect(aNInput.getFormatted()).toEqual('6.789,02 €');

        aNInput.update(autoNumericOptionsEuro);
        expect(aNInput.getFormatted()).toEqual('6.789,02 €');
    });

    it('should init the element with the correct settings (Dollar)', () => {
        newInput.value = '6789.02';
        aNInput = new AutoNumeric(newInput, autoNumericOptionsDollar);
        expect(aNInput.getNumericString()).toEqual('6789.02');
        expect(aNInput.getFormatted()).toEqual('$6,789.02');

        aNInput.update(autoNumericOptionsDollar);
        expect(aNInput.getFormatted()).toEqual('$6,789.02');
    });

    it('should init the element with the correct settings (no methods, Euro)', () => {
        newInput.value = '256789,02';
        aNInput = new AutoNumeric(newInput, autoNumericOptionsEuro);
        expect(aNInput.getNumericString()).toEqual('256789.02');
        expect(aNInput.getFormatted()).toEqual('256.789,02 €');

        aNInput.update(autoNumericOptionsEuro);
        expect(aNInput.getFormatted()).toEqual('256.789,02 €');
    });

    it('should init the element with the correct settings (no methods, Dollar)', () => {
        newInput.value = '256789.02';
        aNInput = new AutoNumeric(newInput, autoNumericOptionsDollar);
        expect(aNInput.getNumericString()).toEqual('256789.02');
        expect(aNInput.getFormatted()).toEqual('$256,789.02');

        aNInput.update(autoNumericOptionsDollar);
        expect(aNInput.getFormatted()).toEqual('$256,789.02');
    });

    it('should init and update the element with the correct predefined settings', () => {
        newInput.value = '1256789.02';
        aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().dotDecimalCharCommaSeparator);
        expect(aNInput.getNumericString()).toEqual('1256789.02');
        expect(aNInput.getFormatted()).toEqual('1,256,789.02');

        aNInput.update(AutoNumeric.getPredefinedOptions().commaDecimalCharDotSeparator);
        expect(aNInput.getFormatted()).toEqual('1.256.789,02');

        aNInput.update(AutoNumeric.getPredefinedOptions().euro);
        expect(aNInput.getFormatted()).toEqual('1.256.789,02\u202f€');

        aNInput.update(AutoNumeric.getPredefinedOptions().euroSpace);
        expect(aNInput.getFormatted()).toEqual('1 256 789,02\u202f€');

        aNInput.update(AutoNumeric.getPredefinedOptions().dollar);
        expect(aNInput.getFormatted()).toEqual('$1,256,789.02');

        aNInput.update(AutoNumeric.getPredefinedOptions().percentageEU2dec);
        aNInput.set(0.012345);
        expect(aNInput.getNumericString()).toEqual('0.01');
        aNInput.set(2.3413);
        expect(aNInput.getNumericString()).toEqual('2.34');
        expect(aNInput.getFormatted()).toEqual('2,34%');

        aNInput.update(AutoNumeric.getPredefinedOptions().percentageUS2dec);
        expect(aNInput.getFormatted()).toEqual('2.34%');

        aNInput.update(AutoNumeric.getPredefinedOptions().percentageEU3dec);
        expect(aNInput.getFormatted()).toEqual('2,340%');
        aNInput.set(2.3413);
        expect(aNInput.getFormatted()).toEqual('2,341%');

        aNInput.update(AutoNumeric.getPredefinedOptions().percentageUS3dec);
        expect(aNInput.getFormatted()).toEqual('2.341%');
    });

    it('should init and update the element with the correct predefined settings, limiting to a positive value', () => {
        newInput.value = '1256789.02';
        aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().euroPos);
        expect(aNInput.getNumericString()).toEqual('1256789.02');
        expect(aNInput.getFormatted()).toEqual('1.256.789,02\u202f€');
        expect(() => aNInput.set(999999.99)).not.toThrow();
        expect(() => aNInput.set(-1)).toThrow();
        expect(aNInput.getFormatted()).toEqual('999.999,99\u202f€');
    });

    it('should fail to init when the default value is outside of the min and max limits', () => {
        newInput.value = '-1256789.02';
        expect(() => new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().euroPos)).toThrow();
    });

    it('should init and update the element with the correct predefined settings, limiting to a negative value', () => {
        newInput.value = '-1256789.02';
        aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().euroNeg);
        expect(aNInput.getNumericString()).toEqual('-1256789.02');
        expect(aNInput.getFormatted()).toEqual('-1.256.789,02\u202f€');
        expect(() => aNInput.set(1)).toThrow();
        expect(() => aNInput.set(-999999.99)).not.toThrow();
        expect(aNInput.getFormatted()).toEqual('-999.999,99\u202f€');
    });

    it('should init and update the element with the correct predefined settings, limiting to a positive value', () => {
        newInput.value = '6.246';
        aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().percentageEU2decPos);
        expect(aNInput.getNumericString()).toEqual('6.25');
        expect(aNInput.getFormatted()).toEqual('6,25%');
        expect(() => aNInput.set(-0.001)).toThrow();
        expect(() => aNInput.set(0.712)).not.toThrow();
        expect(aNInput.getFormatted()).toEqual('0,71%');
    });

    it('should init and update the element with the correct predefined settings, limiting to a negative value', () => {
        newInput.value = '-6.246';
        aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().percentageEU2decNeg);
        expect(aNInput.getNumericString()).toEqual('-6.25');
        expect(aNInput.getFormatted()).toEqual('-6,25%');
        expect(() => aNInput.set(0.001)).toThrow();
        expect(() => aNInput.set(-0.712)).not.toThrow();
        expect(aNInput.getFormatted()).toEqual('-0,71%');
    });

    it('should init and update the element with the correct predefined settings, using integers only', () => {
        newInput.value = '-6.246';
        aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().integer);
        expect(aNInput.getNumericString()).toEqual('-6');
        expect(aNInput.getFormatted()).toEqual('-6');
        expect(() => aNInput.set(15.001)).not.toThrow();
        expect(aNInput.getFormatted()).toEqual('15');
        expect(() => aNInput.set(-0.712)).not.toThrow();
        expect(aNInput.getFormatted()).toEqual('-1');
        aNInput.set(13256.678);
        expect(aNInput.getFormatted()).toEqual('13,257');
    });

    it('should init and update the element with the correct predefined settings, using positive integers only', () => {
        newInput.value = '6.246';
        aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().integerPos);
        expect(aNInput.getNumericString()).toEqual('6');
        expect(aNInput.getFormatted()).toEqual('6');
        expect(() => aNInput.set(15.001)).not.toThrow();
        expect(aNInput.getFormatted()).toEqual('15');
        expect(() => aNInput.set(-0.712)).toThrow();
        expect(aNInput.getFormatted()).toEqual('15');
        aNInput.set(13256.678);
        expect(aNInput.getFormatted()).toEqual('13,257');
    });

    it('should init and update the element with the correct predefined settings, using negative integers only', () => {
        newInput.value = '-6.246';
        aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().integerNeg);
        expect(aNInput.getNumericString()).toEqual('-6');
        expect(aNInput.getFormatted()).toEqual('-6');
        expect(() => aNInput.set(15.001)).toThrow();
        expect(aNInput.getFormatted()).toEqual('-6');
        expect(() => aNInput.set(-0.712)).not.toThrow();
        expect(aNInput.getFormatted()).toEqual('-1');
        aNInput.set(-13256.678);
        expect(aNInput.getFormatted()).toEqual('-13,257');
    });

    it('should init and update the element with the correct predefined settings, using floats only', () => {
        spyOn(console, 'warn');
        newInput.value = '-6.246';
        aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().float);
        expect(aNInput.getNumericString()).toEqual('-6.25');
        expect(aNInput.getFormatted()).toEqual('-6.25');
        expect(() => aNInput.set(15.021)).not.toThrow();
        expect(aNInput.getFormatted()).toEqual('15.02');
        expect(() => aNInput.set(-0.712)).not.toThrow();
        expect(aNInput.getFormatted()).toEqual('-0.71');
        aNInput.set(13256.678);
        expect(aNInput.getFormatted()).toEqual('13,256.68');

        aNInput.set(15.001);
        expect(aNInput.getFormatted()).toEqual('15');
        aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.padding);
        expect(aNInput.getFormatted()).toEqual('15.00');
    });

    it('should init and update the element with the correct predefined settings, using positive floats only', () => {
        spyOn(console, 'warn');
        newInput.value = '6.246';
        aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().floatPos);
        expect(aNInput.getNumericString()).toEqual('6.25');
        expect(aNInput.getFormatted()).toEqual('6.25');
        expect(() => aNInput.set(15.021)).not.toThrow();
        expect(aNInput.getFormatted()).toEqual('15.02');
        expect(() => aNInput.set(-0.712)).toThrow();
        expect(aNInput.getFormatted()).toEqual('15.02');
        aNInput.set(13256.678);
        expect(aNInput.getFormatted()).toEqual('13,256.68');
    });

    it('should init and update the element with the correct predefined settings, using negative floats only', () => {
        spyOn(console, 'warn');
        newInput.value = '-6.246';
        aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().floatNeg);
        expect(aNInput.getNumericString()).toEqual('-6.25');
        expect(aNInput.getFormatted()).toEqual('-6.25');
        expect(() => aNInput.set(15.021)).toThrow();
        expect(aNInput.getFormatted()).toEqual('-6.25');
        expect(() => aNInput.set(-0.712)).not.toThrow();
        expect(aNInput.getFormatted()).toEqual('-0.71');
        aNInput.set(-13256.678);
        expect(aNInput.getFormatted()).toEqual('-13,256.68');
    });

    it('should init and update the element with the correct predefined settings, formatting numeric strings', () => {
        newInput.value = '-72376.246';
        aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().numeric);
        expect(aNInput.getNumericString()).toEqual('-72376.25');
        expect(aNInput.getFormatted()).toEqual('-72376.25');
        expect(() => aNInput.set(15.001)).not.toThrow();
        expect(aNInput.getFormatted()).toEqual('15.00');
        expect(() => aNInput.set(-0.712)).not.toThrow();
        expect(aNInput.getFormatted()).toEqual('-0.71');
        aNInput.set(13256.678);
        expect(aNInput.getFormatted()).toEqual('13256.68');
    });

    it('should init and update the element with the correct predefined settings, formatting positive numeric strings', () => {
        newInput.value = '72376.246';
        aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().numericPos);
        expect(aNInput.getNumericString()).toEqual('72376.25');
        expect(aNInput.getFormatted()).toEqual('72376.25');
        expect(() => aNInput.set(15.001)).not.toThrow();
        expect(aNInput.getFormatted()).toEqual('15.00');
        expect(() => aNInput.set(-0.712)).toThrow();
        expect(aNInput.getFormatted()).toEqual('15.00');
        aNInput.set(13256.678);
        expect(aNInput.getFormatted()).toEqual('13256.68');
    });

    it('should init and update the element with the correct predefined settings, formatting negative numeric strings', () => {
        newInput.value = '-72376.246';
        aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().numericNeg);
        expect(aNInput.getNumericString()).toEqual('-72376.25');
        expect(aNInput.getFormatted()).toEqual('-72376.25');
        expect(() => aNInput.set(15.001)).toThrow();
        expect(aNInput.getFormatted()).toEqual('-72376.25');
        expect(() => aNInput.set(-0.712)).not.toThrow();
        expect(aNInput.getFormatted()).toEqual('-0.71');
        aNInput.set(-13256.678);
        expect(aNInput.getFormatted()).toEqual('-13256.68');
    });

    // Test the showPositiveSign option
    // +1.234,00
    const noneLeft = {
        digitGroupSeparator        : '.',
        decimalCharacter           : ',',
        decimalCharacterAlternative: '.',
        showPositiveSign           : true,
    };

    // 1.234,00+
    const noneSuffix = {
        digitGroupSeparator          : '.',
        decimalCharacter             : ',',
        decimalCharacterAlternative  : '.',
        negativePositiveSignPlacement: 's',
        showPositiveSign             : true,
    };

    // € +1.234,00
    const leftRight = {
        digitGroupSeparator          : '.',
        decimalCharacter             : ',',
        decimalCharacterAlternative  : '.',
        currencySymbol               : '€\u00a0',
        roundingMethod               : 'U',
        negativePositiveSignPlacement: 'r',
        showPositiveSign             : true,
    };

    // +€ 1.234,00
    const leftLeft = {
        digitGroupSeparator          : '.',
        decimalCharacter             : ',',
        decimalCharacterAlternative  : '.',
        currencySymbol               : '€\u00a0',
        roundingMethod               : 'U',
        negativePositiveSignPlacement: 'l',
        showPositiveSign             : true,
    };

    // € 1.234,00+
    const leftSuffix = {
        digitGroupSeparator          : '.',
        decimalCharacter             : ',',
        decimalCharacterAlternative  : '.',
        currencySymbol               : '€\u00a0',
        roundingMethod               : 'U',
        negativePositiveSignPlacement: 's',
        showPositiveSign             : true,
    };

    // 1.234,00+ €
    const rightLeft = {
        digitGroupSeparator          : '.',
        decimalCharacter             : ',',
        decimalCharacterAlternative  : '.',
        currencySymbol               : '\u00a0€',
        currencySymbolPlacement      : 's',
        roundingMethod               : 'U',
        negativePositiveSignPlacement: 'l',
        showPositiveSign             : true,
    };

    // 1.234,00 €+
    const rightRight = {
        digitGroupSeparator          : '.',
        decimalCharacter             : ',',
        decimalCharacterAlternative  : '.',
        currencySymbol               : '\u00a0€',
        currencySymbolPlacement      : 's',
        roundingMethod               : 'U',
        negativePositiveSignPlacement: 'r',
        showPositiveSign             : true,
    };

    // +1.234,00 €
    const rightPrefix = {
        digitGroupSeparator          : '.',
        decimalCharacter             : ',',
        decimalCharacterAlternative  : '.',
        currencySymbol               : '\u00a0€',
        currencySymbolPlacement      : 's',
        roundingMethod               : 'U',
        negativePositiveSignPlacement: 'p',
        showPositiveSign             : true,
    };

    it('should format with showPositiveSign, no currency sign, default placement', () => {
        newInput.value = '1234567.89';
        aNInput = new AutoNumeric(newInput, noneLeft);
        expect(aNInput.getNumericString()).toEqual('1234567.89');
        expect(aNInput.getFormatted()).toEqual('+1.234.567,89');
    });

    it('should format with showPositiveSign, no currency sign, suffix placement', () => {
        newInput.value = '1234567.89';
        aNInput = new AutoNumeric(newInput, noneSuffix);
        expect(aNInput.getNumericString()).toEqual('1234567.89');
        expect(aNInput.getFormatted()).toEqual('1.234.567,89+');
    });

    it('should format with showPositiveSign, left currency sign, right placement', () => {
        newInput.value = '1234567.89';
        aNInput = new AutoNumeric(newInput, leftRight);
        expect(aNInput.getNumericString()).toEqual('1234567.89');
        expect(aNInput.getFormatted()).toEqual('€\u00a0+1.234.567,89');
    });

    it('should format with showPositiveSign, left currency sign, left placement', () => {
        newInput.value = '1234567.89';
        aNInput = new AutoNumeric(newInput, leftLeft);
        expect(aNInput.getNumericString()).toEqual('1234567.89');
        expect(aNInput.getFormatted()).toEqual('+€\u00a01.234.567,89');
    });

    it('should format with showPositiveSign, left currency sign, suffix placement', () => {
        newInput.value = '1234567.89';
        aNInput = new AutoNumeric(newInput, leftSuffix);
        expect(aNInput.getNumericString()).toEqual('1234567.89');
        expect(aNInput.getFormatted()).toEqual('€\u00a01.234.567,89+');
    });

    it('should format with showPositiveSign, right currency sign, left placement', () => {
        newInput.value = '1234567.89';
        aNInput = new AutoNumeric(newInput, rightLeft);
        expect(aNInput.getNumericString()).toEqual('1234567.89');
        expect(aNInput.getFormatted()).toEqual('1.234.567,89+\u00a0€');
    });

    it('should format with showPositiveSign, right currency sign, right placement', () => {
        newInput.value = '1234567.89';
        aNInput = new AutoNumeric(newInput, rightRight);
        expect(aNInput.getNumericString()).toEqual('1234567.89');
        expect(aNInput.getFormatted()).toEqual('1.234.567,89\u00a0€+');
    });

    it('should format with showPositiveSign, right currency sign, prefix placement', () => {
        newInput.value = '1234567.89';
        aNInput = new AutoNumeric(newInput, rightPrefix);
        expect(aNInput.getNumericString()).toEqual('1234567.89');
        expect(aNInput.getFormatted()).toEqual('+1.234.567,89\u00a0€');
    });
});

describe(`autoNumeric 'getNumericString', 'getLocalized' and 'getNumber' methods`, () => {
    let aNInput;
    let newInput;

    beforeEach(() => { // Initialization
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
        aNInput = new AutoNumeric(newInput); // Initiate the autoNumeric input
    });

    afterEach(() => { // Un-initialization
        aNInput.remove();
        document.body.removeChild(newInput);
    });


    it('should return an unformatted value, (without having any option specified)', () => {
        // With an integer
        aNInput.set(0);
        expect(aNInput.get()).toEqual('0');
        expect(aNInput.getNumericString()).toEqual('0');
        expect(aNInput.getLocalized()).toEqual('0');
        expect(aNInput.getNumber()).toEqual(0);

        aNInput.set(-42);
        expect(aNInput.get()).toEqual('-42');
        expect(aNInput.getNumericString()).toEqual('-42');
        aNInput.update({ outputFormat: ',-' });
        expect(aNInput.getNumericString()).toEqual('-42');
        expect(aNInput.getLocalized()).toEqual('42-');
        expect(aNInput.getNumber()).toEqual(-42);
        aNInput.update({ outputFormat: '-,' });
        expect(aNInput.getLocalized()).toEqual('-42');
        expect(aNInput.getNumber()).toEqual(-42);
        aNInput.update({ outputFormat: '.-' });
        expect(aNInput.getLocalized()).toEqual('42-');
        expect(aNInput.getNumber()).toEqual(-42);
        aNInput.update({ outputFormat: null });
        expect(aNInput.getLocalized()).toEqual('-42');
        expect(aNInput.getNumber()).toEqual(-42);
        aNInput.update({ outputFormat: 'number' });
        expect(aNInput.getLocalized()).toEqual(-42);
        expect(aNInput.getNumber()).toEqual(-42);
        aNInput.update({ outputFormat: 'string' });
        expect(aNInput.getLocalized()).toEqual('-42');
        expect(aNInput.getNumber()).toEqual(-42);

        // With a float
        aNInput.set(-42.76);
        expect(aNInput.getNumericString()).toEqual('-42.76');
        aNInput.update({ outputFormat: ',-' });
        expect(aNInput.getNumericString()).toEqual('-42.76');
        expect(aNInput.getLocalized()).toEqual('42,76-');
        expect(aNInput.getNumber()).toEqual(-42.76);

        aNInput.update({ outputFormat: '-,' });
        expect(aNInput.getLocalized()).toEqual('-42,76');
        expect(aNInput.getNumber()).toEqual(-42.76);
        aNInput.update({ outputFormat: '.-' });
        expect(aNInput.getLocalized()).toEqual('42.76-');
        expect(aNInput.getNumber()).toEqual(-42.76);
        aNInput.update({ outputFormat: null });
        expect(aNInput.getLocalized()).toEqual('-42.76');
        expect(aNInput.getNumber()).toEqual(-42.76);
        aNInput.update({ outputFormat: 'number' });
        expect(aNInput.getLocalized()).toEqual(-42.76);
        expect(aNInput.getNumber()).toEqual(-42.76);
        aNInput.update({ outputFormat: 'string' });
        expect(aNInput.getLocalized()).toEqual('-42.76');
        expect(aNInput.getNumber()).toEqual(-42.76);
    });

    it('should return an unformatted value (with some options set)', () => {
        // Euros
        aNInput.update(autoNumericOptionsEuro);
        aNInput.update({ outputFormat: ',-' });
        aNInput.set(0);
        expect(aNInput.getFormatted()).toEqual('0,00 €');
        expect(aNInput.getNumericString()).toEqual('0');
        expect(aNInput.getLocalized()).toEqual('0');
        expect(aNInput.getNumber()).toEqual(0);
        aNInput.update({ leadingZero: 'keep' });
        expect(aNInput.getLocalized()).toEqual('0');
        expect(aNInput.getNumber()).toEqual(0);

        aNInput.set(-42);
        expect(aNInput.getFormatted()).toEqual('42,00- €');
        expect(aNInput.getNumericString()).toEqual('-42');
        expect(aNInput.getLocalized()).toEqual('42-');
        expect(aNInput.getNumber()).toEqual(-42);
        aNInput.update({ outputFormat: '-,' });
        expect(aNInput.getLocalized()).toEqual('-42');
        expect(aNInput.getNumber()).toEqual(-42);
        aNInput.update({ outputFormat: '.-' });
        expect(aNInput.getLocalized()).toEqual('42-');
        expect(aNInput.getNumber()).toEqual(-42);
        aNInput.update({ outputFormat: null });
        expect(aNInput.getLocalized()).toEqual('-42');
        expect(aNInput.getNumber()).toEqual(-42);
        aNInput.update({ outputFormat: 'number' });
        expect(aNInput.getLocalized()).toEqual(-42);
        expect(aNInput.getNumber()).toEqual(-42);
        aNInput.update({ outputFormat: 'string' });
        expect(aNInput.getLocalized()).toEqual('-42');
        expect(aNInput.getNumber()).toEqual(-42);

        aNInput.set(1234.56); // Here I also test that setting a positive value after a negative one works ok
        expect(aNInput.getNumericString()).toEqual('1234.56');
        expect(aNInput.getNumber()).toEqual(1234.56);
        aNInput.set(6789012.345);
        expect(aNInput.getNumericString()).toEqual('6789012.35'); // Rounding happens here
        expect(aNInput.getNumber()).toEqual(6789012.35);

        // Dollars
        aNInput.update(autoNumericOptionsDollar);
        expect(aNInput.getNumericString()).toEqual('6789012.35'); // First check if updating the options changed the results accordingly
        expect(aNInput.getNumber()).toEqual(6789012.35);
        aNInput.set(1234.56);
        expect(aNInput.getNumericString()).toEqual('1234.56');
        expect(aNInput.getNumber()).toEqual(1234.56);
        aNInput.set(6789012.345);
        expect(aNInput.getNumericString()).toEqual('6789012.35');
        expect(aNInput.getNumber()).toEqual(6789012.35);
        aNInput.set(0);
        expect(aNInput.getNumericString()).toEqual('0');
        expect(aNInput.getNumber()).toEqual(0);
        aNInput.set(-42);
        expect(aNInput.getNumericString()).toEqual('-42');
        expect(aNInput.getNumber()).toEqual(-42);
    });

    it('should return an unformatted value even if the number is bigger than Number.MAX_SAFE_INTEGER', () => {
        if (Number.MAX_SAFE_INTEGER === void(0)) { // Special polyfill case for PhantomJS
            // console.log(`Setting the Number.MAX_SAFE_INTEGER polyfill...`); //DEBUG
            //noinspection JSPrimitiveTypeWrapperUsage
            Number.MAX_SAFE_INTEGER = 9007199254740991;
        }

        aNInput.update({ maximumValue: '9007199254740991000000' });
        aNInput.set(Number.MAX_SAFE_INTEGER); // The exact highest safe integer
        expect(aNInput.getNumericString()).toEqual(`${Number.MAX_SAFE_INTEGER}`);
        aNInput.set('9007199254740996'); // A bit higher than the biggest safest integer
        expect(aNInput.getNumericString()).toEqual('9007199254740996');
        // Add a test where the user set a very big number (bigger than Number.MAX_SAFE_INTEGER), and check if `get` return the correct number
        aNInput.set('9007199254740991000000'); // A very big number
        expect(aNInput.getNumericString()).toEqual('9007199254740991000000');
    });
});

describe(`autoNumeric 'getNumericString' methods`, () => {
    it(`should return an empty string as the default value`, () => {
        const newInput = document.createElement('input');
        document.body.appendChild(newInput);
        const aNInput = new AutoNumeric(newInput); // Initiate the autoNumeric input

        expect(aNInput.getNumericString()).toEqual('');
    });

    it(`should return '0' as the default value`, () => {
        const newInput = document.createElement('input');
        document.body.appendChild(newInput);
        const aNInput = new AutoNumeric(newInput, { emptyInputBehavior : 'zero' }); // Initiate the autoNumeric input

        expect(aNInput.getNumericString()).toEqual('0');
    });

    it(`should not return a negative value when inputting a positive one and minimumValue is equal to '0' (cf. issue #284)`, () => {
        const newInput = document.createElement('input');
        document.body.appendChild(newInput);
        spyOn(console, 'warn');
        const aNInput = new AutoNumeric(newInput, { minimumValue: '0', maximumValue: '9999', decimalPlacesOverride: '2' }); // Initiate the autoNumeric input
        expect(console.warn).toHaveBeenCalled();

        expect(aNInput.getNumericString()).toEqual('');
        aNInput.set(1234);
        expect(aNInput.getNumericString()).toEqual('1234');
        aNInput.set(0);
        expect(aNInput.getNumericString()).toEqual('0');
        aNInput.set(-0);
        expect(aNInput.getNumericString()).toEqual('0');

        aNInput.remove();
        document.body.removeChild(newInput);
    });

    it(`should not return a negative value when inputting a positive one and minimumValue is superior to '0' (cf. issue #284)`, () => {
        const newInput = document.createElement('input');
        document.body.appendChild(newInput);
        spyOn(console, 'warn');
        const aNInput = new AutoNumeric(newInput, { minimumValue: '1', maximumValue: '9999', decimalPlacesOverride: '2' }); // Initiate the autoNumeric input
        expect(console.warn).toHaveBeenCalled();

        expect(aNInput.getNumericString()).toEqual('');
        aNInput.set(1234);
        expect(aNInput.getNumericString()).toEqual('1234');

        aNInput.remove();
        document.body.removeChild(newInput);
    });
});

describe(`autoNumeric 'set' method`, () => {
    let aNInput;
    let newInput;

    beforeEach(() => { // Initialization
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
        aNInput = new AutoNumeric(newInput); // Initiate the autoNumeric input
    });

    afterEach(() => { // Un-initialization
        aNInput.remove();
        document.body.removeChild(newInput);
    });

    it('should set a raw value and result in a formatted value', () => {
        // Euros
        aNInput.update(autoNumericOptionsEuro);
        aNInput.set(1234.56);
        expect(aNInput.getFormatted()).toEqual('1.234,56 €');
        aNInput.set(6789012.345);
        expect(aNInput.getFormatted()).toEqual('6.789.012,35 €'); // Rounding happens here

        aNInput.set('1234.56');
        expect(aNInput.getFormatted()).toEqual('1.234,56 €');
        aNInput.set('6789012.345');
        expect(aNInput.getFormatted()).toEqual('6.789.012,35 €'); // Rounding happens here

        // Dollars
        aNInput.update(autoNumericOptionsDollar);
        expect(aNInput.getFormatted()).toEqual('$6,789,012.35'); // First check if updating the options changed the results accordingly
        aNInput.set(1234.56);
        expect(aNInput.getFormatted()).toEqual('$1,234.56');
        aNInput.set(6789012.345);
        expect(aNInput.getFormatted()).toEqual('$6,789,012.35');

        aNInput.set('1234.56');
        expect(aNInput.getFormatted()).toEqual('$1,234.56');
        aNInput.set('6789012.345');
        expect(aNInput.getFormatted()).toEqual('$6,789,012.35');
    });

    it('should respect the minimumValue and maximumValue settings', () => {
        aNInput.update({ minimumValue: '999999.99', maximumValue: '1111111111111.11' });
        expect(() => aNInput.set(999999.99)).not.toThrow();
        expect(() => aNInput.set(1111111111111.11)).not.toThrow();

        expect(() => aNInput.set(999999.984)).toThrow(); // Min, with rounding up
        expect(() => aNInput.set(999999.989)).toThrow(); // Min, even without rounding
        expect(() => aNInput.set(999999.991)).not.toThrow();
        expect(() => aNInput.set(1111111111111.109)).not.toThrow();
        expect(() => aNInput.set(1111111111111.111)).toThrow(); // Max
    });

    it('should respect the minimumValue and maximumValue settings', () => {
        aNInput.update({ minimumValue: '999999.99', maximumValue: '1111111111111.11' });
        expect(() => aNInput.set(999999.99)).not.toThrow();
        expect(() => aNInput.set(1111111111111.11)).not.toThrow();

        expect(() => aNInput.set(999999.984)).toThrow(); // Min, with rounding up
        expect(() => aNInput.set(999999.989)).toThrow(); // Min, even without rounding
        expect(() => aNInput.set(999999.991)).not.toThrow();
        expect(() => aNInput.set(1111111111111.109)).not.toThrow();
        expect(() => aNInput.set(1111111111111.111)).toThrow(); // Max
    });

    it('should respect the minimumValue and maximumValue settings', () => {
        aNInput.update({ minimumValue: '999999.99', maximumValue: '1111111111111.11' });
        expect(() => aNInput.set(999999.99)).not.toThrow();
        expect(() => aNInput.set(1111111111111.11)).not.toThrow();

        expect(() => aNInput.set(999999.984)).toThrow(); // Min, with rounding up
        expect(() => aNInput.set(999999.989)).toThrow(); // Min, even without rounding
        expect(() => aNInput.set(999999.991)).not.toThrow();
        expect(() => aNInput.set(1111111111111.109)).not.toThrow();
        expect(() => aNInput.set(1111111111111.111)).toThrow(); // Max
    });
});

describe('`set` and non-ascii numbers', () => {
    let aNInput;
    let newInput;

    beforeEach(() => { // Initialization
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
        aNInput = new AutoNumeric(newInput, { digitGroupSeparator : ',', decimalCharacter : '.' }); // Initiate the autoNumeric input
    });

    afterEach(() => { // Un-initialization
        aNInput.remove();
        document.body.removeChild(newInput);
    });

    it('should accepts Arabic numbers', () => {
        expect(aNInput.getNumericString()).toEqual('');
        aNInput.set('١٠٢٣٤٥٦٧.٨٩');
        expect(aNInput.getNumericString()).toEqual('10234567.89');
        expect(aNInput.getNumber()).toEqual(10234567.89);
        expect(aNInput.getFormatted()).toEqual('10,234,567.89');
    });

    it('should accepts Persian numbers', () => {
        expect(aNInput.getNumericString()).toEqual('');
        aNInput.set('۱٠۲۳۴۵۶۷.۸۹');
        expect(aNInput.getNumericString()).toEqual('10234567.89');
        expect(aNInput.getNumber()).toEqual(10234567.89);
        expect(aNInput.getFormatted()).toEqual('10,234,567.89');
    });
});

//FIXME Test the `setUnformatted` method

describe('autoNumeric `selectDecimal` methods', () => {
    let aNInput;
    let newInput;

    beforeEach(() => { // Initialization
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
        aNInput = new AutoNumeric(newInput).french(); // Initiate the autoNumeric input
    });

    afterEach(() => { // Un-initialization
        aNInput.remove();
        document.body.removeChild(newInput);
    });

    it('should select only the decimal part', () => {
        expect(aNInput.getNumericString()).toEqual('');
        aNInput.set(2172834.234);
        expect(aNInput.getNumericString()).toEqual('2172834.23');
        expect(aNInput.getNumber()).toEqual(2172834.23);
        expect(aNInput.getFormatted()).toEqual('2.172.834,23\u202f€');

        aNInput.select();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(12);

        aNInput.options.selectNumberOnly(AutoNumeric.options.selectNumberOnly.selectAll);
        aNInput.select();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(14);

        aNInput.selectDecimal();
        expect(aNInput.node().selectionStart).toEqual(10);
        expect(aNInput.node().selectionEnd).toEqual(12);

        // Bigger number of decimals
        aNInput.set(12266.1234567, { minimumValue: '0', maximumValue: '9999999.9999999', decimalPlacesOverride: null });
        expect(aNInput.getFormatted()).toEqual('12.266,1234567\u202f€');
        aNInput.selectDecimal();
        expect(aNInput.node().selectionStart).toEqual(7);
        expect(aNInput.node().selectionEnd).toEqual(14);

        // No decimal part
        aNInput.set(12266, { minimumValue: '0', maximumValue: '9999999', decimalPlacesOverride: 0 });
        expect(aNInput.getFormatted()).toEqual('12.266\u202f€');
        aNInput.selectDecimal();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(0);

        // Decimal places shown on focus //FIXME Move this test to the end-to-end tests
        /*aNInput.set(12266.1234567, { minimumValue: '0', maximumValue: '9999999.9999999', decimalPlacesOverride: 3, decimalPlacesShownOnFocus: 6 });
        expect(aNInput.getFormatted()).toEqual('12.266,123\u202f€');
        aNInput.selectDecimal();
        expect(aNInput.node().selectionStart).toEqual(7);
        expect(aNInput.node().selectionEnd).toEqual(10);
        aNInput.node().select();
        aNInput.selectDecimal();
        expect(aNInput.node().selectionStart).toEqual(7);
        expect(aNInput.node().selectionEnd).toEqual(13);*/
    });
});

describe('autoNumeric `selectInteger` methods', () => {
    let aNInput;
    let newInput;

    beforeEach(() => { // Initialization
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
        aNInput = new AutoNumeric(newInput).french(); // Initiate the autoNumeric input
    });

    afterEach(() => { // Un-initialization
        aNInput.remove();
        document.body.removeChild(newInput);
    });

    it('should select only the decimal part', () => {
        expect(aNInput.getNumericString()).toEqual('');
        aNInput.set(2172834.234);
        expect(aNInput.getNumericString()).toEqual('2172834.23');
        expect(aNInput.getNumber()).toEqual(2172834.23);
        expect(aNInput.getFormatted()).toEqual('2.172.834,23\u202f€');

        aNInput.select();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(12);

        aNInput.options.selectNumberOnly(AutoNumeric.options.selectNumberOnly.selectAll);
        aNInput.select();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(14);

        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(9);

        // Changing the number of integer places
        aNInput.set(12266.1);
        expect(aNInput.getFormatted()).toEqual('12.266,10\u202f€');
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(6);
        aNInput.set(352.1);
        expect(aNInput.getFormatted()).toEqual('352,10\u202f€');
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(3);

        // A small integer part
        aNInput.set(0.234, { minimumValue: '0', maximumValue: '9999999.999', decimalPlacesOverride: null });
        expect(aNInput.getFormatted()).toEqual('0,234\u202f€');
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(1);

        // Decimal places shown on focus //FIXME Move this test to the end-to-end tests
        /*aNInput.set(12266.1234567, { minimumValue: '0', maximumValue: '9999999.9999999', decimalPlacesOverride: 3, decimalPlacesShownOnFocus: 6 });
         expect(aNInput.getFormatted()).toEqual('12.266,123\u202f€');
         aNInput.selectDecimal();
         expect(aNInput.node().selectionStart).toEqual(7);
         expect(aNInput.node().selectionEnd).toEqual(10);
         aNInput.node().select();
         aNInput.selectInteger();
         expect(aNInput.node().selectionStart).toEqual(7);
         expect(aNInput.node().selectionEnd).toEqual(13);*/

        // Common configuration
        aNInput.update({ suffixText: 'suffixText', minimumValue: '-9999999.99', maximumValue: '9999999.99', decimalPlacesOverride: null });

        // Test each possible combination

        // -1.234,57suffixText
        aNInput.set(1234.57, { negativePositiveSignPlacement: null, currencySymbol: '', showPositiveSign: false });
        expect(aNInput.getFormatted()).toEqual('1.234,57suffixText');
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(5);

        aNInput.update({ showPositiveSign: true, negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.prefix });
        expect(aNInput.getFormatted()).toEqual('+1.234,57suffixText');
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(1);
        expect(aNInput.node().selectionEnd).toEqual(6);

        expect(aNInput.set(-1234.57).getFormatted()).toEqual('-1.234,57suffixText');
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(6);

        // € +1.234,57suffixText
        aNInput.set(1234.57).update({ currencySymbol: '€ ', currencySymbolPlacement: AutoNumeric.options.currencySymbolPlacement.prefix, showPositiveSign: true, negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.right });
        expect(aNInput.getFormatted()).toEqual('€ +1.234,57suffixText');
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(3);
        expect(aNInput.node().selectionEnd).toEqual(8);

        aNInput.update({ showPositiveSign: false });
        expect(aNInput.getFormatted()).toEqual('€ 1.234,57suffixText');
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(2);
        expect(aNInput.node().selectionEnd).toEqual(7);

        expect(aNInput.set(-1234.57).getFormatted()).toEqual('€ -1.234,57suffixText');
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(2);
        expect(aNInput.node().selectionEnd).toEqual(8);

        // +€ 1.234,57suffixText
        aNInput.set(1234.57).update({ showPositiveSign: true, negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.left });
        expect(aNInput.getFormatted()).toEqual('+€ 1.234,57suffixText');
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(3);
        expect(aNInput.node().selectionEnd).toEqual(8);

        aNInput.update({ showPositiveSign: false });
        expect(aNInput.getFormatted()).toEqual('€ 1.234,57suffixText');
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(2);
        expect(aNInput.node().selectionEnd).toEqual(7);

        expect(aNInput.set(-1234.57).getFormatted()).toEqual('-€ 1.234,57suffixText'); // Selecting the integer part here is problematic, due to the currency sign
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(3);
        expect(aNInput.node().selectionEnd).toEqual(8);

        // 1.234,57+ €suffixText
        aNInput.set(1234.57).update({ showPositiveSign: true, negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.left, currencySymbolPlacement: AutoNumeric.options.currencySymbolPlacement.suffix, currencySymbol: ' €' });
        expect(aNInput.getFormatted()).toEqual('1.234,57+ €suffixText');
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(5);

        aNInput.update({ showPositiveSign: false });
        expect(aNInput.getFormatted()).toEqual('1.234,57 €suffixText');
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(5);

        expect(aNInput.set(-1234.57).getFormatted()).toEqual('1.234,57- €suffixText'); // Selecting the integer part here is problematic, due to the currency sign
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(5);

        // 1.234,57 €+suffixText
        aNInput.set(1234.57).update({ showPositiveSign: true, negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.right });
        expect(aNInput.getFormatted()).toEqual('1.234,57 €+suffixText');
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(5);

        aNInput.update({ showPositiveSign: false });
        expect(aNInput.getFormatted()).toEqual('1.234,57 €suffixText');
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(5);

        expect(aNInput.set(-1234.57).getFormatted()).toEqual('1.234,57 €-suffixText'); // Selecting the integer part here is problematic, due to the currency sign
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(5);

        // +1.234,57 €suffixText
        aNInput.set(1234.57).update({ showPositiveSign: true, negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.prefix });
        expect(aNInput.getFormatted()).toEqual('+1.234,57 €suffixText');
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(1);
        expect(aNInput.node().selectionEnd).toEqual(6);

        aNInput.update({ showPositiveSign: false });
        expect(aNInput.getFormatted()).toEqual('1.234,57 €suffixText');
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(5);

        expect(aNInput.set(-1234.57).getFormatted()).toEqual('-1.234,57 €suffixText'); // Selecting the integer part here is problematic, due to the currency sign
        aNInput.selectInteger();
        expect(aNInput.node().selectionStart).toEqual(0);
        expect(aNInput.node().selectionEnd).toEqual(6);
    });
});

describe('autoNumeric `reformat`, `unformat` and `unformatLocalized` methods', () => {
    let aNInput;
    let newInput;

    beforeEach(() => { // Initialization
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
        aNInput = new AutoNumeric(newInput).french(); // Initiate the autoNumeric input
    });

    afterEach(() => { // Un-initialization
        aNInput.remove();
        document.body.removeChild(newInput);
    });

    it('should `unformat` the element value, then `reformat` it correctly', () => {
        aNInput.set(1234567.89);
        expect(aNInput.getFormatted()).toEqual('1.234.567,89\u202f€');
        expect(aNInput.unformat().getFormatted()).toEqual('1234567.89');
        expect(aNInput.reformat().getFormatted()).toEqual('1.234.567,89\u202f€');
        /* eslint newline-per-chained-call: 0 */
        expect(aNInput.northAmerican().getFormatted()).toEqual('$1,234,567.89');
        expect(aNInput.unformat().getFormatted()).toEqual('1234567.89');
    });

    it('should `unformatLocalized` the element value, then `reformat` it correctly', () => {
        aNInput.set(-1234567.89, { outputFormat: AutoNumeric.options.outputFormat.commaNegative });
        expect(aNInput.getFormatted()).toEqual('-1.234.567,89\u202f€');
        expect(aNInput.unformatLocalized().getFormatted()).toEqual('1234567,89-');
        expect(aNInput.reformat().getFormatted()).toEqual('-1.234.567,89\u202f€');
        /* eslint newline-per-chained-call: 0 */
        expect(aNInput.northAmerican().getFormatted()).toEqual('$-1,234,567.89');
        expect(aNInput.unformatLocalized().getFormatted()).toEqual('1234567,89-');
        expect(aNInput.unformatLocalized(AutoNumeric.options.outputFormat.number).getFormatted()).toEqual('-1234567.89');
        expect(aNInput.unformatLocalized().getFormatted()).toEqual('1234567,89-');
        expect(aNInput.reformat().getFormatted()).toEqual('$-1,234,567.89');
    });
});

describe(`autoNumeric 'form*' methods`, () => {
    let form;
    let input1;
    let input2;
    let input3;
    let input4;
    let input5;
    let anInput1;
    let anInput2;
    let anInput3;

    beforeEach(() => { // Initialization
        form = document.createElement('form');
        input1 = document.createElement('input');
        input2 = document.createElement('input');
        input3 = document.createElement('input');
        input4 = document.createElement('input');
        input5 = document.createElement('input');

        document.body.appendChild(form);
        form.appendChild(input1);
        form.appendChild(input2);
        form.appendChild(input3);
        form.appendChild(input4);
        form.appendChild(input5);

        input1.name = 'aa';
        input2.name = 'bb';
        input3.name = 'cc';
        input4.name = 'ab';
        input5.name = 'bc';

        input1.value = '1111.11';
        expect(input1.value).toEqual('1111.11');
        input2.value = '-2222.22';
        input3.value = '3333.33';
        input4.value = 'not autoNumeric test';
        expect(input4.value).toEqual('not autoNumeric test');
        input5.value = 'not autoNumeric $1,234.567';
        expect(input5.value).toEqual('not autoNumeric $1,234.567');

        // Initiate only 3 autoNumeric inputs
        const anOptions = { digitGroupSeparator: '.', decimalCharacter: ',', currencySymbol: '€ ' };
        anInput1 = new AutoNumeric(input1, anOptions);
        anInput2 = new AutoNumeric(input2, anOptions);
        anInput3 = new AutoNumeric(input3, anOptions);

        expect(input1.value).toEqual('€ 1.111,11');
        expect(anInput1.getFormatted()).toEqual('€ 1.111,11');
        anInput1.update(anOptions);
        expect(anInput1.getFormatted()).toEqual('€ 1.111,11');
    });

    afterEach(() => { // Un-initialization
        anInput1.remove();
        anInput2.remove();
        anInput3.remove();
        form.removeChild(input1);
        form.removeChild(input2);
        form.removeChild(input3);
        form.removeChild(input4);
        form.removeChild(input5);
        document.body.removeChild(form);
    });

    it(`'formNumericString()' should return the correct string, with unformatted values`, () => {
        expect(anInput1.formNumericString()).toEqual('aa=1111.11&bb=-2222.22&cc=3333.33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567');
        anInput1.update({ serializeSpaces : '%20' });
        expect(anInput1.formNumericString()).toEqual('aa=1111.11&bb=-2222.22&cc=3333.33&ab=not%20autoNumeric%20test&bc=not%20autoNumeric%20%241%2C234.567');
    });

    it(`'formFormatted()' should return the correct string, with formatted values`, () => {
        expect(anInput1.formFormatted()).toEqual('aa=%E2%82%AC+1.111%2C11&bb=-%E2%82%AC+2.222%2C22&cc=%E2%82%AC+3.333%2C33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567');
        anInput1.update({ serializeSpaces : '%20' });
        expect(anInput1.formFormatted()).toEqual('aa=%E2%82%AC%201.111%2C11&bb=-%E2%82%AC%202.222%2C22&cc=%E2%82%AC%203.333%2C33&ab=not%20autoNumeric%20test&bc=not%20autoNumeric%20%241%2C234.567');
    });

    it(`'formLocalized()' should return the correct string, with formatted values`, () => {
        anInput1.update({ outputFormat : null });
        expect(anInput1.formLocalized()).toEqual('aa=1111.11&bb=-2222.22&cc=3333.33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567');
        anInput1.update({ outputFormat : 'string' });
        expect(anInput1.formLocalized()).toEqual('aa=1111.11&bb=-2222.22&cc=3333.33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567');
        anInput1.update({ outputFormat : 'number' });
        expect(anInput1.formLocalized()).toEqual('aa=1111.11&bb=-2222.22&cc=3333.33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567');
        expect(anInput1.formLocalized(',-')).toEqual('aa=1111%2C11&bb=2222%2C22-&cc=3333%2C33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567');
        expect(anInput1.formLocalized()).toEqual('aa=1111.11&bb=-2222.22&cc=3333.33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567');
        anInput1.update({ outputFormat : ',-' });
        expect(anInput1.formLocalized()).toEqual('aa=1111%2C11&bb=2222%2C22-&cc=3333%2C33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567');
        anInput1.update({ outputFormat : '.-' });
        expect(anInput1.formLocalized()).toEqual('aa=1111.11&bb=2222.22-&cc=3333.33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567');
        anInput1.update({ outputFormat : '-,' });
        expect(anInput1.formLocalized()).toEqual('aa=1111%2C11&bb=-2222%2C22&cc=3333%2C33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567');
        anInput1.update({ outputFormat : '-.' });
        expect(anInput1.formLocalized()).toEqual('aa=1111.11&bb=-2222.22&cc=3333.33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567');
    });

    it(`'formArrayNumericString()' should return the correct array`, () => {
        const arrayResult = [
            {
                name: 'aa',
                value: '1111.11' ,
            },
            {
                name : 'bb',
                value: '-2222.22',
            },
            {
                name : 'cc',
                value: '3333.33',
            },
            {
                name: 'ab',
                value: 'not autoNumeric test',
            },
            {
                name: 'bc',
                value: 'not autoNumeric $1,234.567',
            },
        ];
        expect(anInput1.formArrayNumericString()).toEqual(arrayResult);
    });

    it(`'formArrayFormatted()' should return the correct array`, () => {
        const arrayResult = [
            {
                name: 'aa',
                value: '€ 1.111,11',
            },
            {
                name : 'bb',
                value: '-€ 2.222,22',
            },
            {
                name : 'cc',
                value: '€ 3.333,33',
            },
            {
                name: 'ab',
                value: 'not autoNumeric test',
            },
            {
                name: 'bc',
                value: 'not autoNumeric $1,234.567',
            },
        ];
        expect(anInput1.formArrayFormatted()).toEqual(arrayResult);
    });

    it(`'formArrayLocalized()' should return the correct array`, () => {
        const arrayResult1 = [
            {
                name: 'aa',
                value: '1111.11' ,
            },
            {
                name : 'bb',
                value: '-2222.22',
            },
            {
                name : 'cc',
                value: '3333.33',
            },
            {
                name: 'ab',
                value: 'not autoNumeric test',
            },
            {
                name: 'bc',
                value: 'not autoNumeric $1,234.567',
            },
        ];
        expect(anInput1.formArrayLocalized()).toEqual(arrayResult1);
        const arrayResult2 = [
            {
                name: 'aa',
                value: '1111,11' ,
            },
            {
                name : 'bb',
                value: '2222,22-',
            },
            {
                name : 'cc',
                value: '3333,33',
            },
            {
                name: 'ab',
                value: 'not autoNumeric test',
            },
            {
                name: 'bc',
                value: 'not autoNumeric $1,234.567',
            },
        ];
        expect(anInput1.formArrayLocalized(',-')).toEqual(arrayResult2);
        anInput1.update({ outputFormat : ',-' });
        expect(anInput1.formArrayLocalized()).toEqual(arrayResult2);
    });

    it(`'formJsonNumericString()' should return the correct JSON object`, () => {
        const jsonResult = JSON.stringify([
            {
                name: 'aa',
                value: '1111.11' ,
            },
            {
                name : 'bb',
                value: '-2222.22',
            },
            {
                name : 'cc',
                value: '3333.33',
            },
            {
                name: 'ab',
                value: 'not autoNumeric test',
            },
            {
                name: 'bc',
                value: 'not autoNumeric $1,234.567',
            },
        ]);
        expect(anInput1.formJsonNumericString()).toEqual(jsonResult);
    });

    it(`'formJsonFormatted()' should return the correct JSON object`, () => {
        const jsonResult = JSON.stringify([
            {
                name: 'aa',
                value: '€ 1.111,11',
            },
            {
                name : 'bb',
                value: '-€ 2.222,22',
            },
            {
                name : 'cc',
                value: '€ 3.333,33',
            },
            {
                name: 'ab',
                value: 'not autoNumeric test',
            },
            {
                name: 'bc',
                value: 'not autoNumeric $1,234.567',
            },
        ]);
        expect(anInput1.formJsonFormatted()).toEqual(jsonResult);
    });

    it(`'formJsonLocalized()' should return the correct JSON object`, () => {
        const jsonResult1 = JSON.stringify([
            {
                name: 'aa',
                value: '1111.11' ,
            },
            {
                name : 'bb',
                value: '-2222.22',
            },
            {
                name : 'cc',
                value: '3333.33',
            },
            {
                name: 'ab',
                value: 'not autoNumeric test',
            },
            {
                name: 'bc',
                value: 'not autoNumeric $1,234.567',
            },
        ]);
        expect(anInput1.formJsonLocalized()).toEqual(jsonResult1);
        const jsonResult2 = JSON.stringify([
            {
                name: 'aa',
                value: '1111,11' ,
            },
            {
                name : 'bb',
                value: '2222,22-',
            },
            {
                name : 'cc',
                value: '3333,33',
            },
            {
                name: 'ab',
                value: 'not autoNumeric test',
            },
            {
                name: 'bc',
                value: 'not autoNumeric $1,234.567',
            },
        ]);
        expect(anInput1.formJsonLocalized(',-')).toEqual(jsonResult2);
        anInput1.update({ outputFormat : ',-' });
        expect(anInput1.formJsonLocalized()).toEqual(jsonResult2);
    });

    //FIXME à terminer : formUnformat, formReformat, formSubmitString*
});

//TODO Complete the tests in order to test every single method separately

//-----------------------------------------------------------------------------
//---- Static functions

describe('Static autoNumeric functions', () => {
    describe('`unformat` should unformat', () => {
        it('with default options', () => {
            expect(AutoNumeric.unformat('$1,234.56')).toEqual('1234.56');
            expect(AutoNumeric.unformat('$123.45')).toEqual('123.45');
            expect(AutoNumeric.unformat('$0.00')).toEqual('0.00');

            expect(AutoNumeric.unformat('$1,234.56', { outputFormat : 'number' })).toEqual(1234.56);
            expect(AutoNumeric.unformat('$123.45', { outputFormat : 'number' })).toEqual(123.45);
            expect(AutoNumeric.unformat('$0.00', { outputFormat : 'number' })).toEqual(0);
            expect(AutoNumeric.unformat(null)).toEqual(null);
            expect(AutoNumeric.unformat(1234.56, { outputFormat : 'number' })).toEqual(1234.56);
            expect(AutoNumeric.unformat(0, { outputFormat : 'number' })).toEqual(0);
        });

        it('with user options', () => {
            expect(AutoNumeric.unformat('1.234,56 €', autoNumericOptionsEuroNumber)).toEqual(1234.56);
            expect(AutoNumeric.unformat('123,45 €', autoNumericOptionsEuroNumber)).toEqual(123.45);
            expect(AutoNumeric.unformat('0,00 €', autoNumericOptionsEuroNumber)).toEqual(0);

            expect(AutoNumeric.unformat('1.234,56 €', autoNumericOptionsEuro)).toEqual('1234.56');
            expect(AutoNumeric.unformat('123,45 €', autoNumericOptionsEuro)).toEqual('123.45');
            expect(AutoNumeric.unformat('0,00 €', autoNumericOptionsEuro)).toEqual('0.00');
            expect(AutoNumeric.unformat(null, autoNumericOptionsEuro)).toEqual(null);
        });

        it(`and return a 'real' number, whatever options are passed as an argument`, () => {
            expect(AutoNumeric.unformat(1234.56)).toEqual(1234.56);
            expect(AutoNumeric.unformat(0)).toEqual(0);

            // Giving an unformatted value should return the same unformatted value, whatever the options passed as a parameter
            expect(AutoNumeric.unformat(1234.56, autoNumericOptionsEuro)).toEqual(1234.56);
        });

        it('should only send a warning, and not throw', () => {
            spyOn(console, 'warn');
            expect(() => AutoNumeric.validate({ decimalPlacesOverride: '3', decimalPlacesShownOnFocus: '2' })).not.toThrow();
            expect(console.warn).toHaveBeenCalled();
        });
    });

    describe('`format` should format', () => {
        it('with default options', () => {
            expect(AutoNumeric.format(1234.56)).toEqual('1,234.56');
            expect(AutoNumeric.format('1234.56')).toEqual('1,234.56');
            expect(AutoNumeric.format(123.45)).toEqual('123.45');
            expect(AutoNumeric.format('1234,56')).toEqual('123,456.00'); // By default, ',' is a group separator, which gets removed
            expect(AutoNumeric.format('1.234,56')).toEqual('1.23'); // By default, '.' is the decimal separator
            expect(AutoNumeric.format(0)).toEqual('0.00');
            expect(AutoNumeric.format(null)).toEqual(null);
            expect(AutoNumeric.format(undefined)).toEqual(null);
        });

        it('with user options', () => {
            expect(AutoNumeric.format(1234.56, autoNumericOptionsEuro)).toEqual('1.234,56 €');
            expect(AutoNumeric.format('1.234,56 €', autoNumericOptionsEuro)).toEqual('1.234,56 €');
            expect(AutoNumeric.format('1234.56', autoNumericOptionsEuro)).toEqual('1.234,56 €');
            expect(AutoNumeric.format(123.45, autoNumericOptionsEuro)).toEqual('123,45 €');
            expect(AutoNumeric.format('123,45 €', autoNumericOptionsEuro)).toEqual('123,45 €');
            expect(AutoNumeric.format(0, autoNumericOptionsEuro)).toEqual('0,00 €');

            expect(AutoNumeric.format(1234.56, autoNumericOptionsDollar)).toEqual('$1,234.56');
            expect(AutoNumeric.format(123.45, autoNumericOptionsDollar)).toEqual('$123.45');
            expect(AutoNumeric.format('$1,234.56', autoNumericOptionsDollar)).toEqual('$1,234.56');
            expect(AutoNumeric.format('$123.45', autoNumericOptionsDollar)).toEqual('$123.45');

            expect(AutoNumeric.format(null, autoNumericOptionsEuro)).toEqual(null);
            expect(AutoNumeric.format(undefined, autoNumericOptionsEuro)).toEqual(null);
        });

        it('should only send a warning, and not throw', () => {
            spyOn(console, 'warn');
            expect(() => AutoNumeric.validate({ decimalPlacesOverride: '3', decimalPlacesShownOnFocus: '2' })).not.toThrow();
            expect(console.warn).toHaveBeenCalled();
        });
    });

    it('`format` should fail formatting wrong parameters', () => {
        spyOn(console, 'warn');
        expect(() => AutoNumeric.format('foobar')).toThrow();
        expect(() => AutoNumeric.format([1234])).toThrow();
        expect(() => AutoNumeric.format({})).toThrow();
        expect(() => AutoNumeric.format({ val: 1234 })).toThrow();
        expect(() => AutoNumeric.format([])).toThrow();
        expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it('`format` should fail when trying to format a localized string with the wrong options', () => {
        spyOn(console, 'warn');
        expect(() => AutoNumeric.format('$1,234.56', autoNumericOptionsEuro)).toThrow();
        expect(() => AutoNumeric.format('$123.45', autoNumericOptionsEuro)).toThrow();
        expect(() => AutoNumeric.format('1.234,56 €', autoNumericOptionsDollar)).toThrow();
        expect(() => AutoNumeric.format('123,45 €', autoNumericOptionsDollar)).toThrow();
        expect(console.warn).toHaveBeenCalledTimes(4);
    });

    it('`unformat` should fail unformatting wrong parameters', () => {
        // expect(() => AutoNumeric.unformat('foobar')).toThrow(); //FIXME This should throw
        expect(() => AutoNumeric.unformat([1234])).toThrow();
        expect(() => AutoNumeric.unformat({})).toThrow();
        expect(() => AutoNumeric.unformat({ val: 1234 })).toThrow();
        expect(() => AutoNumeric.unformat([])).toThrow();
    });

    describe('`validate`', () => {
        it('should validate any old setting name, while outputting a warning', () => {
            const oldOptionObject = { aSep: ' ' };
            // Test if a warning is written in the console
            spyOn(console, 'warn');
            expect(() => AutoNumeric.validate(oldOptionObject)).not.toThrow();
            /* eslint no-console: 0 */
            expect(console.warn).toHaveBeenCalled();

            // We make sure that the initial option object is modified accordingly
            expect(oldOptionObject).toEqual({ digitGroupSeparator: ' ' });
        });

        it('should validate multiple old setting names, while outputting as many warnings as needed', () => {
            const oldOptionObject = { aSep: ' ', aDec: ',', altDec: '.', aSign: ' €' };
            // Test if a warning is written in the console
            spyOn(console, 'warn');
            expect(() => AutoNumeric.validate(oldOptionObject)).not.toThrow();
            /* eslint no-console: 0 */
            expect(console.warn).toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalledTimes(4);

            // We make sure that the initial option object is modified accordingly
            expect(oldOptionObject).toEqual({ digitGroupSeparator: ' ', decimalCharacter: ',', decimalCharacterAlternative: '.', currencySymbol: ' €' });
        });

        it('should throw when using a unknown option name, if `failOnUnknownOption` is set to `TRUE`', () => {
            expect(() => AutoNumeric.validate({ failOnUnknownOption: true, foobar: '.' })).toThrow();
        });

        it('should not throw when using a unknown option name, if `failOnUnknownOption` is set to `FALSE`', () => {
            expect(() => AutoNumeric.validate({ foobar: '.' })).not.toThrow();
        });

        it('should validate', () => {
            expect(() => AutoNumeric.validate(autoNumericOptionsEuro)).not.toThrow();
            expect(() => AutoNumeric.validate(autoNumericOptionsDollar)).not.toThrow();

            expect(() => AutoNumeric.validate({ digitGroupSeparator: ',' })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: '.',  decimalCharacter: ',' })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: ' ' })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: '\u2009' })).not.toThrow(); // Thin-space
            expect(() => AutoNumeric.validate({ digitGroupSeparator: '\u202f' })).not.toThrow(); // Narrow no-break space
            expect(() => AutoNumeric.validate({ digitGroupSeparator: '\u00a0' })).not.toThrow(); // No-break space
            expect(() => AutoNumeric.validate({ digitGroupSeparator: '' })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: "'" })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: '٬' })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: '˙' })).not.toThrow();

            expect(() => AutoNumeric.validate({ noSeparatorOnFocus: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ noSeparatorOnFocus: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ noSeparatorOnFocus: 'false' })).not.toThrow();
            expect(() => AutoNumeric.validate({ noSeparatorOnFocus: 'true' })).not.toThrow();

            expect(() => AutoNumeric.validate({ digitalGroupSpacing: '2' })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: '3' })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: 4 })).not.toThrow();

            expect(() => AutoNumeric.validate({ decimalCharacter: ',', digitGroupSeparator: ' ' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacter: '.' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacter: '·' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacter: '٫' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacter: '⎖' })).not.toThrow();

            expect(() => AutoNumeric.validate({ decimalCharacterAlternative: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacterAlternative: 'longSeparator' })).not.toThrow();

            expect(() => AutoNumeric.validate({ currencySymbol: ' €' })).not.toThrow();
            expect(() => AutoNumeric.validate({ currencySymbol: '' })).not.toThrow();
            expect(() => AutoNumeric.validate({ currencySymbol: 'foobar' })).not.toThrow();

            expect(() => AutoNumeric.validate({ currencySymbolPlacement: 'p' })).not.toThrow();
            expect(() => AutoNumeric.validate({ currencySymbolPlacement: 's' })).not.toThrow();

            expect(() => AutoNumeric.validate({ negativePositiveSignPlacement: 'p' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativePositiveSignPlacement: 's' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativePositiveSignPlacement: 'l' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativePositiveSignPlacement: 'r' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativePositiveSignPlacement: null })).not.toThrow();

            expect(() => AutoNumeric.validate({ showPositiveSign: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ showPositiveSign: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ showPositiveSign: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ showPositiveSign: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ suffixText: '' })).not.toThrow();
            expect(() => AutoNumeric.validate({ suffixText: 'foobar' })).not.toThrow();
            expect(() => AutoNumeric.validate({ suffixText: ' foobar' })).not.toThrow();
            expect(() => AutoNumeric.validate({ suffixText: 'foo bar' })).not.toThrow();
            expect(() => AutoNumeric.validate({ suffixText: 'foobar ' })).not.toThrow();

            expect(() => AutoNumeric.validate({ overrideMinMaxLimits: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ overrideMinMaxLimits: 'ceiling' })).not.toThrow();
            expect(() => AutoNumeric.validate({ overrideMinMaxLimits: 'floor' })).not.toThrow();
            expect(() => AutoNumeric.validate({ overrideMinMaxLimits: 'ignore' })).not.toThrow();

            expect(() => AutoNumeric.validate({ maximumValue: '42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '42.4' })).not.toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '42.42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '-42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '-42.4' })).not.toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '-42.42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '9999999999999.99' })).not.toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '-9999999999999.99' })).not.toThrow();

            expect(() => AutoNumeric.validate({ minimumValue: '42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '42.4' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '42.42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '-42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '-42.4' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '-42.42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '9999999999999.99' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '-9999999999999.99' })).not.toThrow();

            expect(() => AutoNumeric.validate({ minimumValue: '-10', maximumValue: '-5' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '-10', maximumValue:  '0' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '-10', maximumValue: '20' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue:   '0', maximumValue: '20' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue:  '10', maximumValue: '20' })).not.toThrow();

            expect(() => AutoNumeric.validate({ decimalPlacesOverride: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesOverride: '2' })).not.toThrow();

            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: '0' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: '2' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: '15' })).not.toThrow();

            expect(() => AutoNumeric.validate({ decimalPlacesOverride: '2', decimalPlacesShownOnFocus: '2' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesOverride: '2', decimalPlacesShownOnFocus: '3' })).not.toThrow();

            expect(() => AutoNumeric.validate({ scaleDivisor: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ scaleDivisor: '100' })).not.toThrow();
            expect(() => AutoNumeric.validate({ scaleDivisor: 100 })).not.toThrow();
            expect(() => AutoNumeric.validate({ scaleDivisor: 45.89 })).not.toThrow();

            expect(() => AutoNumeric.validate({ scaleDecimalPlaces: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ scaleDecimalPlaces: 0 })).not.toThrow();
            expect(() => AutoNumeric.validate({ scaleDecimalPlaces: 2 })).not.toThrow();

            expect(() => AutoNumeric.validate({ scaleSymbol: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ scaleSymbol: '' })).not.toThrow();
            expect(() => AutoNumeric.validate({ scaleSymbol: 'foobar' })).not.toThrow();
            expect(() => AutoNumeric.validate({ scaleSymbol: 'foo bar' })).not.toThrow();
            expect(() => AutoNumeric.validate({ scaleSymbol: ' foobar' })).not.toThrow();
            expect(() => AutoNumeric.validate({ scaleSymbol: 'foobar ' })).not.toThrow();

            expect(() => AutoNumeric.validate({ saveValueToSessionStorage: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ saveValueToSessionStorage: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ saveValueToSessionStorage: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ saveValueToSessionStorage: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ onInvalidPaste: 'error' })).not.toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: 'ignore' })).not.toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: 'clamp' })).not.toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: 'truncate' })).not.toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: 'replace' })).not.toThrow();

            expect(() => AutoNumeric.validate({ roundingMethod: 'S' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'A' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 's' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'a' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'B' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'U' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'D' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'C' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'F' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'N05' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'CHF' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'U05' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'D05' })).not.toThrow();

            expect(() => AutoNumeric.validate({ allowDecimalPadding: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ allowDecimalPadding: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ allowDecimalPadding: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ allowDecimalPadding: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: '(,)' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: '[,]' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: '<,>' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: '{,}' })).not.toThrow();

            expect(() => AutoNumeric.validate({ emptyInputBehavior: 'focus' })).not.toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: 'press' })).not.toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: 'always' })).not.toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: 'zero' })).not.toThrow();

            expect(() => AutoNumeric.validate({ leadingZero: 'allow' })).not.toThrow();
            expect(() => AutoNumeric.validate({ leadingZero: 'deny' })).not.toThrow();
            expect(() => AutoNumeric.validate({ leadingZero: 'keep' })).not.toThrow();

            expect(() => AutoNumeric.validate({ formatOnPageLoad: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ formatOnPageLoad: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ formatOnPageLoad: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ formatOnPageLoad: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ selectNumberOnly: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ selectNumberOnly: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ selectNumberOnly: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ selectNumberOnly: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ defaultValueOverride: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: '' })).not.toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: '42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: '-42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: '42.99' })).not.toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: '-42.99' })).not.toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: 5 })).not.toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: -5 })).not.toThrow();

            expect(() => AutoNumeric.validate({ unformatOnSubmit: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ unformatOnSubmit: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ unformatOnSubmit: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ unformatOnSubmit: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ outputFormat: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: 'string' })).not.toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: 'number' })).not.toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: '.' })).not.toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: '-.' })).not.toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: ',' })).not.toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: '-,' })).not.toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: '.-' })).not.toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: ',-' })).not.toThrow();

            expect(() => AutoNumeric.validate({ isCancellable: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ isCancellable: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ isCancellable: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ isCancellable: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ modifyValueOnWheel: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ modifyValueOnWheel: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ modifyValueOnWheel: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ modifyValueOnWheel: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ wheelStep: 'progressive' })).not.toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: '1000' })).not.toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: '422.345' })).not.toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: 1000 })).not.toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: 422.345 })).not.toThrow();

            expect(() => AutoNumeric.validate({ serializeSpaces: '+' })).not.toThrow();
            expect(() => AutoNumeric.validate({ serializeSpaces: '%20' })).not.toThrow();

            expect(() => AutoNumeric.validate({ showWarnings: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ showWarnings: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ showWarnings: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ showWarnings: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ noEventListeners: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ noEventListeners: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ noEventListeners: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ noEventListeners: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ readOnly: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ readOnly: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ readOnly: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ readOnly: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ unformatOnHover: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ unformatOnHover: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ unformatOnHover: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ unformatOnHover: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ failOnUnknownOption: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ failOnUnknownOption: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ failOnUnknownOption: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ failOnUnknownOption: 'false' })).not.toThrow();
        });

        it('should validate, with warnings', () => {
            spyOn(console, 'warn');
            expect(() => AutoNumeric.validate({ decimalPlacesOverride: '0' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesOverride: '15' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesOverride: 5 })).not.toThrow();

            expect(() => AutoNumeric.validate({ decimalPlacesOverride: '3', decimalPlacesShownOnFocus: '2' })).not.toThrow(); // This will output 2 warnings
            expect(() => AutoNumeric.validate({ decimalPlacesOverride: '2', minimumValue: '0', maximumValue: '20' })).not.toThrow(); // This will output a warning

            expect(() => AutoNumeric.validate({ allowDecimalPadding: false, decimalPlacesOverride: '2' })).not.toThrow(); // This will output a warning
            expect(console.warn).toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalledTimes(7);
        });

        it('should not validate', () => {
            expect(() => AutoNumeric.validate(0)).toThrow();
            expect(() => AutoNumeric.validate(undefined)).toThrow();
            expect(() => AutoNumeric.validate(null)).toThrow();
            expect(() => AutoNumeric.validate('')).toThrow();
            expect(() => AutoNumeric.validate([])).toThrow();
            expect(() => AutoNumeric.validate({})).toThrow();
            expect(() => AutoNumeric.validate([{ digitGroupSeparator: '.' }])).toThrow();
            expect(() => AutoNumeric.validate('foobar')).toThrow();
            expect(() => AutoNumeric.validate(42)).toThrow();

            expect(() => AutoNumeric.validate({ digitGroupSeparator: '-' })).toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: '"' })).toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: 'a' })).toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: '.' })).toThrow(); // Since the default 'decimalCharacter' is '.' too
            expect(() => AutoNumeric.validate({ digitGroupSeparator: true })).toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: null })).toThrow();

            expect(() => AutoNumeric.validate({ noSeparatorOnFocus: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ noSeparatorOnFocus: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ noSeparatorOnFocus: null })).toThrow();

            expect(() => AutoNumeric.validate({ digitalGroupSpacing: '37foo' })).toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: null })).toThrow();

            expect(() => AutoNumeric.validate({ decimalCharacter: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacter: true })).toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacter: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacter: '.', digitGroupSeparator: '.' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacter: ',', digitGroupSeparator: ',' })).toThrow();

            expect(() => AutoNumeric.validate({ decimalCharacterAlternative: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacterAlternative: true })).toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacterAlternative: ['foobar'] })).toThrow();

            expect(() => AutoNumeric.validate({ currencySymbol: [] })).toThrow();
            expect(() => AutoNumeric.validate({ currencySymbol: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ currencySymbol: true })).toThrow();
            expect(() => AutoNumeric.validate({ currencySymbol: null })).toThrow();

            expect(() => AutoNumeric.validate({ currencySymbolPlacement: ['s'] })).toThrow();
            expect(() => AutoNumeric.validate({ currencySymbolPlacement: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ currencySymbolPlacement: true })).toThrow();
            expect(() => AutoNumeric.validate({ currencySymbolPlacement: null })).toThrow();
            expect(() => AutoNumeric.validate({ currencySymbolPlacement: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ negativePositiveSignPlacement: ['r'] })).toThrow();
            expect(() => AutoNumeric.validate({ negativePositiveSignPlacement: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ negativePositiveSignPlacement: true })).toThrow();
            expect(() => AutoNumeric.validate({ negativePositiveSignPlacement: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ showPositiveSign: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ showPositiveSign: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ showPositiveSign: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ showPositiveSign: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ showPositiveSign: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ suffixText: '-foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ suffixText: 'foo-bar' })).toThrow();
            expect(() => AutoNumeric.validate({ suffixText: 'foo42bar' })).toThrow();
            expect(() => AutoNumeric.validate({ suffixText: '42foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ suffixText: 'foobar42' })).toThrow();
            expect(() => AutoNumeric.validate({ suffixText: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ suffixText: -42 })).toThrow();
            expect(() => AutoNumeric.validate({ suffixText: true })).toThrow();
            expect(() => AutoNumeric.validate({ suffixText: null })).toThrow();

            expect(() => AutoNumeric.validate({ overrideMinMaxLimits: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ overrideMinMaxLimits: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ overrideMinMaxLimits: true })).toThrow();

            expect(() => AutoNumeric.validate({ maximumValue: true })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: null })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: 42.42 })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: -42 })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: -42.42 })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '42.' })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '-42.' })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '.42' })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '-42foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '9999999999999,99' })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ minimumValue: true })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: null })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: 42.42 })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: -42 })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: -42.42 })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '42.' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '-42.' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '.42' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '-42foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '9999999999999,99' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ minimumValue: '20', maximumValue: '-10' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '-5', maximumValue: '-10' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue:  '0', maximumValue: '-10' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '20', maximumValue: '-10' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '20', maximumValue:   '0' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '20', maximumValue:  '10' })).toThrow();

            expect(() => AutoNumeric.validate({ decimalPlacesOverride: [] })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesOverride: true })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesOverride: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesOverride: '22foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesOverride: '-5' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesOverride: -5 })).toThrow();

            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: [] })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: true })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: '22foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: '-5' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: 5 })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: -5 })).toThrow();

            expect(() => AutoNumeric.validate({ scaleDivisor: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ scaleDivisor: true })).toThrow();
            expect(() => AutoNumeric.validate({ scaleDivisor: -1000 })).toThrow();

            expect(() => AutoNumeric.validate({ scaleDecimalPlaces: -5 })).toThrow();
            expect(() => AutoNumeric.validate({ scaleDecimalPlaces: 4.2 })).toThrow();
            expect(() => AutoNumeric.validate({ scaleDecimalPlaces: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ scaleDecimalPlaces: false })).toThrow();

            expect(() => AutoNumeric.validate({ scaleSymbol: true })).toThrow();
            expect(() => AutoNumeric.validate({ scaleSymbol: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ scaleSymbol: [] })).toThrow();

            expect(() => AutoNumeric.validate({ saveValueToSessionStorage: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ saveValueToSessionStorage: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ saveValueToSessionStorage: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ saveValueToSessionStorage: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ saveValueToSessionStorage: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ onInvalidPaste: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: -42 })).toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: 0.5 })).toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: true })).toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: null })).toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: [] })).toThrow();

            expect(() => AutoNumeric.validate({ roundingMethod: 0.5 })).toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: true })).toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: null })).toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ allowDecimalPadding: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ allowDecimalPadding: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ allowDecimalPadding: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ allowDecimalPadding: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ allowDecimalPadding: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: [] })).toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: true })).toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: '22foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: '-5' })).toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: 5 })).toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: -5 })).toThrow();

            expect(() => AutoNumeric.validate({ emptyInputBehavior: [] })).toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: true })).toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: '22foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: '-5' })).toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: 5 })).toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: -5 })).toThrow();

            expect(() => AutoNumeric.validate({ leadingZero: [] })).toThrow();
            expect(() => AutoNumeric.validate({ leadingZero: true })).toThrow();
            expect(() => AutoNumeric.validate({ leadingZero: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ leadingZero: '22foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ leadingZero: '-5' })).toThrow();
            expect(() => AutoNumeric.validate({ leadingZero: 5 })).toThrow();
            expect(() => AutoNumeric.validate({ leadingZero: -5 })).toThrow();

            expect(() => AutoNumeric.validate({ formatOnPageLoad: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ formatOnPageLoad: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ formatOnPageLoad: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ formatOnPageLoad: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ formatOnPageLoad: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ selectNumberOnly: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ selectNumberOnly: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ selectNumberOnly: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ selectNumberOnly: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ selectNumberOnly: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ defaultValueOverride: [] })).toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: true })).toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: '22foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ unformatOnSubmit: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ unformatOnSubmit: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ unformatOnSubmit: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ unformatOnSubmit: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ unformatOnSubmit: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ outputFormat: [] })).toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: true })).toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: '22foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: '-5' })).toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: 5 })).toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: -5 })).toThrow();

            expect(() => AutoNumeric.validate({ isCancellable: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ isCancellable: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ isCancellable: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ isCancellable: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ isCancellable: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ modifyValueOnWheel: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ modifyValueOnWheel: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ modifyValueOnWheel: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ modifyValueOnWheel: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ modifyValueOnWheel: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ wheelStep: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: true })).toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: -42 })).toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: '-42' })).toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: -1000.02 })).toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: '-1000.02' })).toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: '1000foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ serializeSpaces: true })).toThrow();
            expect(() => AutoNumeric.validate({ serializeSpaces: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ serializeSpaces: -42 })).toThrow();
            expect(() => AutoNumeric.validate({ serializeSpaces: '-42' })).toThrow();
            expect(() => AutoNumeric.validate({ serializeSpaces: '++' })).toThrow();
            expect(() => AutoNumeric.validate({ serializeSpaces: ' ' })).toThrow();
            expect(() => AutoNumeric.validate({ serializeSpaces: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ serializeSpaces: ' foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ showWarnings: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ showWarnings: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ showWarnings: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ showWarnings: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ showWarnings: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ noEventListeners: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ noEventListeners: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ noEventListeners: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ noEventListeners: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ noEventListeners: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ readOnly: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ readOnly: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ readOnly: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ readOnly: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ readOnly: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ unformatOnHover: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ unformatOnHover: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ unformatOnHover: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ unformatOnHover: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ unformatOnHover: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ failOnUnknownOption: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ failOnUnknownOption: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ failOnUnknownOption: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ failOnUnknownOption: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ failOnUnknownOption: 'foobar' })).toThrow();
        });

        it('should only send a warning, and not throw', () => {
            spyOn(console, 'warn');
            expect(() => AutoNumeric.validate({ decimalPlacesOverride: '3', decimalPlacesShownOnFocus: '2' })).not.toThrow();
            expect(console.warn).toHaveBeenCalled();
        });

        it('should only send a warning, and not throw', () => {
            spyOn(console, 'warn');
            expect(() => AutoNumeric.validate({ decimalPlacesOverride: '3', decimalPlacesShownOnFocus: '2' })).not.toThrow();
            expect(console.warn).toHaveBeenCalled();
        });
    });
});

describe(`the static options object`, () => {
    it('should give access to the options enumeration', () => {
        expect(AutoNumeric.options.onInvalidPaste.error).toEqual('error');
        expect(AutoNumeric.options.currencySymbolPlacement.suffix).toEqual('s');
        expect(AutoNumeric.options.digitGroupSeparator.apostrophe).toEqual("'");
        expect(AutoNumeric.options.decimalCharacter.middleDot).toEqual('·');
        expect(AutoNumeric.options.decimalCharacterAlternative.none).toBeNull();
        expect(AutoNumeric.options.currencySymbol.none).toEqual('');
    });
});
