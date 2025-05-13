// --- DOM Element Cache ---
const domElements = {}; // Object to cache DOM elements

// --- Global Variables & Constants ---
const APP_VERSION = "3.1";
let currentPage = 1;
const itemsPerPage = 10;
let referralsData = [];
let nextReferralId = 1;
let currentLanguage = 'en';
let balanceChartInstance = null;
let conversionTimeout = null;
const CONVERSION_DEBOUNCE_DELAY = 500;
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
        labelSupportAuthor: 'Support the author',
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
        labelProfitPercentSol: 'Profit SOL (% of initial):', labelProfitPercentUsdc: 'Profit USDC (% of initial):',
        h4DoublingTime: 'Doubling Time (100% Profit)',
        labelDoubleSolNoreinvest: 'SOL Doubling (No Reinvest):', labelDoubleUsdcNoreinvest: 'USDC Doubling (No Reinvest):',
        labelDoubleSolReinvest: 'SOL Doubling (With Reinvest):', labelDoubleUsdcReinvest: 'USDC Doubling (With Reinvest):',
        h4PeriodicTotal: 'Total Add. Investments', labelPeriodicTotalSol: 'Added Investments:', labelPeriodicTotalUsdc: 'Added Investments:',
        h4FinalBalance: 'Final Balance', labelFinalBalanceSol: 'Final Balance SOL:', labelFinalBalanceUsdc: 'Final Balance USDC:',
        labelFinalBalanceUsd: 'Total Final Balance (USD):',
        labelProfitTotalUsd: 'Total Profit (USD):',
        tooltipProfitUserSol: 'Your net profit from SOL stake after fees', tooltipProfitUserUsdc: 'Your net profit from USDC stake after fees',
        tooltipProfitRefSol: 'Your profit from referral SOL stakes', tooltipProfitRefUsdc: 'Your profit from referral USDC stakes',
        tooltipPeriodicTotalSol: 'Total additional SOL invested periodically', tooltipPeriodicTotalUsdc: 'Total additional USDC invested periodically',
        tooltipProfitTotalSol: 'Total SOL profit (yours + referrals)', tooltipProfitTotalUsdc: 'Total USDC profit (yours + referrals)',
        tooltipFinalBalanceSol: 'Initial stake + total profit + additional investments', tooltipFinalBalanceUsdc: 'Initial stake + total profit + additional investments',
        tooltipFinalBalanceUsd: 'Total final balance of SOL and USDC converted to USD', tooltipProfitTotalUsd: 'Total profit of SOL and USDC converted to USD',
        tooltipProfitPercentSol: 'Total SOL profit as a percentage of initial SOL stake', tooltipProfitPercentUsdc: 'Total USDC profit as a percentage of initial USDC stake',
        tooltipDoubleSolNoreinvest: 'Approximate days to double initial SOL stake without reinvesting profits', tooltipDoubleUsdcNoreinvest: 'Approximate days to double initial USDC stake without reinvesting profits',
        tooltipDoubleSolReinvest: 'Approximate days to double initial SOL stake with reinvesting profits', tooltipDoubleUsdcReinvest: 'Approximate days to double initial USDC stake with reinvesting profits',
        tooltipPlatformFee: 'Platform commission percentage',
        roiNever: 'Never', roiOverDays: 'Over {days} days', daysSuffix: ' days',
        reinvestOff: 'Off',
        invalidInputError: 'Please enter valid values for Stakes, Rates, Days, and SOL/USD Rate.',
        solUsdRateError: 'SOL/USD rate must be greater than 0 to calculate profit from USDC stakes.',
        h3ConverterTitle: 'Currency Converter',
        h3ChartTitle: 'Profitability (USD)',
        swapButtonTitle: 'Swap currencies',
        convertStatusLoading: 'Converting...',
        convertStatusSuccess: 'Success!',
        convertStatusError: 'Error',
        convertErrorInvalidAmount: 'Invalid amount.',
        convertErrorApi: 'API Error.',
        convertErrorPairNotFound: 'Currency pair not found.',
        convertErrorSameCurrency: 'Cannot convert to the same currency.',
        convertErrorFiatToFiat: 'Direct fiat-to-fiat conversion not supported.',
        h4SolResults: 'SOL Results', h4UsdcResults: 'USDC Results', h4GeneralResults: 'General Results'
    },
    'ru': {
        labelUserStakedSol: 'Вложено', labelUserProfitPercentSol: 'Профит % / день', labelUserStakedUsdc: 'Вложено', labelUserProfitPercentUsdc: 'Профит % / день',
        labelPlatformFee: 'Комиссия FomoFarm %', labelSolUsd: 'SOL / USD', labelDays: 'Дней',
        labelPeriodicSol: 'Довложения', labelPeriodicUsdc: 'Довложения',
        optionNo: 'Нет', optionWeekly: 'Раз в неделю', optionMonthly: 'Раз в месяц', optionQuarterly: 'Раз в 3 месяца',
        fetchSolPriceButton: 'Обновить', statusLoading: 'Загрузка...', statusSuccess: 'Успешно!', statusError: 'Ошибка',
        labelEnableReferrals: 'Рефералы', calculate: 'Рассчитать',
        labelSupportAuthor: 'Поддержать автора',
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
        labelProfitPercentSol: 'Профит SOL (% от нач.):', labelProfitPercentUsdc: 'Профит USDC (% от нач.):',
        h4DoublingTime: 'Время удвоения (100% Профит)',
        labelDoubleSolNoreinvest: 'Удвоение SOL (Без реинв.):', labelDoubleUsdcNoreinvest: 'Удвоение USDC (Без реинв.):',
        labelDoubleSolReinvest: 'Удвоение SOL (С реинв.):', labelDoubleUsdcReinvest: 'Удвоение USDC (С реинв.):',
        h4PeriodicTotal: 'Всего довложений', labelPeriodicTotalSol: 'Довложено:', labelPeriodicTotalUsdc: 'Довложено:',
        h4FinalBalance: 'Итоговый баланс', labelFinalBalanceSol: 'Итоговый Баланс SOL:', labelFinalBalanceUsdc: 'Итоговый Баланс USDC:',
        labelFinalBalanceUsd: 'Общий Итоговый Баланс (USD):',
        labelProfitTotalUsd: 'Общий Профит (USD):',
        tooltipProfitUserSol: 'Ваш чистый профит от стейка SOL после комиссий', tooltipProfitUserUsdc: 'Ваш чистый профит от стейка USDC после комиссий',
        tooltipProfitRefSol: 'Ваш профит от стейков SOL рефералов', tooltipProfitRefUsdc: 'Ваш профит от стейков USDC рефералов',
        tooltipPeriodicTotalSol: 'Всего дополнительно вложено SOL периодически', tooltipPeriodicTotalUsdc: 'Всего дополнительно вложено USDC периодически',
        tooltipProfitTotalSol: 'Общий профит SOL (ваш + рефералов)', tooltipProfitTotalUsdc: 'Общий профит USDC (ваш + рефералов)',
        tooltipFinalBalanceSol: 'Начальный стейк + общий профит + довложения', tooltipFinalBalanceUsdc: 'Начальный стейк + общий профит + довложения',
        tooltipFinalBalanceUsd: 'Общий итоговый баланс SOL и USDC, конвертированный в USD', tooltipProfitTotalUsd: 'Общий профит SOL и USDC, конвертированный в USD',
        tooltipProfitPercentSol: 'Общий профит SOL в процентах от начального стейка SOL', tooltipProfitPercentUsdc: 'Общий профит USDC в процентах от начального стейка USDC',
        tooltipDoubleSolNoreinvest: 'Примерное кол-во дней для удвоения нач. стейка SOL без реинвестирования', tooltipDoubleUsdcNoreinvest: 'Примерное кол-во дней для удвоения нач. стейка USDC без реинвестирования',
        tooltipDoubleSolReinvest: 'Примерное кол-во дней для удвоения нач. стейка SOL с реинвестированием', tooltipDoubleUsdcReinvest: 'Примерное кол-во дней для удвоения нач. стейка USDC с реинвестированием',
        tooltipPlatformFee: 'Процент комиссии платформы',
        roiNever: 'Никогда', roiOverDays: 'Более {days} дн.', daysSuffix: ' дн.',
        reinvestOff: 'Выкл.',
        invalidInputError: 'Пожалуйста, введите корректные значения для Стейков, Процентов, Дней и Курса SOL/USD.',
        solUsdRateError: 'Курс SOL/USD должен быть больше 0 для расчета дохода со стейков в USDC.',
        h3ConverterTitle: 'Конвертер Валют',
        h3ChartTitle: 'График Доходности (USD)',
        swapButtonTitle: 'Поменять валюты',
        convertStatusLoading: 'Конвертация...',
        convertStatusSuccess: 'Успешно!',
        convertStatusError: 'Ошибка',
        convertErrorInvalidAmount: 'Неверная сумма.',
        convertErrorApi: 'Ошибка API.',
        convertErrorPairNotFound: 'Валютная пара не найдена.',
        convertErrorSameCurrency: 'Нельзя конвертировать в ту же валюту.',
        convertErrorFiatToFiat: 'Прямая конвертация фиат-фиат не поддерживается.',
        h4SolResults: 'Результаты SOL', h4UsdcResults: 'Результаты USDC', h4GeneralResults: 'Общие Результаты'
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
        'tooltip-profit-sol': 'tooltipProfitSol', 'tooltip-profit-usdc': 'tooltipProfitUsdc', 'tooltip-platform-fee': 'tooltipPlatformFee',
        'h3-converter-title': 'h3ConverterTitle', 'h3-chart-title': 'h3ChartTitle', 'h3-referrals-text': 'h3Referrals',
        'swapCurrenciesButton': 'swapButtonTitle',
        'tooltip-profit-user-sol': 'tooltipProfitUserSol', 'tooltip-profit-user-usdc': 'tooltipProfitUserUsdc',
        'tooltip-profit-ref-sol': 'tooltipProfitRefSol', 'tooltip-profit-ref-usdc': 'tooltipProfitRefUsdc',
        'tooltip-periodic-total-sol': 'tooltipPeriodicTotalSol', 'tooltip-periodic-total-usdc': 'tooltipPeriodicTotalUsdc',
        'tooltip-profit-total-sol': 'tooltipProfitTotalSol', 'tooltip-profit-total-usdc': 'tooltipProfitTotalUsdc',
        'tooltip-final-balance-sol': 'tooltipFinalBalanceSol', 'tooltip-final-balance-usdc': 'tooltipFinalBalanceUsdc',
        'tooltip-final-balance-usd': 'tooltipFinalBalanceUsd', 'tooltip-profit-total-usd': 'tooltipProfitTotalUsd',
        'tooltip-profit-percent-sol': 'tooltipProfitPercentSol', 'tooltip-profit-percent-usdc': 'tooltipProfitPercentUsdc',
        'tooltip-double-sol-noreinvest': 'tooltipDoubleSolNoreinvest', 'tooltip-double-usdc-noreinvest': 'tooltipDoubleUsdcNoreinvest',
        'tooltip-double-sol-reinvest': 'tooltipDoubleSolReinvest', 'tooltip-double-usdc-reinvest': 'tooltipDoubleUsdcReinvest',
        'h4-sol-results': 'h4SolResults', 'h4-usdc-results': 'h4UsdcResults', 'h4-general-results': 'h4GeneralResults'
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
                const existingTooltipContainer = element.querySelector('.tooltip-container');
                if (existingTooltipContainer) {
                    existingTooltipContainer.remove();
                }
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
                            if (existingTooltipContainer) {
                                element.appendChild(document.createTextNode(' '));
                            }
                        }
                    }
                }
                if (existingTooltipContainer) {
                    element.appendChild(existingTooltipContainer);
                }
            } else if (element.classList.contains('tooltip-text')) {
                element.textContent = translatedText;
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
        const imgInSolLabel = labelReinvestSol.querySelector('img');
        if (imgInSolLabel) {
            imgInSolLabel.style.verticalAlign = 'middle';
            imgInSolLabel.style.marginLeft = '4px';
        }
    }

    const labelReinvestUsdc = domElements.labelReinvestUsdc;
    if (labelReinvestUsdc) {
        labelReinvestUsdc.innerHTML = `${reinvestText} ${usdcIconImg}`;
        const imgInUsdcLabel = labelReinvestUsdc.querySelector('img');
        if (imgInUsdcLabel) {
            imgInUsdcLabel.style.verticalAlign = 'middle';
            imgInUsdcLabel.style.marginLeft = '4px';
        }
    }

    if (domElements.solPriceStatus) { domElements.solPriceStatus.textContent = ''; domElements.solPriceStatus.className = ''; }
    if (domElements.converterStatus) { domElements.converterStatus.textContent = ''; domElements.converterStatus.className = ''; }
    if (domElements.convertResultAmount) { domElements.convertResultAmount.value = ''; }

    renderReferralsTable();
    updateSortIcons();
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
        row.innerHTML = `<td colspan="4" style="text-align:center; color:#6b7280;">${trans.noReferrals}</td>`;
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
    const paginationContainer = document.getElementById('paginationControls');
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
    modal.style.display = 'flex';
}

