// --- DOM Element Cache ---
const domElements = {}; // Object to cache DOM elements

// --- Global Variables & Constants ---
const APP_VERSION = "4.1";
let currentPage = 1;
const itemsPerPage = 10;
let referralsData = [];
let nextReferralId = 1;
let currentLanguage = 'en';
let balanceChartInstance = null;
let conversionTimeout = null;
const CONVERSION_DEBOUNCE_DELAY = 500;
let lastConversionDirection = 'from';
let currentSortKey = null;
let currentSortOrder = 'asc';

const REINVEST_THRESHOLD_SOL = 0.1;
const REINVEST_THRESHOLD_USDC = 20;
const commissionRates = { 1: 0.08, 2: 0.05, 3: 0.03, 4: 0.01, 5: 0.03, 6: 0.05, 7: 0.08 };
const solanaIconImg = `<img src="solana_icon.svg" alt="SOL" width="16" height="16">`;
const usdcIconImg = `<img src="usdc_icon.svg" alt="USDC" width="16" height="16">`;

const converterCurrencies = [
    { id: 'solana', name: 'Solana', type: 'crypto', symbol: 'SOL' },
    { id: 'usd-coin', name: 'USD Coin', type: 'crypto', symbol: 'USDC' },
    { id: 'bitcoin', name: 'Bitcoin', type: 'crypto', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', type: 'crypto', symbol: 'ETH' },
    { id: 'usd', name: 'US Dollar', type: 'fiat', symbol: 'USD' },
    { id: 'eur', name: 'Euro', type: 'fiat', symbol: 'EUR' },
    { id: 'rub', name: 'Russian Ruble', type: 'fiat', symbol: 'RUB' }
];
const getCurrencyType = (id) => converterCurrencies.find(c => c.id === id)?.type || 'crypto';
const getCurrencySymbol = (id) => converterCurrencies.find(c => c.id === id)?.symbol || '';

const translations = {
    'en': {
        labelUserStakedSol: 'Staked', labelUserProfitPercentSol: 'Profit % / day', labelUserStakedUsdc: 'Staked', labelUserProfitPercentUsdc: 'Profit % / day',
        labelPlatformFee: 'FomoFarm Fee %', labelSolUsd: 'SOL / USD', labelDays: 'Days',
        labelPeriodicSol: 'Add. Investment', labelPeriodicUsdc: 'Add. Investment',
        optionNo: 'No', optionWeekly: 'Weekly', optionMonthly: 'Monthly', optionQuarterly: 'Quarterly',
        fetchSolPriceButton: 'Update', statusLoading: 'Loading...', statusSuccess: 'Success!', statusError: 'Error',
        labelEnableReferrals: 'Referrals', calculate: 'Calculate',
        labelSupportAuthor: 'Support the author:',
        copyButtonTitle: 'Copy address',
        copiedMessage: 'Copied!',
        paginationPrevious: 'Previous',
        paginationNext: 'Next',
        reinvestWord: 'Reinvest',
        resetButton: 'Reset All', exportButton: 'Export Data', importButton: 'Import Data',
        pFooter: 'Made by', langButtonText: 'Language EN', h3Referrals: 'Referrals', addReferral: 'Add Referral',
        thReferralNum: '№', thLevel: 'Level', thRefStakes: 'Stakes Summary', thActions: 'Actions',
        editButtonShort: 'Edit', removeButtonShort: 'Remove', noReferrals: 'No referrals added yet.', refSummaryNone: '-',
        modalTitlePrefix: 'Edit Data for Referral #', labelModalLevel: 'Level',
        labelModalStakeSol: 'Staked', labelModalProfitSol: 'Profit % / day', labelModalStakeUsdc: 'Staked', labelModalProfitUsdc: 'Profit % / day',
        saveButton: 'Save', cancelButton: 'Cancel', h2Results: 'Results', h4YourProfit: 'Your profit',
        labelProfitUserSol: 'From Your Stake:', labelProfitUserUsdc: 'From Your Stake:',
        h4ReferralProfit: 'Profit from referrals', labelProfitRefSol: 'From Referrals:', labelProfitRefUsdc: 'From Referrals:',
        h4TotalProfit: 'Total profit', labelProfitTotalSol: 'Total Profit SOL:', labelProfitTotalUsdc: 'Total Profit USDC:',
        labelProfitPercentSol: 'Profit SOL in %:', labelProfitPercentUsdc: 'Profit USDC in %:',
        h4DoublingTime: 'Doubling Time | 100% Profit',
        labelDoubleSolNoreinvest: 'SOL Doubling | No Reinvest:', labelDoubleUsdcNoreinvest: 'USDC Doubling | No Reinvest:',
        labelDoubleSolReinvest: 'SOL Doubling | With Reinvest:', labelDoubleUsdcReinvest: 'USDC Doubling | With Reinvest:',
        h4PeriodicTotal: 'Total Add. Investments', labelPeriodicTotalSol: 'Added Investments:', labelPeriodicTotalUsdc: 'Added Investments:',
        h4FinalBalance: 'Final Balance', labelFinalBalanceSol: 'Final Balance SOL:', labelFinalBalanceUsdc: 'Final Balance USDC:',
        labelFinalBalanceUsd: 'Total Final Balance in USD:',
        labelProfitTotalUsd: 'Total Profit in USD:',
        roiNever: 'Never', roiOverDays: 'Over {days} days', daysSuffix: ' days',
        reinvestOff: 'Off',
        invalidInputError: 'Please enter valid values for Stakes, Rates, Days, and SOL/USD Rate.',
        solUsdRateError: 'SOL/USD rate must be greater than 0 to calculate profit from USDC stakes.',
        h3ConverterTitle: 'Currency Converter',
        h3ChartTitle: 'Profitability',
        swapButtonTitle: 'Swap currencies',
        convertStatusLoading: 'Converting...',
        convertStatusSuccess: 'Success!',
        convertStatusError: 'Error',
        convertErrorInvalidAmount: 'Invalid amount.',
        convertErrorApi: 'API Error.',
        convertErrorPairNotFound: 'Currency pair not found.',
        convertErrorSameCurrency: 'Cannot convert to the same currency.',
        convertErrorFiatToFiat: 'Direct fiat-to-fiat conversion not supported.',
        h4SolResults: 'SOL Results', h4UsdcResults: 'USDC Results', h4MainIndicators: 'Main Indicators',
        refStructureTurnover: 'Structure Turnover:',
        
    },
    'ru': {
        labelUserStakedSol: 'Вложено', labelUserProfitPercentSol: 'Профит % / день', labelUserStakedUsdc: 'Вложено', labelUserProfitPercentUsdc: 'Профит % / день',
        labelPlatformFee: 'Комиссия FomoFarm %', labelSolUsd: 'SOL / USD', labelDays: 'Дней',
        labelPeriodicSol: 'Довложения', labelPeriodicUsdc: 'Довложения',
        optionNo: 'Нет', optionWeekly: 'Раз в неделю', optionMonthly: 'Раз в месяц', optionQuarterly: 'Раз в 3 месяца',
        fetchSolPriceButton: 'Обновить', statusLoading: 'Загрузка...', statusSuccess: 'Успешно!', statusError: 'Ошибка',
        labelEnableReferrals: 'Рефералы', calculate: 'Рассчитать',
        labelSupportAuthor: 'Поддержать автора:',
        copyButtonTitle: 'Скопировать адрес',
        copiedMessage: 'Скопировано!',
        paginationPrevious: 'Назад',
        paginationNext: 'Вперед',
        reinvestWord: 'Реинвест',
        resetButton: 'Сбросить все', exportButton: 'Экспорт', importButton: 'Импорт',
        pFooter: 'Сделано', langButtonText: 'Язык RU', h3Referrals: 'Рефералы', addReferral: 'Добавить реферала',
        thReferralNum: '№', thLevel: 'Уровень', thRefStakes: 'Сводка стейков', thActions: 'Действия',
        editButtonShort: 'Изм.', removeButtonShort: 'Удал.', noReferrals: 'Рефералы еще не добавлены.', refSummaryNone: '-',
        modalTitlePrefix: 'Изменить данные для Реферала №', labelModalLevel: 'Уровень',
        labelModalStakeSol: 'Вложено', labelModalProfitSol: 'Профит % / день', labelModalStakeUsdc: 'Вложено', labelModalProfitUsdc: 'Профит % / день',
        saveButton: 'Сохранить', cancelButton: 'Отмена', h2Results: 'Результаты', h4YourProfit: 'Ваш профит',
        labelProfitUserSol: 'От Вашего стейка:', labelProfitUserUsdc: 'От Вашего стейка:',
        h4ReferralProfit: 'Профит от рефералов', labelProfitRefSol: 'От Рефералов:', labelProfitRefUsdc: 'От Рефералов:',
        h4TotalProfit: 'Общий профит', labelProfitTotalSol: 'Общий Профит SOL:', labelProfitTotalUsdc: 'Общий Профит USDC:',
        labelProfitPercentSol: 'Профит SOL в %:', labelProfitPercentUsdc: 'Профит USDC в %:',
        h4DoublingTime: 'Время удвоения | 100% Профит',
        labelDoubleSolNoreinvest: 'Удвоение SOL | Без реинвеста:', labelDoubleUsdcNoreinvest: 'Удвоение USDC | Без реинвеста:',
        labelDoubleSolReinvest: 'Удвоение SOL | С реинвестом:', labelDoubleUsdcReinvest: 'Удвоение USDC | С реинвестом:',
        h4PeriodicTotal: 'Всего довложений', labelPeriodicTotalSol: 'Довложено:', labelPeriodicTotalUsdc: 'Довложено:',
        h4FinalBalance: 'Итоговый баланс', labelFinalBalanceSol: 'Итоговый Баланс SOL:', labelFinalBalanceUsdc: 'Итоговый Баланс USDC:',
        labelFinalBalanceUsd: 'Общий Итоговый Баланс в USD:',
        labelProfitTotalUsd: 'Общий Профит в USD:',
        roiNever: 'Никогда', roiOverDays: 'Более {days} дн.', daysSuffix: ' дн.',
        reinvestOff: 'Выкл.',
        invalidInputError: 'Пожалуйста, введите корректные значения для Стейков, Процентов, Дней и Курса SOL/USD.',
        solUsdRateError: 'Курс SOL/USD должен быть больше 0 для расчета дохода со стейков в USDC.',
        h3ConverterTitle: 'Конвертер Валют',
        h3ChartTitle: 'График Доходности',
        swapButtonTitle: 'Поменять валюты',
        convertStatusLoading: 'Конвертация...',
        convertStatusSuccess: 'Успешно!',
        convertStatusError: 'Ошибка',
        convertErrorInvalidAmount: 'Неверная сумма.',
        convertErrorApi: 'Ошибка API.',
        convertErrorPairNotFound: 'Валютная пара не найдена.',
        convertErrorSameCurrency: 'Нельзя конвертировать в ту же валюту.',
        convertErrorFiatToFiat: 'Прямая конвертация фиат-фиат не поддерживается.',
        refStructureTurnover: 'Оборот структуры:',
        h4SolResults: 'Результаты SOL', h4UsdcResults: 'Результаты USDC', h4MainIndicators: 'Основные Показатели'
    }
};

// --- Data Persistence Functions (localStorage) ---
/**
 * Сохраняет текущие данные калькулятора в localStorage.
 */
function saveData() {
    try {
        const dataToSave = {
            userStakedSolAmount: domElements.userStakedSolAmount.value,
            userProfitPercentSol: domElements.userProfitPercentSol.value,
            userStakedUsdcAmount: domElements.userStakedUsdcAmount.value,
            userProfitPercentUsdc: domElements.userProfitPercentUsdc.value,
            platformFee: domElements.platformFee.value,
            solToUsd: domElements.solToUsd.value,
            days: domElements.days.value,
            periodicSolAmount: domElements.periodicSolAmount.value,
            periodicSolPeriod: domElements.periodicSolPeriod.value,
            periodicUsdcAmount: domElements.periodicUsdcAmount.value,
            periodicUsdcPeriod: domElements.periodicUsdcPeriod.value,
            includeReferrals: domElements.includeReferralsCheckbox.checked.toString(),
            referralsData: JSON.stringify(referralsData || []),
            nextReferralId: nextReferralId,
            referralsCollapsed: domElements.referralsSection?.classList.contains('collapsed').toString() || 'false',
            chartCollapsed: domElements.chartSection?.classList.contains('collapsed').toString() || 'false',
            converterCollapsed: domElements.converterSection?.classList.contains('collapsed').toString() || 'false'
        };

        if (domElements.reinvestSolCheckbox) {
            dataToSave.reinvestSol = domElements.reinvestSolCheckbox.checked.toString();
        }
        if (domElements.reinvestSolPercent) {
            dataToSave.reinvestSolPercent = domElements.reinvestSolPercent.value;
        }
        if (domElements.reinvestUsdcCheckbox) {
            dataToSave.reinvestUsdc = domElements.reinvestUsdcCheckbox.checked.toString();
        }
        if (domElements.reinvestUsdcPercent) {
            dataToSave.reinvestUsdcPercent = domElements.reinvestUsdcPercent.value;
        }

        for (const [key, value] of Object.entries(dataToSave)) {
            localStorage.setItem(`fomoFarmCalc_${key}`, value);
        }
    } catch (error) { console.error("Ошибка сохранения данных в localStorage:", error); }
}

/**
 * Загружает данные калькулятора из localStorage при инициализации.
 */
function loadData() {
    try {
        domElements.userStakedSolAmount.value = localStorage.getItem('fomoFarmCalc_userStakedSolAmount') || '0';
        domElements.userProfitPercentSol.value = localStorage.getItem('fomoFarmCalc_userProfitPercentSol') || '0';
        domElements.userStakedUsdcAmount.value = localStorage.getItem('fomoFarmCalc_userStakedUsdcAmount') || '0';
        domElements.userProfitPercentUsdc.value = localStorage.getItem('fomoFarmCalc_userProfitPercentUsdc') || '0';
        domElements.platformFee.value = localStorage.getItem('fomoFarmCalc_platformFee') || '10';
        domElements.solToUsd.value = localStorage.getItem('fomoFarmCalc_solToUsd') || '0';
        domElements.days.value = localStorage.getItem('fomoFarmCalc_days') || '0';

        if (domElements.reinvestSolCheckbox) {
            domElements.reinvestSolCheckbox.checked = (localStorage.getItem('fomoFarmCalc_reinvestSol') || 'true') === 'true';
        }
        if (domElements.reinvestSolPercent) {
            domElements.reinvestSolPercent.value = localStorage.getItem('fomoFarmCalc_reinvestSolPercent') || '100';
        }
        if (domElements.reinvestUsdcCheckbox) {
            domElements.reinvestUsdcCheckbox.checked = (localStorage.getItem('fomoFarmCalc_reinvestUsdc') || 'true') === 'true';
        }
        if (domElements.reinvestUsdcPercent) {
            domElements.reinvestUsdcPercent.value = localStorage.getItem('fomoFarmCalc_reinvestUsdcPercent') || '100';
        }

        domElements.includeReferralsCheckbox.checked = (localStorage.getItem('fomoFarmCalc_includeReferrals') || 'true') === 'true';
        domElements.periodicSolAmount.value = localStorage.getItem('fomoFarmCalc_periodicSolAmount') || '0';
        domElements.periodicSolPeriod.value = localStorage.getItem('fomoFarmCalc_periodicSolPeriod') || '0';
        domElements.periodicUsdcAmount.value = localStorage.getItem('fomoFarmCalc_periodicUsdcAmount') || '0';
        domElements.periodicUsdcPeriod.value = localStorage.getItem('fomoFarmCalc_periodicUsdcPeriod') || '0';

        if (domElements.reinvestSolCheckbox) toggleReinvestControls(domElements.reinvestSolCheckbox);
        if (domElements.reinvestUsdcCheckbox) toggleReinvestControls(domElements.reinvestUsdcCheckbox);

        const savedReferrals = localStorage.getItem('fomoFarmCalc_referralsData');
        referralsData = savedReferrals ? JSON.parse(savedReferrals) : [];
        if (!Array.isArray(referralsData)) { referralsData = []; }
        referralsData = referralsData.filter(ref => typeof ref === 'object' && ref !== null && ref.hasOwnProperty('id'));
        referralsData.forEach(ref => {
            ref.stakedSol = ref.stakedSol || 0; ref.profitPercentSol = ref.profitPercentSol || 0;
            ref.stakedUsdc = ref.stakedUsdc || 0; ref.profitPercentUsdc = ref.profitPercentUsdc || 0;
            ref.level = ref.level || 1;
        });

        const savedNextId = parseInt(localStorage.getItem('fomoFarmCalc_nextReferralId'));
        if (referralsData.length > 0) {
            const maxId = referralsData.reduce((max, ref) => Math.max(max, ref.id || 0), 0);
            nextReferralId = Math.max(maxId + 1, savedNextId || 1);
        } else {
            nextReferralId = savedNextId || 1;
        }

        const referralsCollapsed = localStorage.getItem('fomoFarmCalc_referralsCollapsed') === 'true';
        const chartCollapsed = localStorage.getItem('fomoFarmCalc_chartCollapsed') === 'true';
        const converterCollapsed = localStorage.getItem('fomoFarmCalc_converterCollapsed') === 'true';

        if (domElements.referralsSection && referralsCollapsed) domElements.referralsSection.classList.add('collapsed');
        if (domElements.chartSection && chartCollapsed) domElements.chartSection.classList.add('collapsed');
        if (domElements.converterSection && converterCollapsed) domElements.converterSection.classList.add('collapsed');
        currentPage = 1;

    } catch (error) {
        console.error("Ошибка загрузки данных из localStorage:", error);
        referralsData = [];
        nextReferralId = 1;
    }
}

// --- UI Update Functions ---
/**
 * Обновляет тексты и иконки в интерфейсе в соответствии с выбранным языком.
 * @param {string} lang - Код языка ('en' или 'ru').
 */
function updateUI(lang) {
    currentLanguage = lang;
    const trans = translations[lang];
    document.documentElement.lang = lang === 'ru' ? 'ru' : 'en';

    const idToKeyMap = {
        'label-user-staked-sol': 'labelUserStakedSol', 'label-user-profit-percent-sol': 'labelUserProfitPercentSol',
        'label-user-staked-usdc': 'labelUserStakedUsdc', 'label-user-profit-percent-usdc': 'labelUserProfitPercentUsdc',
        'label-platform-fee': 'labelPlatformFee', 'label-sol-usd': 'labelSolUsd', 'label-days': 'labelDays',
        'label-periodic-sol': 'labelPeriodicSol', 'label-periodic-usdc': 'labelPeriodicUsdc',
        'label-enable-referrals': 'labelEnableReferrals',
        'addReferralButton': 'addReferral', 'th-referral-num': 'thReferralNum',
        'th-level': 'thLevel', 'th-ref-stakes': 'thRefStakes', 'th-actions': 'thActions',
        'calculateButton': 'calculate', 'resetButton': 'resetButton', 'exportButton': 'exportButton', 'importButton': 'importButton',
        'h2-results': 'h2Results',
        'label-profit-user-sol': 'labelProfitUserSol', 'label-profit-user-usdc': 'labelProfitUserUsdc',
        'label-profit-ref-sol': 'labelProfitRefSol', 'label-profit-ref-usdc': 'labelProfitRefUsdc',
        'label-profit-total-sol': 'labelProfitTotalSol', 'label-profit-total-usdc': 'labelProfitTotalUsdc',
        'label-profit-percent-sol': 'labelProfitPercentSol', 'label-profit-percent-usdc': 'labelProfitPercentUsdc',
        'label-support-author': 'labelSupportAuthor',
        'copyWalletButton': 'copyButtonTitle',
        'label-double-sol-noreinvest': 'labelDoubleSolNoreinvest', 'label-double-usdc-noreinvest': 'labelDoubleUsdcNoreinvest',
        'label-double-sol-reinvest': 'labelDoubleSolReinvest', 'label-double-usdc-reinvest': 'labelDoubleUsdcReinvest',
        'label-periodic-total-sol': 'labelPeriodicTotalSol', 'label-periodic-total-usdc': 'labelPeriodicTotalUsdc',
        'label-final-balance-sol': 'labelFinalBalanceSol', 'label-final-balance-usdc': 'labelFinalBalanceUsdc',
        'label-final-balance-usd': 'labelFinalBalanceUsd', 'label-profit-total-usd': 'labelProfitTotalUsd',
        'label-modal-level': 'labelModalLevel', 'label-modal-stake-sol': 'labelModalStakeSol', 'label-modal-profit-sol': 'labelModalProfitSol',
        'label-modal-stake-usdc': 'labelModalStakeUsdc', 'label-modal-profit-usdc': 'labelModalProfitUsdc',
        'saveReferralButton': 'saveButton', 'cancelReferralButton': 'cancelButton',
        'languageToggleButton': 'langButtonText',
        'option-sol-none': 'optionNo', 'option-sol-weekly': 'optionWeekly', 'option-sol-monthly': 'optionMonthly', 'option-sol-quarterly': 'optionQuarterly',
        'option-usdc-none': 'optionNo', 'option-usdc-weekly': 'optionWeekly', 'option-usdc-monthly': 'optionMonthly', 'option-usdc-quarterly': 'optionQuarterly',
        'fetchSolPriceButton': 'fetchSolPriceButton',
        'h3-converter-title': 'h3ConverterTitle', 'h3-chart-title': 'h3ChartTitle', 'h3-referrals-text': 'h3Referrals',
        'swapCurrenciesButton': 'swapButtonTitle',
        'h4-doubling-time': 'h4DoublingTime',
        'h4-sol-results': 'h4SolResults', 'h4-usdc-results': 'h4UsdcResults', 'h4-main-indicators': 'h4MainIndicators'
    };

    const currencyIconConfig = {
        'labelUserStakedSol': { html: solanaIconImg, class: 'currency-icon-sol' },
        'labelUserStakedUsdc': { html: usdcIconImg, class: 'currency-icon-usdc' },
        'labelUserProfitPercentSol': { html: solanaIconImg, class: 'currency-icon-sol' },
        'labelUserProfitPercentUsdc': { html: usdcIconImg, class: 'currency-icon-usdc' },
        'labelPeriodicSol': { html: solanaIconImg, class: 'currency-icon-sol' },
        'labelPeriodicUsdc': { html: usdcIconImg, class: 'currency-icon-usdc' },
        'labelModalStakeSol': { html: solanaIconImg, class: 'currency-icon-sol' },
        'labelModalProfitSol': { html: solanaIconImg, class: 'currency-icon-sol' },
        'labelModalStakeUsdc': { html: usdcIconImg, class: 'currency-icon-usdc' },
        'labelModalProfitUsdc': { html: usdcIconImg, class: 'currency-icon-usdc' }
    };

    for (const id in idToKeyMap) {
        const elementIdCamelCase = id.replace(/-([a-z])/g, g => g[1].toUpperCase());
        const element = domElements[elementIdCamelCase] || document.getElementById(id);
        const translationKey = idToKeyMap[id];

        if (element && trans[translationKey] !== undefined) {
            const translatedText = trans[translationKey];
            const isLabelTag = element.tagName === 'LABEL';
            const isSpanLabel = element.tagName === 'SPAN' && element.classList.contains('label');

            if (isLabelTag || isSpanLabel) {
                if (isLabelTag) {
                    const oldCurrencyIcon = element.querySelector('img.currency-icon-sol, img.currency-icon-usdc');
                    if (oldCurrencyIcon) {
                        oldCurrencyIcon.remove();
                    }
                }
                element.textContent = translatedText.trim() + ' ';
                if (isLabelTag) {
                    const iconInfo = currencyIconConfig[elementIdCamelCase];
                    if (iconInfo) {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = iconInfo.html.trim();
                        const newCurrencyIconElement = tempDiv.firstChild;
                        if (newCurrencyIconElement) {
                            newCurrencyIconElement.classList.add(iconInfo.class);
                            element.appendChild(newCurrencyIconElement);
                        }
                    }
                }
            } else if (element.tagName === 'OPTION') {
                element.textContent = translatedText;
            } else if (id === 'p-footer') {
                const firstChild = element.childNodes[0];
                if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
                    firstChild.nodeValue = translatedText + ' ';
                } else {
                    element.prepend(document.createTextNode(translatedText + ' '));
                }
            } else if (id === 'swapCurrenciesButton' || id === 'copyWalletButton' || element.id === 'languageToggleButton') {
                if (element.id === 'languageToggleButton') {
                    element.textContent = translatedText;
                } else {
                    element.title = translatedText;
                }
            } else {
                element.textContent = translatedText;
            }
        } else if (element && id === 'p-footer' && trans.pFooter) {
            const firstChild = element.childNodes[0];
            if (!firstChild || firstChild.nodeType !== Node.TEXT_NODE) {
                element.prepend(document.createTextNode(' '));
            }
            element.childNodes[0].nodeValue = (trans.pFooter || 'Made by') + ' ';
        }
    }

    const reinvestText = trans.reinvestWord || 'Reinvest';
    const labelReinvestSol = domElements.labelReinvestSol;
    if (labelReinvestSol) {
        labelReinvestSol.innerHTML = `${reinvestText} ${solanaIconImg}`;
    }

    const labelReinvestUsdc = domElements.labelReinvestUsdc;
    if (labelReinvestUsdc) {
        labelReinvestUsdc.innerHTML = `${reinvestText} ${usdcIconImg}`;
    }

    if (domElements.solPriceStatus) { domElements.solPriceStatus.textContent = ''; domElements.solPriceStatus.className = ''; }
    if (domElements.converterStatus) { domElements.converterStatus.textContent = ''; domElements.converterStatus.className = ''; }
    if (domElements.convertResultAmount) { domElements.convertResultAmount.value = ''; }

    renderReferralsTable();
    updateSortIcons();
    updateTotalStakeSummary();
}

/**
 * Переключает язык интерфейса между 'en' и 'ru'.
 */
function toggleLanguage() {
    const newLang = currentLanguage === 'en' ? 'ru' : 'en';
    localStorage.setItem('fomoFarmCalc_language', newLang);
    updateUI(newLang);
    triggerConversion();
}

// --- Referral Management Functions ---
/**
 * Добавляет нового реферала в список.
 */
function addReferral() {
    const newId = nextReferralId++;
    const newReferral = { id: newId, level: 1, stakedSol: 0, profitPercentSol: 0, stakedUsdc: 0, profitPercentUsdc: 0 };
    referralsData.push(newReferral);
    changePage(Math.ceil(referralsData.length / itemsPerPage) || 1);
    saveData();
}

/**
 * Удаляет реферала из списка по его ID.
 */
function removeReferral(referralIdToRemove) {
    referralsData = referralsData.filter(ref => ref.id !== referralIdToRemove);
    const totalPages = Math.ceil(referralsData.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
        changePage(totalPages);
    } else {
        renderReferralsTable();
    }
    saveData();
}

/**
 * Sorts the referralsData array and re-renders the table.
 * @param {string} sortKey - The key to sort by ('level' or 'stakes').
 */
function sortReferrals(sortKey) {
    const isAscending = currentSortKey === sortKey && currentSortOrder === 'asc';
    currentSortOrder = isAscending ? 'desc' : 'asc';
    currentSortKey = sortKey;

    referralsData.sort((a, b) => {
        let valA, valB;
        if (sortKey === 'level') {
            valA = a.level || 0;
            valB = b.level || 0;
        } else if (sortKey === 'stakes') {
            const solPrice = parseFloat(domElements.solToUsd.value) || 0;
            valA = (a.stakedSol || 0) * solPrice + (a.stakedUsdc || 0);
            valB = (b.stakedSol || 0) * solPrice + (b.stakedUsdc || 0);
        } else {
            return 0;
        }
        if (valA < valB) return currentSortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return currentSortOrder === 'asc' ? 1 : -1;
        return 0;
    });
    changePage(1);
    updateSortIcons();
}