/**
 * Закрывает модальное окно редактирования реферала.
 */
function closeEditModal() {
    if (domElements.editReferralModal) { domElements.editReferralModal.style.display = 'none'; }
    if (domElements.editingReferralId) { domElements.editingReferralId.value = ''; }
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
        clearResults(trans.invalidInputError);
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

    // console.log("--- Starting Daily Loop (Cumulative Reinvest) ---");
    // console.log(`Initial SOL Stake: ${currentSolStake.toFixed(5)}, Initial USDC Stake: ${currentUsdcStake.toFixed(5)}`);
    // console.log(`SOL Reinvest: ${params.reinvestSolCheckbox}, %: ${params.reinvestSolPercentRate*100}, Threshold: ${REINVEST_THRESHOLD_SOL}`);
    // console.log(`USDC Reinvest: ${params.reinvestUsdcCheckbox}, %: ${params.reinvestUsdcPercentRate*100}, Threshold: ${REINVEST_THRESHOLD_USDC}`);

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
                // console.log(`Day ${day} SOL Reinvested: ${pendingReinvestmentSol.toFixed(5)}. New Stake: ${currentSolStake.toFixed(5)}`);
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
                // console.log(`Day ${day} USDC Reinvested: ${pendingReinvestmentUsdc.toFixed(5)}. New Stake: ${currentUsdcStake.toFixed(5)}`);
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
    // console.log("--- End of Daily Loop (Cumulative Reinvest) ---");
    // console.log(`Final SOL Stake: ${currentSolStake.toFixed(5)}, Pending SOL Reinvest: ${pendingReinvestmentSol.toFixed(5)}, Accumulated Non-Reinvest Direct SOL: ${accumulatedSolProfit_nonReinvested_direct.toFixed(5)}`);
    // console.log(`Final USDC Stake: ${currentUsdcStake.toFixed(5)}, Pending USDC Reinvest: ${pendingReinvestmentUsdc.toFixed(5)}, Accumulated Non-Reinvest Direct USDC: ${accumulatedUsdcProfit_nonReinvested_direct.toFixed(5)}`);

    const finalSolBalance = currentSolStake + accumulatedSolProfit_nonReinvested_direct + pendingReinvestmentSol;
    const finalUsdcBalance = currentUsdcStake + accumulatedUsdcProfit_nonReinvested_direct + pendingReinvestmentUsdc;

    return {
        finalSolStake: currentSolStake,
        finalUsdcStake: currentUsdcStake,
        accumulatedSolProfit_nonReinvested: accumulatedSolProfit_nonReinvested_direct + pendingReinvestmentSol,
        accumulatedUsdcProfit_nonReinvested: accumulatedUsdcProfit_nonReinvested_direct + pendingReinvestmentUsdc,
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

    // Получаем актуальное состояние чекбокса реинвеста для ДАННОЙ валюты из параметров 'p'
    // 'p' - это объект paramsForSimulation, который содержит validatedInputs,
    // а validatedInputs.reinvestSolCheckbox и .reinvestUsdcCheckbox - это boolean значения .checked
    const actualReinvestEnabled = currencyType === 'SOL' ? p.reinvestSolCheckbox : p.reinvestUsdcCheckbox;

    const reinvestPercentRate = currencyType === 'SOL' ? p.reinvestSolPercentRate : p.reinvestUsdcPercentRate;
    const reinvestThreshold = currencyType === 'SOL' ? REINVEST_THRESHOLD_SOL : REINVEST_THRESHOLD_USDC;

    // Базовые проверки
    if (initialStake <= 0) return trans.roiNever;
    
    // Если НЕ считаем с реинвестом, И нет ни профита от стейка, ни реферального профита, то "Никогда"
    if (!withReinvest && profitRate <= 0 && initialDailyReferralProfit <= 0) return trans.roiNever;
    
    // Если СЧИТАЕМ с реинвестом, И реинвест ФАКТИЧЕСКИ включен пользователем, И процент реинвеста 0, И нет ни профита от стейка, ни реферального, то "Никогда"
    if (withReinvest && actualReinvestEnabled && reinvestPercentRate <= 0 && profitRate <= 0 && initialDailyReferralProfit <= 0) return trans.roiNever;


    if (!withReinvest) { // Логика для расчета "Без реинвеста"
        const dailyNetProfit_User_Initial = initialStake * profitRate * (1 - p.platformFeeRate);
        const totalDailyProfit_NoReinvest = dailyNetProfit_User_Initial + initialDailyReferralProfit;
        if (totalDailyProfit_NoReinvest <= 0) return trans.roiNever;
        return Math.ceil(initialStake / totalDailyProfit_NoReinvest);
    } else { // Логика для расчета "С реинвестом"
        // Если мы рассчитываем "With Reinvest", но сам чекбокс реинвеста для этой валюты ВЫКЛЮЧЕН пользователем,
        // то отображаем "Off" / "Выкл."
        if (!actualReinvestEnabled) {
            // Убедитесь, что 'reinvestOff' есть в translations и trans передан корректно
            return trans.reinvestOff || "Off"; 
        }

        // Если удвоение уже произошло в основном цикле симуляции и это значение передано
        if (daysAlreadySimulatedForReinvest > 0 && daysAlreadySimulatedForReinvest !== -1) {
            return daysAlreadySimulatedForReinvest;
        }

        // Если процент реинвеста 0 (но сам реинвест как опция может быть включен),
        // то время удвоения будет как без реинвеста (или "Никогда", если нет общей прибыли)
        // Эта проверка важна, так как actualReinvestEnabled может быть true, но процент 0
        if (reinvestPercentRate <= 0) {
             const dailyNetProfit_User_Initial = initialStake * profitRate * (1 - p.platformFeeRate);
             const totalDailyProfit_NoReinvest = dailyNetProfit_User_Initial + initialDailyReferralProfit;
             if (totalDailyProfit_NoReinvest <= 0) return trans.roiNever;
             return Math.ceil(initialStake / totalDailyProfit_NoReinvest);
        }

        // Симуляция для удвоения с реинвестом (если не произошло в основном цикле и процент реинвеста > 0)
        let tempStake = initialStake;
        let tempAccumulatedNonReinvestDirect = 0;
        let tempPendingReinvestment = 0;
        const maxSimulationDays = Math.max(p.days > 0 ? p.days + 1 : 1, 365 * 20); // Симулируем до 20 лет

        for (let d = 1; d <= maxSimulationDays; d++) {
            let dailyProfitOnTempStake = tempStake * profitRate * (1 - p.platformFeeRate);
            let totalDailyTempProfit = dailyProfitOnTempStake + initialDailyReferralProfit;

            // Логика реинвеста (должна совпадать с simulateDailyGrowthAndReinvestment)
            // actualReinvestEnabled здесь уже true, и reinvestPercentRate > 0
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
                return d; // Возвращаем количество дней
            }
        }
        return trans.roiOverDays.replace('{days}', maxSimulationDays); // Если за maxSimulationDays не удвоилось
    }
}