/**
 * Updates the sort icons in the table headers.
 */
function updateSortIcons() {
    document.querySelectorAll('#referralsTable th.sortable .sort-icon').forEach(icon => {
        icon.className = 'sort-icon fas'; // Reset icon
    });
    const activeHeader = document.querySelector(`#referralsTable th[data-sort-key="${currentSortKey}"] .sort-icon`);
    if (activeHeader) {
        activeHeader.classList.add(currentSortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down');
    }
}

/**
 * Обновляет отображение таблицы рефералов с учетом пагинации.
 */
function renderReferralsTable() {
    updateTotalStakeSummary();
    const referralsListBody = domElements.referralsList;
    if (!referralsListBody) return;
    referralsListBody.innerHTML = '';
    const trans = translations[currentLanguage];

    const totalItems = referralsData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    } else if (totalPages === 0) {
        currentPage = 1;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedReferrals = referralsData.slice(startIndex, endIndex);

    if (totalItems === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4" class="no-referrals-message">${trans.noReferrals}</td>`;
        referralsListBody.appendChild(row);
    } else {
        paginatedReferrals.forEach((referral, index) => {
            const row = document.createElement('tr');
            const numCell = document.createElement('td');
            numCell.textContent = startIndex + index + 1;

            const levelCell = document.createElement('td');
            levelCell.textContent = referral.level || 1;

            const summaryCell = document.createElement('td');
            summaryCell.className = 'stakes-summary';
            let summaryContent = [];
            if (referral.stakedSol > 0) { summaryContent.push(`<span>${solanaIconImg}${formatDisplayNumberCustom(referral.stakedSol, 5)}</span>`); }
            if (referral.stakedUsdc > 0) { summaryContent.push(`<span>${usdcIconImg}${formatDisplayNumberCustom(referral.stakedUsdc, 2)}</span>`); }
            summaryCell.innerHTML = summaryContent.length > 0 ? summaryContent.join(' ') : trans.refSummaryNone;

            const actionCell = document.createElement('td');
            actionCell.className = 'actions-cell';
            const editButton = document.createElement('button');
            editButton.textContent = trans.editButtonShort;
            editButton.className = 'action-button edit-button';
            editButton.onclick = () => openEditModal(referral.id);
            const removeButton = document.createElement('button');
            removeButton.textContent = trans.removeButtonShort;
            removeButton.className = 'action-button remove-button';
            removeButton.onclick = () => removeReferral(referral.id);
            actionCell.appendChild(editButton);
            actionCell.appendChild(removeButton);

            row.appendChild(numCell);
            row.appendChild(levelCell);
            row.appendChild(summaryCell);
            row.appendChild(actionCell);
            referralsListBody.appendChild(row);
        });
    }
    renderPaginationControls(totalPages);
}

/**
 * Рендерит кнопки управления пагинацией.
 * @param {number} totalPages - Общее количество страниц.
 */
function renderPaginationControls(totalPages) {
    const paginationContainer = domElements.paginationControls;
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';
    const trans = translations[currentLanguage];

    if (totalPages <= 1) return;

    const prevButton = document.createElement('button');
    prevButton.textContent = trans.paginationPrevious;
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => changePage(currentPage - 1);
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.onclick = () => changePage(i);
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = trans.paginationNext;
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => changePage(currentPage + 1);
    paginationContainer.appendChild(nextButton);
}

/**
 * Изменяет текущую страницу и перерисовывает таблицу.
 * @param {number} newPage - Номер страницы, на которую нужно перейти.
 */
function changePage(newPage) {
    const totalItems = referralsData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    if (newPage < 1) {
        newPage = 1;
    } else if (newPage > totalPages) {
        newPage = totalPages;
    }
    currentPage = newPage;
    renderReferralsTable();
}

// --- Modal Management Functions ---
/**
 * Открывает модальное окно для редактирования данных реферала.
 */
function openEditModal(referralId) {
    const modal = domElements.editReferralModal;
    const modalTitle = domElements.modalTitle;
    const editingIdInput = domElements.editingReferralId;
    const trans = translations[currentLanguage];
    const referral = referralsData.find(ref => ref.id === referralId);

    if (!referral || !modal || !modalTitle || !editingIdInput) return;

    const visualIndex = referralsData.findIndex(ref => ref.id === referralId) + 1;
    modalTitle.textContent = `${trans.modalTitlePrefix}${visualIndex}`;

    editingIdInput.value = referral.id;
    domElements.modalLevel.value = referral.level || 1;
    domElements.modalStakeSol.value = referral.stakedSol || 0;
    domElements.modalProfitSol.value = referral.profitPercentSol || 0;
    domElements.modalStakeUsdc.value = referral.stakedUsdc || 0;
    domElements.modalProfitUsdc.value = referral.profitPercentUsdc || 0;

    const modalLabels = [
        domElements.labelModalLevel, domElements.labelModalStakeSol, domElements.labelModalProfitSol,
        domElements.labelModalStakeUsdc, domElements.labelModalProfitUsdc
    ];
    const modalIcons = [null, solanaIconImg, solanaIconImg, usdcIconImg, usdcIconImg];

    modalLabels.forEach((label, index) => {
        if (label) {
            const icon = label.querySelector('img');
            if (icon) label.removeChild(icon);
            const key = label.id.replace('label-', '').replace(/-/g, '_');
            if (trans[key]) label.textContent = trans[key];
            if (modalIcons[index]) label.innerHTML += modalIcons[index];
        }
    });
    modal.classList.add('is-active');
}

/**
 * Закрывает модальное окно редактирования реферала.
 */
function closeEditModal() {
    if (domElements.editReferralModal) {
        domElements.editReferralModal.classList.remove('is-active');
    }
    if (domElements.editingReferralId) {
        domElements.editingReferralId.value = '';
    }
}

/**
 * Сохраняет измененные данные реферала из модального окна.
 */
function saveReferralData() {
    const editingId = parseInt(domElements.editingReferralId.value);
    if (isNaN(editingId)) return;
    const referralIndex = referralsData.findIndex(ref => ref.id === editingId);
    if (referralIndex === -1) return;

    const newLevel = parseInt(domElements.modalLevel.value) || 1;
    const newStakeSol = parseFloat(domElements.modalStakeSol.value) || 0;
    const newProfitSol = parseFloat(domElements.modalProfitSol.value) || 0;
    const newStakeUsdc = parseFloat(domElements.modalStakeUsdc.value) || 0;
    const newProfitUsdc = parseFloat(domElements.modalProfitUsdc.value) || 0;

    referralsData[referralIndex].level = (newLevel >= 1 && newLevel <= 7) ? newLevel : 1;
    referralsData[referralIndex].stakedSol = newStakeSol >= 0 ? newStakeSol : 0;
    referralsData[referralIndex].profitPercentSol = newProfitSol >= 0 ? newProfitSol : 0;
    referralsData[referralIndex].stakedUsdc = newStakeUsdc >= 0 ? newStakeUsdc : 0;
    referralsData[referralIndex].profitPercentUsdc = newProfitUsdc >= 0 ? newProfitUsdc : 0;

    saveData();
    renderReferralsTable();
    closeEditModal();
}

/**
 * Рассчитывает и отображает общий оборот по всем рефералам.
 */
function updateTotalStakeSummary() {
    const totalStakeElement = document.getElementById('referralsTotalStake');
    if (!totalStakeElement) return;

    const totalSol = referralsData.reduce((sum, ref) => sum + (ref.stakedSol || 0), 0);
    const totalUsdc = referralsData.reduce((sum, ref) => sum + (ref.stakedUsdc || 0), 0);

    const trans = translations[currentLanguage] || translations['en'];
    const turnoverLabel = trans.refStructureTurnover || 'Structure Turnover:';

    totalStakeElement.innerHTML = `
        ${turnoverLabel}
        <span>${solanaIconImg} ${formatDisplayNumberCustom(totalSol, 5)}</span>
        <span>${usdcIconImg} ${formatDisplayNumberCustom(totalUsdc, 2)}</span>
    `;
}

// --- Formatting Function ---
/**
 * Formats a number for display with custom separators (space for thousands, comma for decimal).
 * @param {number} number - The number to format.
 * @param {number} maximumFractionDigits - Maximum decimal places.
 * @returns {string} Formatted number string.
 */
function formatDisplayNumberCustom(number, maximumFractionDigits) {
    if (isNaN(number) || number === null) return '';
    if (Object.is(number, -0)) {
        number = 0;
    }
    const minimumFractionDigits = Math.min(2, maximumFractionDigits);
    let numStr = number.toFixed(maximumFractionDigits);
    let parts = numStr.split('.');
    let integerPart = parts[0];
    let fractionalPart = parts.length > 1 ? parts[1] : '';

    if (fractionalPart.length < minimumFractionDigits) {
        fractionalPart = fractionalPart.padEnd(minimumFractionDigits, '0');
    }
    if (fractionalPart.length > maximumFractionDigits) {
        fractionalPart = fractionalPart.substring(0, maximumFractionDigits);
    }
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return fractionalPart ? `${integerPart},${fractionalPart}` : integerPart;
}

// --- Fetch SOL Price Function ---
/**
 * Загружает текущую цену SOL/USD с CoinGecko API.
 */
async function fetchSolPrice() {
    const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd';
    const solInput = domElements.solToUsd;
    const statusElement = domElements.solPriceStatus;
    const trans = translations[currentLanguage];

    if (!solInput || !statusElement) return;

    statusElement.textContent = trans.statusLoading;
    statusElement.className = 'loading';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
        const data = await response.json();
        if (data && data.solana && data.solana.usd) {
            const price = data.solana.usd;
            solInput.value = price.toFixed(2);
            statusElement.textContent = trans.statusSuccess;
            statusElement.className = 'success';
            saveData();
        } else {
            throw new Error('Invalid API response structure');
        }
    } catch (error) {
        console.error('Ошибка загрузки цены SOL:', error);
        statusElement.textContent = trans.statusError;
        statusElement.className = 'error';
    } finally {
        setTimeout(() => {
            if (statusElement.className !== 'loading') {
                statusElement.textContent = '';
                statusElement.className = '';
            }
        }, 3000);
    }
}


// --- Calculation Logic ---

/**
 * Retrieves and validates all necessary input values from the DOM.
 * @param {object} trans - The translations object for error messages.
 * @returns {object|null} An object with parsed input values if valid, otherwise null.
 */
function getAndValidateInputs(trans) {
    const inputs = {
        userStakedSolAmount: parseFloat(domElements.userStakedSolAmount.value) || 0,
        userProfitPercentSol: parseFloat(domElements.userProfitPercentSol.value) || 0,
        userStakedUsdcAmount: parseFloat(domElements.userStakedUsdcAmount.value) || 0,
        userProfitPercentUsdc: parseFloat(domElements.userProfitPercentUsdc.value) || 0,
        days: parseInt(domElements.days.value) || 0,
        solToUsd: parseFloat(domElements.solToUsd.value) || 0,
        platformFee: parseFloat(domElements.platformFee.value) || 0,
        periodicSolAmount: parseFloat(domElements.periodicSolAmount.value) || 0,
        periodicSolPeriod: parseInt(domElements.periodicSolPeriod.value) || 0,
        periodicUsdcAmount: parseFloat(domElements.periodicUsdcAmount.value) || 0,
        periodicUsdcPeriod: parseInt(domElements.periodicUsdcPeriod.value) || 0,
        reinvestSolCheckbox: domElements.reinvestSolCheckbox.checked,
        reinvestSolPercent: parseFloat(domElements.reinvestSolPercent.value) || 0,
        reinvestUsdcCheckbox: domElements.reinvestUsdcCheckbox.checked,
        reinvestUsdcPercent: parseFloat(domElements.reinvestUsdcPercent.value) || 0,
        includeReferralsCheckbox: domElements.includeReferralsCheckbox.checked,
    };

    let isValid = true;
    clearAllValidationErrors();

    const fieldsToValidatePositiveOrZero = [
        'userStakedSolAmount', 'userProfitPercentSol', 'userStakedUsdcAmount', 'userProfitPercentUsdc',
        'solToUsd', 'platformFee', 'periodicSolAmount', 'periodicUsdcAmount'
    ];
    fieldsToValidatePositiveOrZero.forEach(key => {
        if (isNaN(inputs[key]) || inputs[key] < 0) {
            isValid = false;
            const elementKey = key.replace(/([A-Z])/g, '-$1').toLowerCase(); // Convert camelCase to kebab-case for ID
            domElements[elementKey]?.classList.add('input-error'); // Use optional chaining for safety
        }
    });


    if (isNaN(inputs.days) || inputs.days <= 0) {
        isValid = false;
        domElements.days.classList.add('input-error');
    }

    if (inputs.reinvestSolCheckbox && (isNaN(inputs.reinvestSolPercent) || inputs.reinvestSolPercent < 0 || inputs.reinvestSolPercent > 100)) {
        isValid = false;
        domElements.reinvestSolPercent.classList.add('input-error');
    }
    if (inputs.reinvestUsdcCheckbox && (isNaN(inputs.reinvestUsdcPercent) || inputs.reinvestUsdcPercent < 0 || inputs.reinvestUsdcPercent > 100)) {
        isValid = false;
        domElements.reinvestUsdcPercent.classList.add('input-error');
    }

    const needsSolUsdRate = (inputs.userStakedUsdcAmount > 0 || inputs.periodicUsdcAmount > 0 || (inputs.includeReferralsCheckbox && referralsData.some(ref => (ref.stakedUsdc || 0) > 0)));
    if (needsSolUsdRate && (isNaN(inputs.solToUsd) || inputs.solToUsd <= 0)) {
        isValid = false;
        domElements.solToUsd.classList.add('input-error');
    }

    if (!isValid) {
        clearResults();
        if (balanceChartInstance) { balanceChartInstance.destroy(); balanceChartInstance = null; }
        return null;
    }

    inputs.platformFeeRate = inputs.platformFee / 100;
    inputs.userProfitRateSol = inputs.userProfitPercentSol / 100;
    inputs.userProfitRateUsdc = inputs.userProfitPercentUsdc / 100;
    inputs.reinvestSolPercentRate = inputs.reinvestSolCheckbox ? inputs.reinvestSolPercent / 100 : 0;
    inputs.reinvestUsdcPercentRate = inputs.reinvestUsdcCheckbox ? inputs.reinvestUsdcPercent / 100 : 0;

    return inputs;
}

/**
 * Calculates the initial daily referral profits.
 * @param {Array} referralsData - Array of referral objects.
 * @param {number} platformFeeRate - The platform fee rate (e.g., 0.1 for 10%).
 * @param {object} commissionRates - Object mapping referral level to commission rate.
 * @param {boolean} referralsEnabled - Whether referrals are included in calculation.
 * @returns {{dailyNetProfit_RefSol: number, dailyNetProfit_RefUsdc: number}}
 */
function calculateInitialDailyReferralProfits(referralsData, platformFeeRate, commissionRates, referralsEnabled) {
    let dailyNetProfit_RefSol = 0;
    let dailyNetProfit_RefUsdc = 0;

    if (referralsEnabled && referralsData) {
        referralsData.forEach(referral => {
            const level = referral.level || 1;
            const commissionRate = commissionRates[level] || 0;
            if (referral.stakedSol > 0 && referral.profitPercentSol > 0 && commissionRate > 0) {
                const grossProfit = referral.stakedSol * (referral.profitPercentSol / 100);
                const fee = grossProfit * platformFeeRate;
                dailyNetProfit_RefSol += ((grossProfit - fee) * commissionRate);
            }
            if (referral.stakedUsdc > 0 && referral.profitPercentUsdc > 0 && commissionRate > 0) {
                const grossProfit = referral.stakedUsdc * (referral.profitPercentUsdc / 100);
                const fee = grossProfit * platformFeeRate;
                dailyNetProfit_RefUsdc += ((grossProfit - fee) * commissionRate);
            }
        });
    }
    return { dailyNetProfit_RefSol, dailyNetProfit_RefUsdc };
}

/**
 * Performs the daily simulation of stake growth and reinvestment with cumulative reinvest logic.
 * @param {object} params - Object containing all necessary calculation parameters.
 * @returns {object} An object with simulation results.
 */