/**
 * Updates the DOM with the calculated results.
 * @param {object} inputs - Validated input parameters (renamed to 'calcParams' to avoid conflict with global 'inputs' if any).
 * @param {object} simulationResults - Results from the daily simulation.
 * @param {object} referralProfits - Calculated daily referral profits.
 * @param {object} doublingTimes - Calculated doubling times.
 * @param {object} trans - Translations object.
 */
function updateDOMWithResults(calcParams, simulationResults, referralProfits, doublingTimes, trans) {
    const {
        finalSolBalance, finalUsdcBalance, totalSolProfitEarned, totalUsdcProfitEarned,
        totalPeriodicSolAdded, totalPeriodicUsdcAdded, chartDataUsd,
        accumulatedSolProfit_nonReinvested, accumulatedUsdcProfit_nonReinvested // Используем эти для общего профита
    } = simulationResults;

    const totalReferralProfitOverPeriodSol = referralProfits.dailyNetProfit_RefSol * calcParams.days;
    const totalReferralProfitOverPeriodUsdc = referralProfits.dailyNetProfit_RefUsdc * calcParams.days;

    // Прибыль пользователя = Общая прибыль - Реферальная прибыль
    // Общая прибыль (totalSolProfitEarned) уже включает в себя и прибыль со стейка и реферальную.
    // Поэтому, чтобы получить прибыль ТОЛЬКО со стейка пользователя, вычитаем реферальную.
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
    // console.log("Calculate function called with cumulative reinvest logic!"); // Раскомментируйте для отладки
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
 * @param {string} [message=""] - An optional message to log to the console.
 */
function clearResults(message = "") {
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
    if (message) { console.warn(message); }
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
        // console.error("Элемент canvas для графика не найден!"); // Раскомментируйте для отладки
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
            plugins: { legend: { labels: { color: '#e5e7eb' } }, tooltip: { mode: 'index', intersect: false } },
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
function triggerConversion() {
    clearTimeout(conversionTimeout);
    conversionTimeout = setTimeout(async () => {
        const amountInput = domElements.convertAmountFrom;
        const fromSelect = domElements.convertFrom;
        const toSelect = domElements.convertTo;
        const resultInput = domElements.convertResultAmount;
        const statusSpan = domElements.converterStatus;
        const trans = translations[currentLanguage];

        if (!amountInput || !fromSelect || !toSelect || !resultInput || !statusSpan) return;

        const amount = parseFloat(amountInput.value);
        const fromId = fromSelect.value;
        const toId = toSelect.value;
        const fromType = getCurrencyType(fromId);
        const toType = getCurrencyType(toId);

        amountInput.classList.remove('input-error');
        resultInput.value = '';
        statusSpan.textContent = '';
        statusSpan.className = '';

        if (isNaN(amount) || amount < 0) {
            amountInput.classList.add('input-error');
            statusSpan.textContent = trans.convertErrorInvalidAmount;
            statusSpan.className = 'error';
            return;
        }
        if (fromId === toId) {
            statusSpan.textContent = trans.convertErrorSameCurrency;
            statusSpan.className = 'error';
            resultInput.value = formatDisplayNumberCustom(amount, fromType === 'crypto' ? 5 : 2);
            return;
        }
        if (fromType === 'fiat' && toType === 'fiat') {
            // console.log(`Converting ${fromId} to ${toId} via USD (Fiat-Fiat)`); // Раскомментируйте для отладки
            statusSpan.textContent = trans.convertStatusLoading;
            statusSpan.className = 'loading';
            try {
                const rateUsdFrom = await fetchCoinPrice('usd', fromId);
                const rateUsdTo = await fetchCoinPrice('usd', toId);
                if (rateUsdFrom === 0) throw new Error(`Cannot divide by zero rate for USD/${fromId}`);
                const rate = rateUsdTo / rateUsdFrom;
                const convertedAmount = amount * rate;
                resultInput.value = formatDisplayNumberCustom(convertedAmount, 2);
                statusSpan.textContent = trans.convertStatusSuccess;
                statusSpan.className = 'success';
            } catch (error) {
                console.error('Ошибка конвертации фиат-фиат:', error);
                let userErrorMessage = trans.convertErrorApi;
                if (error.message && error.message.includes('missing data')) {
                    userErrorMessage = trans.convertErrorPairNotFound || 'Currency pair not found.';
                } else if (error.message && !error.message.startsWith('HTTP error')) {
                    userErrorMessage = error.message;
                }
                statusSpan.textContent = userErrorMessage;
                statusSpan.className = 'error';
                resultInput.value = '';
            } finally {
                setTimeout(() => {
                    if (statusSpan.className !== 'loading') {
                        statusSpan.textContent = '';
                        statusSpan.className = '';
                    }
                }, 3000);
            }
            return;
        }
        if (amount === 0) {
            resultInput.value = formatDisplayNumberCustom(0, toType === 'crypto' ? 5 : 2);
            return;
        }

        statusSpan.textContent = trans.convertStatusLoading;
        statusSpan.className = 'loading';

        try {
            let rate;
            if (fromType === 'crypto' && toType === 'crypto') {
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
            } else {
                rate = await fetchCoinPrice(fromId, toId);
            }
            const convertedAmount = amount * rate;
            resultInput.value = formatDisplayNumberCustom(convertedAmount, toType === 'crypto' ? 5 : 2);
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
            resultInput.value = '';
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
    const amountInput = domElements.convertAmountFrom;
    const resultInput = domElements.convertResultAmount;

    if (!fromSelect || !toSelect || !amountInput || !resultInput) return;

    const tempCurrency = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = tempCurrency;

    const resultValueStr = resultInput.value.replace(/\s/g, '').replace(',', '.');
    const resultValue = parseFloat(resultValueStr);

    if (!isNaN(resultValue)) {
        amountInput.value = resultValue;
        resultInput.value = '';
    } else {
        amountInput.value = '1';
        resultInput.value = '';
    }
    triggerConversion();
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
        // alert("Ошибка экспорта данных. См. консоль для деталей."); // Используйте более мягкое уведомление, если возможно
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

            // alert("Данные успешно импортированы!"); // Используйте более мягкое уведомление
        } catch (error) {
            console.error("Ошибка импорта данных:", error);
            // alert("Ошибка импорта файла. Убедитесь, что это действительный JSON экспорт из этого калькулятора.");
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
    if (!parentItem) {
        return;
    }
    const percentInput = parentItem.querySelector('.reinvest-percent-input');
    const percentSymbol = parentItem.querySelector('.reinvest-percent-symbol');

    if (checkboxElement && percentInput && percentSymbol) {
        const shouldShow = checkboxElement.checked;
        // Используем классы для управления видимостью, если планируется анимация
        // В данном случае, возвращаемся к прямому управлению display для простоты, так как анимацию отменили
        percentInput.style.display = shouldShow ? 'inline-block' : 'none';
        percentSymbol.style.display = shouldShow ? 'inline-block' : 'none';
        percentInput.disabled = !shouldShow;
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
        'referralsSection', 'chartSection', 'converterSection'
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

    domElements.convertAmountFrom?.addEventListener('input', triggerConversion);
    domElements.convertFrom?.addEventListener('change', triggerConversion);
    domElements.convertTo?.addEventListener('change', triggerConversion);
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
    document.getElementById('importButton').addEventListener('click', () => document.getElementById('importFile').click());
    document.getElementById('importFile').addEventListener('change', importData);
    domElements.copyWalletButton?.addEventListener('click', copyWalletAddress);

    document.getElementById('referralsHeader')?.addEventListener('click', () => toggleCollapsibleSection(domElements.referralsSection, 'fomoFarmCalc_referralsCollapsed'));
    document.getElementById('chartHeader')?.addEventListener('click', () => toggleCollapsibleSection(domElements.chartSection, 'fomoFarmCalc_chartCollapsed'));
    document.getElementById('converterHeader')?.addEventListener('click', () => toggleCollapsibleSection(domElements.converterSection, 'fomoFarmCalc_converterCollapsed'));

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
 * Копирует адрес кошелька в буфер обмена и показывает подтверждение.
 */
async function copyWalletAddress() {
    const walletAddressElement = domElements.walletAddress;
    const copyButton = domElements.copyWalletButton;
    const copyStatus = domElements.copyStatus;
    const trans = translations[currentLanguage];

    if (!walletAddressElement || !copyButton || !copyStatus) return;
    const address = walletAddressElement.textContent;

    try {
        await navigator.clipboard.writeText(address);
        copyStatus.textContent = trans.copiedMessage;
        copyStatus.style.display = 'inline';
        const icon = copyButton.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-copy');
            icon.classList.add('fa-check');
            icon.style.color = '#4ade80';
        }
        setTimeout(() => {
            copyStatus.textContent = '';
            copyStatus.style.display = 'none';
            if (icon) {
                icon.classList.remove('fa-check');
                icon.classList.add('fa-copy');
                icon.style.color = '';
            }
        }, 1500);
    } catch (err) {
        console.error('Ошибка копирования в буфер обмена:', err);
        copyStatus.textContent = 'Error!';
        copyStatus.style.display = 'inline';
        copyStatus.style.color = '#ef4444';
        setTimeout(() => {
            copyStatus.textContent = '';
            copyStatus.style.display = 'none';
            copyStatus.style.color = '#4ade80';
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