function simulateDailyGrowthAndReinvestment(params) {
    let currentSolStake = params.initialUserStakedSol;
    let currentUsdcStake = params.initialUserStakedUsdc;

    let accumulatedSolProfit_nonReinvested_direct = 0;
    let accumulatedUsdcProfit_nonReinvested_direct = 0;

    let pendingReinvestmentSol = 0;
    let pendingReinvestmentUsdc = 0;

    let totalSolProfitEarned = 0;
    let totalUsdcProfitEarned = 0;
    let totalPeriodicSolAdded = 0;
    let totalPeriodicUsdcAdded = 0;
    const chartLabels = [];
    const chartDataUsd = [];
    let solDoubledWithReinvestDay = -1;
    let usdcDoubledWithReinvestDay = -1;

    for (let day = 1; day <= params.days; day++) {
        if (params.periodicSolAmount > 0 && params.periodicSolPeriod > 0 && day % params.periodicSolPeriod === 0) {
            currentSolStake += params.periodicSolAmount;
            totalPeriodicSolAdded += params.periodicSolAmount;
        }
        if (params.periodicUsdcAmount > 0 && params.periodicUsdcPeriod > 0 && day % params.periodicUsdcPeriod === 0) {
            currentUsdcStake += params.periodicUsdcAmount;
            totalPeriodicUsdcAdded += params.periodicUsdcAmount;
        }

        const profitTodaySol_User = currentSolStake * params.userProfitRateSol * (1 - params.platformFeeRate);
        const profitTodayUsdc_User = currentUsdcStake * params.userProfitRateUsdc * (1 - params.platformFeeRate);
        const profitTodaySol_Total = profitTodaySol_User + params.dailyNetProfit_RefSol;
        const profitTodayUsdc_Total = profitTodayUsdc_User + params.dailyNetProfit_RefUsdc;

        totalSolProfitEarned += profitTodaySol_Total;
        totalUsdcProfitEarned += profitTodayUsdc_Total;

        if (params.reinvestSolCheckbox && params.reinvestSolPercentRate > 0) {
            const solPartForReinvest = profitTodaySol_Total * params.reinvestSolPercentRate;
            const solPartNotForReinvest = profitTodaySol_Total * (1 - params.reinvestSolPercentRate);
            pendingReinvestmentSol += solPartForReinvest;
            accumulatedSolProfit_nonReinvested_direct += solPartNotForReinvest;
            if (pendingReinvestmentSol >= REINVEST_THRESHOLD_SOL) {
                currentSolStake += pendingReinvestmentSol;
                pendingReinvestmentSol = 0;
            }
        } else {
            accumulatedSolProfit_nonReinvested_direct += profitTodaySol_Total;
        }

        if (params.reinvestUsdcCheckbox && params.reinvestUsdcPercentRate > 0) {
            const usdcPartForReinvest = profitTodayUsdc_Total * params.reinvestUsdcPercentRate;
            const usdcPartNotForReinvest = profitTodayUsdc_Total * (1 - params.reinvestUsdcPercentRate);
            pendingReinvestmentUsdc += usdcPartForReinvest;
            accumulatedUsdcProfit_nonReinvested_direct += usdcPartNotForReinvest;
            if (pendingReinvestmentUsdc >= REINVEST_THRESHOLD_USDC) {
                currentUsdcStake += pendingReinvestmentUsdc;
                pendingReinvestmentUsdc = 0;
            }
        } else {
            accumulatedUsdcProfit_nonReinvested_direct += profitTodayUsdc_Total;
        }

        const currentSolBalanceForChart = currentSolStake + accumulatedSolProfit_nonReinvested_direct + pendingReinvestmentSol;
        const currentUsdcBalanceForChart = currentUsdcStake + accumulatedUsdcProfit_nonReinvested_direct + pendingReinvestmentUsdc;

        if (solDoubledWithReinvestDay === -1 && params.initialUserStakedSol > 0 && currentSolBalanceForChart >= params.initialUserStakedSol * 2) {
            solDoubledWithReinvestDay = day;
        }
        if (usdcDoubledWithReinvestDay === -1 && params.initialUserStakedUsdc > 0 && currentUsdcBalanceForChart >= params.initialUserStakedUsdc * 2) {
            usdcDoubledWithReinvestDay = day;
        }

        const currentTotalBalanceUsd = (params.solToUsd > 0 ? currentSolBalanceForChart * params.solToUsd : 0) + currentUsdcBalanceForChart;
        chartLabels.push(day);
        chartDataUsd.push(currentTotalBalanceUsd);
    }

    const finalSolBalance = currentSolStake + accumulatedSolProfit_nonReinvested_direct + pendingReinvestmentSol;
    const finalUsdcBalance = currentUsdcStake + accumulatedUsdcProfit_nonReinvested_direct + pendingReinvestmentUsdc;

    return {
        finalSolStake: currentSolStake,
        finalUsdcStake: currentUsdcStake,
        totalSolProfitEarned,
        totalUsdcProfitEarned,
        totalPeriodicSolAdded,
        totalPeriodicUsdcAdded,
        chartLabels,
        chartDataUsd,
        solDoubledWithReinvestDay,
        usdcDoubledWithReinvestDay,
        finalSolBalance,
        finalUsdcBalance,
        pendingReinvestmentSol_final: pendingReinvestmentSol,
        pendingReinvestmentUsdc_final: pendingReinvestmentUsdc
    };
}

/**
 * Calculates the doubling time for a stake with cumulative reinvest logic.
 * @param {object} p - Parameters for calculation.
 * @param {string} currencyType - 'SOL' or 'USDC'.
 * @param {boolean} withReinvest - True if calculating with reinvestment.
 * @param {object} trans - Translations object.
 * @param {number} initialDailyReferralProfit - Daily referral profit for this currency.
 * @param {number} daysAlreadySimulatedForReinvest - Days already simulated if reinvest doubling wasn't met in main loop.
 * @returns {string|number} Number of days or a string indicating 'Never' or 'Over X days'.
 */
function calculateDoublingTime(p, currencyType, withReinvest, trans, initialDailyReferralProfit, daysAlreadySimulatedForReinvest = 0) {
    const initialStake = currencyType === 'SOL' ? p.initialUserStakedSol : p.initialUserStakedUsdc;
    const profitRate = currencyType === 'SOL' ? p.userProfitRateSol : p.userProfitRateUsdc;

    const actualReinvestEnabled = currencyType === 'SOL' ? p.reinvestSolCheckbox : p.reinvestUsdcCheckbox;

    const reinvestPercentRate = currencyType === 'SOL' ? p.reinvestSolPercentRate : p.reinvestUsdcPercentRate;
    const reinvestThreshold = currencyType === 'SOL' ? REINVEST_THRESHOLD_SOL : REINVEST_THRESHOLD_USDC;

    if (initialStake <= 0) return trans.roiNever;
    
    if (!withReinvest && profitRate <= 0 && initialDailyReferralProfit <= 0) return trans.roiNever;
    
    if (withReinvest && actualReinvestEnabled && reinvestPercentRate <= 0 && profitRate <= 0 && initialDailyReferralProfit <= 0) return trans.roiNever;


    if (!withReinvest) {
        const dailyNetProfit_User_Initial = initialStake * profitRate * (1 - p.platformFeeRate);
        const totalDailyProfit_NoReinvest = dailyNetProfit_User_Initial + initialDailyReferralProfit;
        if (totalDailyProfit_NoReinvest <= 0) return trans.roiNever;
        return Math.ceil(initialStake / totalDailyProfit_NoReinvest);
    } else {
        if (!actualReinvestEnabled) {
            return trans.reinvestOff || "Off"; 
        }

        if (daysAlreadySimulatedForReinvest > 0 && daysAlreadySimulatedForReinvest !== -1) {
            return daysAlreadySimulatedForReinvest;
        }

        if (reinvestPercentRate <= 0) {
             const dailyNetProfit_User_Initial = initialStake * profitRate * (1 - p.platformFeeRate);
             const totalDailyProfit_NoReinvest = dailyNetProfit_User_Initial + initialDailyReferralProfit;
             if (totalDailyProfit_NoReinvest <= 0) return trans.roiNever;
             return Math.ceil(initialStake / totalDailyProfit_NoReinvest);
        }

        let tempStake = initialStake;
        let tempAccumulatedNonReinvestDirect = 0;
        let tempPendingReinvestment = 0;
        const maxSimulationDays = Math.max(p.days > 0 ? p.days + 1 : 1, 365 * 20);

        for (let d = 1; d <= maxSimulationDays; d++) {
            let dailyProfitOnTempStake = tempStake * profitRate * (1 - p.platformFeeRate);
            let totalDailyTempProfit = dailyProfitOnTempStake + initialDailyReferralProfit;

            const partForReinvest = totalDailyTempProfit * reinvestPercentRate;
            const partNotForReinvest = totalDailyTempProfit * (1 - reinvestPercentRate);

            tempPendingReinvestment += partForReinvest;
            tempAccumulatedNonReinvestDirect += partNotForReinvest;

            if (tempPendingReinvestment >= reinvestThreshold) {
                tempStake += tempPendingReinvestment;
                tempPendingReinvestment = 0;
            }

            const currentTotalBalance = tempStake + tempAccumulatedNonReinvestDirect + tempPendingReinvestment;
            if (currentTotalBalance >= initialStake * 2) {
                return d;
            }
        }
        return trans.roiOverDays.replace('{days}', maxSimulationDays);
    }
}


/**
 * Updates the DOM with the calculated results.
 * @param {object} calcParams - Validated input parameters.
 * @param {object} simulationResults - Results from the daily simulation.
 * @param {object} referralProfits - Calculated daily referral profits.
 * @param {object} doublingTimes - Calculated doubling times.
 * @param {object} trans - Translations object.
 */
function updateDOMWithResults(calcParams, simulationResults, referralProfits, doublingTimes, trans) {
    const {
        finalSolBalance, finalUsdcBalance, totalSolProfitEarned, totalUsdcProfitEarned,
        totalPeriodicSolAdded, totalPeriodicUsdcAdded, chartDataUsd
    } = simulationResults;

    const totalReferralProfitOverPeriodSol = referralProfits.dailyNetProfit_RefSol * calcParams.days;
    const totalReferralProfitOverPeriodUsdc = referralProfits.dailyNetProfit_RefUsdc * calcParams.days;

    let userProfitSolDisplay = totalSolProfitEarned - totalReferralProfitOverPeriodSol;
    let userProfitUsdcDisplay = totalUsdcProfitEarned - totalReferralProfitOverPeriodUsdc;

    const epsilon = 1e-9;
    if (Math.abs(userProfitSolDisplay) < epsilon) userProfitSolDisplay = 0;
    if (Object.is(userProfitSolDisplay, -0)) userProfitSolDisplay = 0;
    if (Math.abs(userProfitUsdcDisplay) < epsilon) userProfitUsdcDisplay = 0;
    if (Object.is(userProfitUsdcDisplay, -0)) userProfitUsdcDisplay = 0;

    const profitPercentSolDisplay = calcParams.initialUserStakedSol > 0 ? (totalSolProfitEarned / calcParams.initialUserStakedSol) * 100 : 0;
    const profitPercentUsdcDisplay = calcParams.initialUserStakedUsdc > 0 ? (totalUsdcProfitEarned / calcParams.initialUserStakedUsdc) * 100 : 0;

    const finalUsdBalanceTotal = chartDataUsd.length > 0 ? chartDataUsd[chartDataUsd.length - 1] : (calcParams.initialUserStakedSol * (calcParams.solToUsd || 0) + calcParams.initialUserStakedUsdc);
    const totalProfitUsdDisplay = (calcParams.solToUsd > 0 ? totalSolProfitEarned * calcParams.solToUsd : 0) + totalUsdcProfitEarned;

    const updateResultSpan = (element, value, formatDigits, iconHtml = '', className = '') => {
        if (element) {
            let displayValue = (typeof value === 'number')
                ? formatDisplayNumberCustom(value, formatDigits) + (iconHtml || '')
                : value + (iconHtml || '');
            element.innerHTML = displayValue;
            element.className = 'value ' + (className || '');
        }
    };

    const daysSuffixText = ` ${trans.daysSuffix || 'days'}`;

    updateResultSpan(domElements.resultProfitUserSol, userProfitSolDisplay, 5, solanaIconImg, 'value-sol');
    updateResultSpan(domElements.resultProfitRefSol, totalReferralProfitOverPeriodSol, 5, solanaIconImg, 'value-sol');
    updateResultSpan(domElements.resultPeriodicTotalSol, totalPeriodicSolAdded, 5, solanaIconImg, 'value-sol');
    updateResultSpan(domElements.resultProfitTotalSol, totalSolProfitEarned, 5, solanaIconImg, 'value-sol');
    updateResultSpan(domElements.resultFinalBalanceSol, finalSolBalance, 5, solanaIconImg, 'value-sol');

    updateResultSpan(domElements.resultProfitUserUsdc, userProfitUsdcDisplay, 2, usdcIconImg, 'value-usdc');
    updateResultSpan(domElements.resultProfitRefUsdc, totalReferralProfitOverPeriodUsdc, 2, usdcIconImg, 'value-usdc');
    updateResultSpan(domElements.resultPeriodicTotalUsdc, totalPeriodicUsdcAdded, 2, usdcIconImg, 'value-usdc');
    updateResultSpan(domElements.resultProfitTotalUsdc, totalUsdcProfitEarned, 2, usdcIconImg, 'value-usdc');
    updateResultSpan(domElements.resultFinalBalanceUsdc, finalUsdcBalance, 2, usdcIconImg, 'value-usdc');

    updateResultSpan(domElements.resultProfitPercentSol, profitPercentSolDisplay, 2, ' %', 'profit-percent');
    updateResultSpan(domElements.resultProfitPercentUsdc, profitPercentUsdcDisplay, 2, ' %', 'profit-percent');

    updateResultSpan(domElements.resultDoubleSolNoreinvest, doublingTimes.solNoReinvest, 0, (typeof doublingTimes.solNoReinvest === 'number' ? daysSuffixText : ''), 'doubling');
    updateResultSpan(domElements.resultDoubleUsdcNoreinvest, doublingTimes.usdcNoReinvest, 0, (typeof doublingTimes.usdcNoReinvest === 'number' ? daysSuffixText : ''), 'doubling');
    updateResultSpan(domElements.resultDoubleSolReinvest, doublingTimes.solReinvest, 0, (typeof doublingTimes.solReinvest === 'number' ? daysSuffixText : ''), 'doubling');
    updateResultSpan(domElements.resultDoubleUsdcReinvest, doublingTimes.usdcReinvest, 0, (typeof doublingTimes.usdcReinvest === 'number' ? daysSuffixText : ''), 'doubling');

    updateResultSpan(domElements.resultFinalBalanceUsdTotal, finalUsdBalanceTotal, 2, ' $', 'balance-usd');
    updateResultSpan(domElements.resultProfitTotalUsd, totalProfitUsdDisplay, 2, ' $', 'balance-usd');
}

/**
 * Основная функция калькулятора.
 */
function calculate() {
    const trans = translations[currentLanguage];
    const validatedInputs = getAndValidateInputs(trans);

    if (!validatedInputs) {
        return;
    }

    const paramsForSimulation = {
        initialUserStakedSol: validatedInputs.userStakedSolAmount,
        userProfitRateSol: validatedInputs.userProfitRateSol,
        initialUserStakedUsdc: validatedInputs.userStakedUsdcAmount,
        userProfitRateUsdc: validatedInputs.userProfitRateUsdc,
        days: validatedInputs.days,
        platformFeeRate: validatedInputs.platformFeeRate,
        reinvestSolCheckbox: validatedInputs.reinvestSolCheckbox,
        reinvestSolPercentRate: validatedInputs.reinvestSolPercentRate,
        reinvestUsdcCheckbox: validatedInputs.reinvestUsdcCheckbox,
        reinvestUsdcPercentRate: validatedInputs.reinvestUsdcPercentRate,
        dailyNetProfit_RefSol: 0,
        dailyNetProfit_RefUsdc: 0,
        periodicSolAmount: validatedInputs.periodicSolAmount,
        periodicSolPeriod: validatedInputs.periodicSolPeriod,
        periodicUsdcAmount: validatedInputs.periodicUsdcAmount,
        periodicUsdcPeriod: validatedInputs.periodicUsdcPeriod,
        solToUsd: validatedInputs.solToUsd,
    };

    const referralProfits = calculateInitialDailyReferralProfits(
        referralsData,
        paramsForSimulation.platformFeeRate,
        commissionRates,
        validatedInputs.includeReferralsCheckbox
    );
    paramsForSimulation.dailyNetProfit_RefSol = referralProfits.dailyNetProfit_RefSol;
    paramsForSimulation.dailyNetProfit_RefUsdc = referralProfits.dailyNetProfit_RefUsdc;

    const simulationResults = simulateDailyGrowthAndReinvestment(paramsForSimulation);

    const doublingTimes = {
        solNoReinvest: calculateDoublingTime(paramsForSimulation, 'SOL', false, trans, referralProfits.dailyNetProfit_RefSol),
        usdcNoReinvest: calculateDoublingTime(paramsForSimulation, 'USDC', false, trans, referralProfits.dailyNetProfit_RefUsdc),
        solReinvest: calculateDoublingTime(paramsForSimulation, 'SOL', true, trans, referralProfits.dailyNetProfit_RefSol, simulationResults.solDoubledWithReinvestDay),
        usdcReinvest: calculateDoublingTime(paramsForSimulation, 'USDC', true, trans, referralProfits.dailyNetProfit_RefUsdc, simulationResults.usdcDoubledWithReinvestDay)
    };

    updateDOMWithResults(paramsForSimulation, simulationResults, referralProfits, doublingTimes, trans);

    if (typeof renderBalanceChart === 'function' && domElements.balanceChart) {
        renderBalanceChart(simulationResults.chartLabels, simulationResults.chartDataUsd);
    }
    if (typeof saveData === 'function') {
        saveData();
    }
}

/**
 * Очищает все поля результатов, график и сбрасывает классы.
 */
function clearResults() {
    const resetResultSpan = (element, defaultValue, defaultIconHtml = '', defaultClassName = 'value') => {
        if (element) {
            element.innerHTML = defaultValue + (defaultIconHtml || '');
            element.className = 'value ' + defaultClassName;
        }
    };
    const trans = translations[currentLanguage];

    resetResultSpan(domElements.resultProfitUserSol, formatDisplayNumberCustom(0, 5), solanaIconImg, 'value-sol');
    resetResultSpan(domElements.resultProfitRefSol, formatDisplayNumberCustom(0, 5), solanaIconImg, 'value-sol');
    resetResultSpan(domElements.resultPeriodicTotalSol, formatDisplayNumberCustom(0, 5), solanaIconImg, 'value-sol');
    resetResultSpan(domElements.resultProfitTotalSol, formatDisplayNumberCustom(0, 5), solanaIconImg, 'value-sol');
    resetResultSpan(domElements.resultFinalBalanceSol, formatDisplayNumberCustom(0, 5), solanaIconImg, 'value-sol');

    resetResultSpan(domElements.resultProfitUserUsdc, formatDisplayNumberCustom(0, 2), usdcIconImg, 'value-usdc');
    resetResultSpan(domElements.resultProfitRefUsdc, formatDisplayNumberCustom(0, 2), usdcIconImg, 'value-usdc');
    resetResultSpan(domElements.resultPeriodicTotalUsdc, formatDisplayNumberCustom(0, 2), usdcIconImg, 'value-usdc');
    resetResultSpan(domElements.resultProfitTotalUsdc, formatDisplayNumberCustom(0, 2), usdcIconImg, 'value-usdc');
    resetResultSpan(domElements.resultFinalBalanceUsdc, formatDisplayNumberCustom(0, 2), usdcIconImg, 'value-usdc');

    resetResultSpan(domElements.resultProfitPercentSol, formatDisplayNumberCustom(0, 2), ' %', 'profit-percent');
    resetResultSpan(domElements.resultProfitPercentUsdc, formatDisplayNumberCustom(0, 2), ' %', 'profit-percent');
    resetResultSpan(domElements.resultDoubleSolNoreinvest, trans.roiNever || 'N/A', '', 'doubling');
    resetResultSpan(domElements.resultDoubleUsdcNoreinvest, trans.roiNever || 'N/A', '', 'doubling');
    resetResultSpan(domElements.resultDoubleSolReinvest, trans.roiNever || 'N/A', '', 'doubling');
    resetResultSpan(domElements.resultDoubleUsdcReinvest, trans.roiNever || 'N/A', '', 'doubling');
    resetResultSpan(domElements.resultFinalBalanceUsdTotal, formatDisplayNumberCustom(0, 2), ' $', 'balance-usd');
    resetResultSpan(domElements.resultProfitTotalUsd, formatDisplayNumberCustom(0, 2), ' $', 'balance-usd');

    if (balanceChartInstance) {
        balanceChartInstance.destroy();
        balanceChartInstance = null;
    }
}
/**
 * Сбрасывает все поля ввода, рефералов и результаты к значениям по умолчанию.
 */
function resetCalculator() {
    domElements.userStakedSolAmount.value = '0';
    domElements.userProfitPercentSol.value = '0';
    domElements.userStakedUsdcAmount.value = '0';
    domElements.userProfitPercentUsdc.value = '0';
    domElements.platformFee.value = '10';
    domElements.solToUsd.value = '0';
    domElements.days.value = '0';
    domElements.periodicSolAmount.value = '0';
    domElements.periodicSolPeriod.value = '0';
    domElements.periodicUsdcAmount.value = '0';
    domElements.periodicUsdcPeriod.value = '0';

    if (domElements.reinvestSolCheckbox) {
        domElements.reinvestSolCheckbox.checked = true;
    }
    if (domElements.reinvestSolPercent) {
        domElements.reinvestSolPercent.value = '100';
    }
    if (domElements.reinvestSolCheckbox) {
        toggleReinvestControls(domElements.reinvestSolCheckbox);
    }

    if (domElements.reinvestUsdcCheckbox) {
        domElements.reinvestUsdcCheckbox.checked = true;
    }
    if (domElements.reinvestUsdcPercent) {
        domElements.reinvestUsdcPercent.value = '100';
    }
    if (domElements.reinvestUsdcCheckbox) {
        toggleReinvestControls(domElements.reinvestUsdcCheckbox);
    }

    if (domElements.includeReferralsCheckbox) {
        domElements.includeReferralsCheckbox.checked = true;
    }

    currentPage = 1;
    referralsData = [];
    nextReferralId = 1;
    renderReferralsTable();

    clearResults();
    clearAllValidationErrors();
    resetConverter();

    saveData();
}

/**
 * Очищает все сообщения об ошибках валидации и рамки.
 */
function clearAllValidationErrors() {
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

/**
 * Удаляет ошибку валидации для конкретного поля ввода при изменении его значения.
 */
function clearValidationError(event) {
    const inputElement = event.target;
    inputElement.classList.remove('input-error');
}

// --- Collapsible Section Functions ---
/**
 * Toggles the visibility of a collapsible section.
 * @param {HTMLElement} sectionElement - The main section element.
 * @param {string} storageKey - The localStorage key to save the state.
 */
function toggleCollapsibleSection(sectionElement, storageKey) {
    if (!sectionElement) return;
    sectionElement.classList.toggle('collapsed');
    localStorage.setItem(storageKey, sectionElement.classList.contains('collapsed').toString());

    if (storageKey === 'fomoFarmCalc_chartCollapsed' && !sectionElement.classList.contains('collapsed') && balanceChartInstance) {
        balanceChartInstance.resize();
    }
}


// --- Chart Rendering Function ---
/**
 * Рендерит график баланса с использованием Chart.js.
 */
function renderBalanceChart(originalLabels, originalUsdData) {
    const canvasElement = domElements.balanceChart;
    if (!canvasElement) {
        return;
    }
    const ctx = canvasElement.getContext('2d');
    if (balanceChartInstance) { balanceChartInstance.destroy(); }

    const numDays = originalLabels.length;
    if (numDays === 0) return;

    let stepSize = 1;
    if (numDays > 365) { stepSize = 30; }
    else if (numDays > 180) { stepSize = 14; }
    else if (numDays > 90) { stepSize = 7; }
    else if (numDays > 60) { stepSize = 3; }
    else if (numDays > 30) { stepSize = 2; }

    const filteredLabels = [];
    const filteredUsdData = [];

    if (numDays > 0) {
        filteredLabels.push(originalLabels[0]);
        filteredUsdData.push(originalUsdData[0]);
        for (let i = stepSize; i < numDays; i += stepSize) {
            filteredLabels.push(originalLabels[i -1]);
            filteredUsdData.push(originalUsdData[i-1]);
        }
        const lastOriginalIndex = numDays - 1;
        if (filteredLabels.length === 0 || filteredLabels[filteredLabels.length - 1] !== originalLabels[lastOriginalIndex]) {
            if (stepSize > 1 || filteredLabels.length === 0 || (filteredLabels.length > 0 && filteredLabels[filteredLabels.length -1] < originalLabels[lastOriginalIndex] )) {
                 filteredLabels.push(originalLabels[lastOriginalIndex]);
                 filteredUsdData.push(originalUsdData[lastOriginalIndex]);
            }
        }
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(74, 222, 128, 0.3)');
    gradient.addColorStop(1, 'rgba(74, 222, 128, 0)');

    balanceChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: filteredLabels,
            datasets: [{
                label: 'Total Balance (USD)',
                data: filteredUsdData,
                borderColor: '#4ade80',
                backgroundColor: gradient,
                fill: true,
                borderWidth: 2,
                tension: 0.1,
                pointRadius: numDays > 90 ? 0 : 2,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#4ade80'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { color: '#9ca3af' }, grid: { color: 'rgba(156, 163, 175, 0.2)' } },
                x: { ticks: { color: '#9ca3af', autoSkip: false, maxRotation: 0, minRotation: 0 }, grid: { display: false } }
            },
            plugins: { legend: { labels: { color: '#e5e7eb' } } },
            hover: { mode: 'nearest', intersect: true }
        }
    });
}

// --- Currency Converter Functions ---
/**
 * Заполняет выпадающие списки валют конвертера.
 */
function populateCurrencyDropdowns() {
    const fromSelect = domElements.convertFrom;
    const toSelect = domElements.convertTo;
    if (!fromSelect || !toSelect) return;

    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';

    converterCurrencies.forEach(currency => {
        const optionFrom = document.createElement('option');
        optionFrom.value = currency.id;
        optionFrom.textContent = `${currency.symbol || currency.id.toUpperCase()}`;
        optionFrom.title = currency.name;
        fromSelect.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = currency.id;
        optionTo.textContent = `${currency.symbol || currency.id.toUpperCase()}`;
        optionTo.title = currency.name;
        toSelect.appendChild(optionTo);
    });

    fromSelect.value = 'solana';
    toSelect.value = 'usd';
}

/**
 * Выполняет конвертацию валют с использованием CoinGecko API (с debounce).
 */
function triggerConversion(direction = 'from') {
    if (direction === 'from' || direction === 'to') {
        lastConversionDirection = direction;
    }
    clearTimeout(conversionTimeout);

    conversionTimeout = setTimeout(async () => {
        const fromInput = domElements.convertAmountFrom;
        const toInput = domElements.convertResultAmount;
        const fromSelect = domElements.convertFrom;
        const toSelect = domElements.convertTo;
        const statusSpan = domElements.converterStatus;
        const trans = translations[currentLanguage];

        if (!fromInput || !toInput || !fromSelect || !toSelect || !statusSpan) return;

        let sourceInput, targetInput, sourceSelect, targetSelect;

        if (lastConversionDirection === 'from') {
            sourceInput = fromInput;
            targetInput = toInput;
            sourceSelect = fromSelect;
            targetSelect = toSelect;
        } else { // direction === 'to'
            sourceInput = toInput;
            targetInput = fromInput;
            sourceSelect = toSelect;
            targetSelect = fromSelect;
        }
        
        const amount = parseFloat(String(sourceInput.value).replace(/ /g, '').replace(',', '.'));
        const fromId = sourceSelect.value;
        const toId = targetSelect.value;
        const fromType = getCurrencyType(fromId);
        const toType = getCurrencyType(toId);

        sourceInput.classList.remove('input-error');
        statusSpan.textContent = '';
        statusSpan.className = '';

        if (isNaN(amount) || amount < 0) {
            if(document.activeElement === sourceInput) {
                sourceInput.classList.add('input-error');
                statusSpan.textContent = trans.convertErrorInvalidAmount;
                statusSpan.className = 'error';
            }
            return;
        }

        if (fromId === toId) {
            targetInput.value = formatDisplayNumberCustom(amount, fromType === 'crypto' ? 5 : 2);
            return;
        }
        
        if (amount === 0) {
            targetInput.value = formatDisplayNumberCustom(0, toType === 'crypto' ? 5 : 2);
            return;
        }

        statusSpan.textContent = trans.convertStatusLoading;
        statusSpan.className = 'loading';

        try {
            let rate;
            if (fromType === 'fiat' && toType === 'fiat') {
                const rateUsdFrom = await fetchCoinPrice('usd', fromId);
                const rateUsdTo = await fetchCoinPrice('usd', toId);
                if (rateUsdFrom === 0) throw new Error(`Cannot divide by zero rate for USD/${fromId}`);
                rate = rateUsdTo / rateUsdFrom;
            } else if (fromType === 'crypto' && toType === 'crypto') {
                const [rateFromUsd, rateToUsd] = await Promise.all([
                    fetchCoinPrice(fromId, 'usd'),
                    fetchCoinPrice(toId, 'usd')
                ]);
                if (rateToUsd === 0) throw new Error(`Cannot divide by zero rate for ${toId}/USD`);
                rate = rateFromUsd / rateToUsd;
            } else if (fromType === 'fiat' && toType === 'crypto') {
                const directRate = await fetchCoinPrice(toId, fromId);
                if (directRate === 0) throw new Error(`API returned zero rate for ${toId}/${fromId}`);
                rate = 1 / directRate;
            } else { // crypto to fiat
                rate = await fetchCoinPrice(fromId, toId);
            }

            const convertedAmount = amount * rate;
            targetInput.value = formatDisplayNumberCustom(convertedAmount, toType === 'crypto' ? 5 : 2);
            statusSpan.textContent = trans.convertStatusSuccess;
            statusSpan.className = 'success';

        } catch (error) {
            console.error('Ошибка конвертации валюты:', error);
            let userErrorMessage = trans.convertErrorApi;
            if (error.message && error.message.includes('missing data')) {
                userErrorMessage = trans.convertErrorPairNotFound || 'Currency pair not found.';
            } else if (error.message && !error.message.startsWith('HTTP error')) {
                userErrorMessage = error.message;
            }
            statusSpan.textContent = userErrorMessage;
            statusSpan.className = 'error';
            targetInput.value = '';
        } finally {
            setTimeout(() => {
                if (statusSpan.className !== 'loading') {
                    statusSpan.textContent = '';
                    statusSpan.className = '';
                }
            }, 3000);
        }
    }, CONVERSION_DEBOUNCE_DELAY);
}

/**
 * Helper function to fetch price for a single pair from CoinGecko.
 */
async function fetchCoinPrice(primaryId, secondaryId) {
    const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${primaryId}&vs_currencies=${secondaryId}`;
    let responseDataText = "";
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            let errorDetails = `HTTP error! status: ${response.status}`;
            try {
                responseDataText = await response.text();
                const errorData = JSON.parse(responseDataText);
                if (errorData && errorData.error) {
                    errorDetails += ` - ${errorData.error}`;
                }
            } catch (e) {
                errorDetails += ` - Unable to parse error response: ${responseDataText.substring(0, 100)}`;
            }
            throw new Error(errorDetails);
        }
        const data = await response.json();
        if (!data || !data[primaryId] || data[primaryId][secondaryId] === undefined || data[primaryId][secondaryId] === null) {
            throw new Error(`missing data for ${secondaryId} against ${primaryId}`);
        }
        return data[primaryId][secondaryId];
    } catch (error) {
        console.error(`Failed to fetch price for ${primaryId}/${secondaryId}:`, error.message);
        throw error;
    }
}

/**
 * Меняет местами выбранные валюты и запускает конвертацию.
 */
function swapCurrencies() {
    const fromSelect = domElements.convertFrom;
    const toSelect = domElements.convertTo;
    const fromInput = domElements.convertAmountFrom;
    const toInput = domElements.convertResultAmount;

    if (!fromSelect || !toSelect || !fromInput || !toInput) return;

    // Меняем местами выбранные валюты в выпадающих списках
    [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];

    // Меняем местами значения в полях ввода
    [fromInput.value, toInput.value] = [toInput.value, fromInput.value];
}

// --- Export/Import Functions ---
/**
 * Экспортирует текущие данные калькулятора в JSON файл.
 */
function exportData() {
    try {
        const exportObj = {
            userStakedSolAmount: domElements.userStakedSolAmount.value, userProfitPercentSol: domElements.userProfitPercentSol.value,
            userStakedUsdcAmount: domElements.userStakedUsdcAmount.value, userProfitPercentUsdc: domElements.userProfitPercentUsdc.value,
            platformFee: domElements.platformFee.value, solToUsd: domElements.solToUsd.value, days: domElements.days.value,
            periodicSolAmount: domElements.periodicSolAmount.value, periodicSolPeriod: domElements.periodicSolPeriod.value,
            periodicUsdcAmount: domElements.periodicUsdcAmount.value, periodicUsdcPeriod: domElements.periodicUsdcPeriod.value,
            reinvestSol: domElements.reinvestSolCheckbox.checked.toString(),
            reinvestSolPercent: domElements.reinvestSolPercent.value,
            reinvestUsdc: domElements.reinvestUsdcCheckbox.checked.toString(),
            reinvestUsdcPercent: domElements.reinvestUsdcPercent.value,
            includeReferrals: domElements.includeReferralsCheckbox.checked,
            referralsData: referralsData, nextReferralId: nextReferralId,
            referralsCollapsed: domElements.referralsSection?.classList.contains('collapsed') || false,
            chartCollapsed: domElements.chartSection?.classList.contains('collapsed') || false,
            converterCollapsed: domElements.converterSection?.classList.contains('collapsed') || false,
            currentLanguage: currentLanguage
        };
        const dataStr = JSON.stringify(exportObj, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'fomofarm_calculator_data.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Ошибка экспорта данных:", error);
    }
}

/**
 * Обрабатывает импорт данных из выбранного JSON файла.
 */
function importData(event) {
    const file = event.target.files[0];
    if (!file) { return; }
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (!importedData || typeof importedData !== 'object' || !importedData.hasOwnProperty('referralsData')) {
                throw new Error("Неверный формат файла.");
            }

            domElements.userStakedSolAmount.value = importedData.userStakedSolAmount || '0';
            domElements.userProfitPercentSol.value = importedData.userProfitPercentSol || '0';
            domElements.userStakedUsdcAmount.value = importedData.userStakedUsdcAmount || '0';
            domElements.userProfitPercentUsdc.value = importedData.userProfitPercentUsdc || '0';
            domElements.platformFee.value = importedData.platformFee || '10';
            domElements.solToUsd.value = importedData.solToUsd || '0';
            domElements.days.value = importedData.days || '0';
            domElements.periodicSolAmount.value = importedData.periodicSolAmount || '0';
            domElements.periodicSolPeriod.value = importedData.periodicSolPeriod || '0';
            domElements.periodicUsdcAmount.value = importedData.periodicUsdcAmount || '0';
            domElements.periodicUsdcPeriod.value = importedData.periodicUsdcPeriod || '0';
            domElements.reinvestSolCheckbox.checked = (importedData.reinvestSol || 'true') === 'true';
            domElements.reinvestSolPercent.value = importedData.reinvestSolPercent || '100';
            domElements.reinvestUsdcCheckbox.checked = (importedData.reinvestUsdc || 'true') === 'true';
            domElements.reinvestUsdcPercent.value = importedData.reinvestUsdcPercent || '100';
            domElements.includeReferralsCheckbox.checked = importedData.includeReferrals === true || importedData.includeReferrals === 'true';

            currentPage = 1;
            if (domElements.reinvestSolCheckbox) toggleReinvestControls(domElements.reinvestSolCheckbox);
            if (domElements.reinvestUsdcCheckbox) toggleReinvestControls(domElements.reinvestUsdcCheckbox);


            if (Array.isArray(importedData.referralsData)) {
                referralsData = importedData.referralsData.filter(ref => typeof ref === 'object' && ref !== null && ref.hasOwnProperty('id'));
                referralsData.forEach(ref => {
                    ref.level = ref.level || 1;
                    ref.stakedSol = ref.stakedSol || 0; ref.profitPercentSol = ref.profitPercentSol || 0;
                    ref.stakedUsdc = ref.stakedUsdc || 0; ref.profitPercentUsdc = ref.profitPercentUsdc || 0;
                });
            } else { referralsData = []; }

            const maxId = referralsData.reduce((max, ref) => Math.max(max, ref.id || 0), 0);
            nextReferralId = Math.max(maxId + 1, parseInt(importedData.nextReferralId) || 1);

            if (domElements.referralsSection) domElements.referralsSection.classList.toggle('collapsed', importedData.referralsCollapsed === true || importedData.referralsCollapsed === 'true');
            if (domElements.chartSection) domElements.chartSection.classList.toggle('collapsed', importedData.chartCollapsed === true || importedData.chartCollapsed === 'true');
            if (domElements.converterSection) domElements.converterSection.classList.toggle('collapsed', importedData.converterCollapsed === true || importedData.converterCollapsed === 'true');

            currentLanguage = importedData.currentLanguage || 'en';

            updateUI(currentLanguage);
            renderReferralsTable();
            clearResults();
            resetConverter();
            saveData();
        } catch (error) {
            console.error("Ошибка импорта данных:", error);
        } finally {
            event.target.value = null;
        }
    };
    reader.readAsText(file);
}


// --- Reinvest Percentage Toggle ---
function toggleReinvestControls(checkboxElement) {
    if (!checkboxElement || typeof checkboxElement.closest !== 'function') {
        return;
    }
    const parentItem = checkboxElement.closest('.checkbox-item.reinvest-control-group');
    if (parentItem) {
        parentItem.classList.toggle('reinvest-active', checkboxElement.checked);
    }
    const percentInput = parentItem.querySelector('.reinvest-percent-input');
    if (percentInput) {
        percentInput.disabled = !checkboxElement.checked;
    }
}


// --- Event Listener Setup ---
/**
 * Устанавливает все необходимые обработчики событий.
 */
function setupEventListeners() {
    const idsToCache = [
        'userStakedSolAmount', 'userProfitPercentSol', 'userStakedUsdcAmount', 'userProfitPercentUsdc',
        'platformFee', 'solToUsd', 'days', 'periodicSolAmount', 'periodicSolPeriod',
        'periodicUsdcAmount', 'periodicUsdcPeriod',
        'reinvestSolCheckbox', 'label-reinvest-sol', 'reinvestSolPercent',
        'reinvestUsdcCheckbox', 'label-reinvest-usdc', 'reinvestUsdcPercent',
        'includeReferralsCheckbox', 'referralsList', 'editReferralModal', 'modalTitle',
        'editingReferralId', 'modal-level', 'modal-stake-sol', 'modal-profit-sol',
        'modal-stake-usdc', 'modal-profit-usdc', 'balanceChart', 'convertAmountFrom',
        'convertFrom', 'convertTo', 'convertResultAmount',
        'converterStatus', 'solPriceStatus',
        'walletAddress',
        'copyWalletButton',
        'copyStatus',
        'supportSection',
        'result-profit-user-sol', 'result-profit-user-usdc', 'result-profit-ref-sol',
        'result-profit-ref-usdc', 'result-profit-total-sol', 'result-profit-total-usdc',
        'result-profit-percent-sol', 'result-profit-percent-usdc', 'result-double-sol-noreinvest',
        'result-double-usdc-noreinvest', 'result-double-sol-reinvest', 'result-double-usdc-reinvest',
        'result-periodic-total-sol', 'result-periodic-total-usdc', 'result-final-balance-sol',
        'result-final-balance-usdc', 'result-final-balance-usd-total', 'result-profit-total-usd',
        'label-user-staked-sol', 'label-user-staked-usdc', 'label-user-profit-percent-sol',
        'label-user-profit-percent-usdc', 'label-periodic-sol', 'label-periodic-usdc',
        'label-modal-stake-sol', 'label-modal-profit-sol', 'label-modal-stake-usdc',
        'label-modal-profit-usdc', 'label-modal-level',
        'referralsSection', 'chartSection', 'converterSection', 'paginationControls',
        'referralsHeader', 'chartHeader', 'converterHeader', 'importFile'
    ];
    idsToCache.forEach(id => domElements[id.replace(/-([a-z])/g, g => g[1].toUpperCase())] = document.getElementById(id));


    document.querySelectorAll('.input-group input, .input-group select, .checkbox-container input[type="number"]').forEach(element => {
        element.addEventListener('change', saveData);
        element.addEventListener('input', clearValidationError);
    });
    document.querySelectorAll('.checkbox-container input[type="checkbox"]').forEach(element => {
        element.addEventListener('change', saveData);
    });

    domElements.reinvestSolCheckbox?.addEventListener('change', function () {
        toggleReinvestControls(this);
        saveData();
    });
    domElements.reinvestSolPercent?.addEventListener('change', saveData);
    domElements.reinvestSolPercent?.addEventListener('input', clearValidationError);

    domElements.reinvestUsdcCheckbox?.addEventListener('change', function () {
        toggleReinvestControls(this);
        saveData();
    });
    domElements.reinvestUsdcPercent?.addEventListener('change', saveData);
    domElements.reinvestUsdcPercent?.addEventListener('input', clearValidationError);

    domElements.convertAmountFrom?.addEventListener('input', () => triggerConversion('from'));
    domElements.convertResultAmount?.addEventListener('input', () => triggerConversion('to'));
    domElements.convertFrom?.addEventListener('change', () => triggerConversion(lastConversionDirection));
    domElements.convertTo?.addEventListener('change', () => triggerConversion(lastConversionDirection));

    document.getElementById('swapCurrenciesButton')?.addEventListener('click', swapCurrencies);

    document.getElementById('languageToggleButton').addEventListener('click', toggleLanguage);
    document.getElementById('addReferralButton').addEventListener('click', addReferral);
    document.getElementById('saveReferralButton').addEventListener('click', saveReferralData);
    document.getElementById('cancelReferralButton').addEventListener('click', closeEditModal);
    domElements.editReferralModal?.addEventListener('click', (event) => {
        if (event.target === event.currentTarget) { closeEditModal(); }
    });
    document.getElementById('calculateButton').addEventListener('click', calculate);
    document.getElementById('fetchSolPriceButton').addEventListener('click', fetchSolPrice);
    document.getElementById('resetButton').addEventListener('click', resetCalculator);
    document.getElementById('exportButton').addEventListener('click', exportData);
    document.getElementById('importButton').addEventListener('click', () => domElements.importFile.click());
    domElements.importFile?.addEventListener('change', importData);
    domElements.copyWalletButton?.addEventListener('click', copyWalletAddress);

    domElements.referralsHeader?.addEventListener('click', () => toggleCollapsibleSection(domElements.referralsSection, 'fomoFarmCalc_referralsCollapsed'));
    domElements.chartHeader?.addEventListener('click', () => toggleCollapsibleSection(domElements.chartSection, 'fomoFarmCalc_chartCollapsed'));
    domElements.converterHeader?.addEventListener('click', () => toggleCollapsibleSection(domElements.converterSection, 'fomoFarmCalc_converterCollapsed'));

    document.querySelectorAll('#referralsTable th.sortable').forEach(header => {
        header.addEventListener('click', () => sortReferrals(header.dataset.sortKey));
    });
}

/**
 * Сбрасывает поля конвертера к значениям по умолчанию.
 */
function resetConverter() {
    const amountInput = domElements.convertAmountFrom;
    const resultInput = domElements.convertResultAmount;
    const statusSpan = domElements.converterStatus;
    const fromSelect = domElements.convertFrom;
    const toSelect = domElements.convertTo;

    if (amountInput) amountInput.value = '1';
    if (resultInput) resultInput.value = '';
    if (statusSpan) {
        statusSpan.textContent = '';
        statusSpan.className = '';
    }
    if (amountInput) amountInput.classList.remove('input-error');
    if (fromSelect) fromSelect.value = 'solana';
    if (toSelect) toSelect.value = 'usd';
    triggerConversion();
}

/**
 * Копирует адрес кошелька в буфер обмена и меняет иконку на галочку.
 */
async function copyWalletAddress() {
    const walletAddressElement = domElements.walletAddress;
    const copyButton = domElements.copyWalletButton;
    const copyStatus = domElements.copyStatus;

    if (!walletAddressElement || !copyButton || !copyStatus) return;
    const address = walletAddressElement.textContent;

    try {
        await navigator.clipboard.writeText(address);
        
        const icon = copyButton.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-copy');
            icon.classList.add('fa-check');
            icon.classList.add('success');
        }

        setTimeout(() => {
            if (icon) {
                icon.classList.remove('fa-check');
                icon.classList.add('fa-copy');
                icon.classList.remove('success');
            }
        }, 1500);
    } catch (err) {
        console.error('Ошибка копирования в буфер обмена:', err);
        copyStatus.textContent = 'Error!';
        copyStatus.classList.add('visible', 'error');
        
        setTimeout(() => {
            copyStatus.textContent = '';
            copyStatus.classList.remove('visible', 'error');
        }, 2000);
    }
}

// --- Initialization ---
/**
 * Инициализация калькулятора при загрузке DOM.
 */
document.addEventListener('DOMContentLoaded', function () {
    setupEventListeners();
    const appVersionDisplay = document.getElementById('appVersionDisplay');
    if (appVersionDisplay) {
        appVersionDisplay.textContent = `v${APP_VERSION}`;
    }
    currentLanguage = localStorage.getItem('fomoFarmCalc_language') || 'en';
    loadData();
    populateCurrencyDropdowns();
    updateUI(currentLanguage);
    clearResults();
    renderReferralsTable();
    triggerConversion();
});