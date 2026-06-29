"use client";

import React, { useState } from 'react';
import { Minus, Plus, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type ExplorerTab = 'add-sub' | 'mul-div' | 'fractions' | 'parentheses';

interface BasicMathExplorerProps {
  initialTab?: ExplorerTab;
  initialMode?: 'add' | 'sub' | 'mul' | 'div';
  initialNumA?: number;
  initialNumB?: number;
  gradeLevel?: 'middle_school' | 'high_school' | 'university';
}

interface TranslationSet {
  incompatibleTitle: string;
  incompatibleText: string;
  incompatibleSuggestion: string;
  explorerTitle: string;
  explorerSubtitle: string;
  tabAddSub: string;
  tabMulDiv: string;
  tabFractions: string;
  tabParentheses: string;
  mode: string;
  addition: string;
  subtraction: string;
  firstNumber: string;
  secondNumber: string;
  objectsToAdd: string;
  tactileObjects: string;
  graduatedAxis: string;
  verify: string;
  greatJob: (numA: number, op: string, numB: number, correctVal: number) => string;
  notQuite: string;
  multiplication: string;
  division: string;
  rowsGroups: string;
  columnsSize: string;
  totalToDistribute: string;
  divisorGroups: string;
  multiplicationGrid: (rows: number, cols: number) => string;
  fairDistribution: (total: number, groups: number) => string;
  groupLabel: (num: number) => string;
  remainderText: (rem: number) => string;
  awesomeFeedback: (expr: string, val: number) => string;
  tryAgainGrid: string;
  numerator: string;
  denominator: string;
  circularPie: string;
  writtenFraction: string;
  fractionExpl: (num: number, den: number) => string;
  decimalValue: (val: string) => string;
  fundamentalRule: string;
  parenthesesExpl: string;
  riddleOfDay: string;
  step1Expl: string;
  solveStep1: string;
  yourAnswer: string;
  parenthesesSuccess: string;
  parenthesesIncorrect: string;
}

const TRANSLATIONS: Record<string, TranslationSet> = {
  EN: {
    incompatibleTitle: "Incompatible Grade Level",
    incompatibleText: "This basic math exploration module is designed for middle and high school students. The concepts covered (fractions, basic arithmetic) are not suited for university level.",
    incompatibleSuggestion: "💡 Suggestion for Level 3 Agent: Please use <FunctionPlotter />, <FunctionManipulator />, or <EquationManipulator /> for university level.",
    explorerTitle: "Basic Math Explorer",
    explorerSubtitle: "Discover fundamental math operations visually and interactively",
    tabAddSub: "➕ / ➖ Add & Subtract",
    tabMulDiv: "✖️ / ➗ Multiply & Divide",
    tabFractions: "🍕 Fractions Pie",
    tabParentheses: "✨ Parentheses & Order",
    mode: "Mode",
    addition: "Addition (+)",
    subtraction: "Subtraction (-)",
    firstNumber: "First Number",
    secondNumber: "Second Number",
    objectsToAdd: "Objects to add",
    tactileObjects: "Tactile Objects (click to cross out)",
    graduatedAxis: "Graduated Axis (Graphical Representation)",
    verify: "Verify",
    greatJob: (numA, op, numB, correctVal) => `Great job! ${numA} ${op} ${numB} = ${correctVal}! 🎉`,
    notQuite: "Not quite. Try counting the objects again!",
    multiplication: "Multiplication (×)",
    division: "Division (÷)",
    rowsGroups: "Rows (Groups)",
    columnsSize: "Columns (Size)",
    totalToDistribute: "Total to distribute",
    divisorGroups: "Divisor (Groups)",
    multiplicationGrid: (rows, cols) => `Multiplication Grid: ${rows} rows × ${cols} columns`,
    fairDistribution: (total, groups) => `Fair distribution of ${total} objects into ${groups} groups`,
    groupLabel: (num) => `Group ${num}`,
    remainderText: (rem) => `⚠️ Remainder: ${rem} object(s) that cannot be distributed equally.`,
    awesomeFeedback: (expr, val) => `Awesome! ${expr} = ${val}! 🏆`,
    tryAgainGrid: "Try again, use the visual grid to help you!",
    numerator: "Numerator (Colored parts)",
    denominator: "Denominator (Total parts)",
    circularPie: "Circular Pie Representation",
    writtenFraction: "Written Fraction",
    fractionExpl: (num, den) => `This fraction represents precisely ${num} parts out of ${den} total parts.`,
    decimalValue: (val) => `Decimal value: ${val}`,
    fundamentalRule: "Fundamental Order of Operations Rule",
    parenthesesExpl: "When an equation contains parentheses, you MUST always calculate the block inside the parentheses () first before doing other operations!",
    riddleOfDay: "Riddle of the Day",
    step1Expl: "Yes! (3 + 2) is calculated first to give 5. Then, 5 × 4 = 20.",
    solveStep1: "Solve Step 1",
    yourAnswer: "Your Answer",
    parenthesesSuccess: "Congratulations! (3 + 2) × 4 = 5 × 4 = 20. You respected the order of operations! 🌟",
    parenthesesIncorrect: "Incorrect. Hint: Calculate what is inside the parentheses first!"
  },
  FR: {
    incompatibleTitle: "Niveau non adapté",
    incompatibleText: "Ce module d'exploration mathématique élémentaire est conçu pour les élèves du collège et lycée. Les concepts abordés (fractions, arithmétique de base) ne sont pas adaptés au niveau universitaire.",
    incompatibleSuggestion: "💡 Conseil pour l'Agent de Niveau 3 : Utilisez plutôt <FunctionPlotter />, <FunctionManipulator /> ou <EquationManipulator /> pour le niveau universitaire.",
    explorerTitle: "Explorateur de Mathématiques de Base",
    explorerSubtitle: "Découvrez de manière visuelle et interactive les fondamentaux des maths",
    tabAddSub: "➕ / ➖ Addition & Soustraction",
    tabMulDiv: "✖️ / ➗ Multiplier & Diviser",
    tabFractions: "🍕 Fractions Visuelles",
    tabParentheses: "✨ Priorités / Parenthèses",
    mode: "Mode",
    addition: "Addition (+)",
    subtraction: "Soustraction (-)",
    firstNumber: "Premier Nombre",
    secondNumber: "Deuxième Nombre",
    objectsToAdd: "Objets à additionner",
    tactileObjects: "Objets tactiles (cliquez pour rayer)",
    graduatedAxis: "Axe Gradué (Représentation Graphique)",
    verify: "Vérifier",
    greatJob: (numA, op, numB, correctVal) => `Bravo ! ${numA} ${op} ${numB} = ${correctVal} ! 🎉`,
    notQuite: "Ce n'est pas tout à fait ça. Compte à nouveau les objets !",
    multiplication: "Multiplication (×)",
    division: "Division (÷)",
    rowsGroups: "Lignes (Groupes)",
    columnsSize: "Colonnes (Taille)",
    totalToDistribute: "Total à distribuer",
    divisorGroups: "Diviseur (Groupes)",
    multiplicationGrid: (rows, cols) => `Matrice de multiplication : ${rows} lignes × ${cols} colonnes`,
    fairDistribution: (total, groups) => `Distribution équitable de ${total} objets dans ${groups} groupes`,
    groupLabel: (num) => `Groupe ${num}`,
    remainderText: (rem) => `⚠️ Reste : ${rem} objet(s) qui ne peuve(nt) pas être distribué(s) équitablement.`,
    awesomeFeedback: (expr, val) => `Génial ! ${expr} = ${val} ! 🏆`,
    tryAgainGrid: "Essaie encore, aide-toi de la grille visuelle !",
    numerator: "Numérateur (Parts colorées)",
    denominator: "Dénominateur (Total des parts)",
    circularPie: "Représentation Circulaire (Tarte)",
    writtenFraction: "Fraction Écrite",
    fractionExpl: (num, den) => `Cette fraction représente précisément ${num} part(s) sur un total de ${den}.`,
    decimalValue: (val) => `Écrit en décimal : ${val}`,
    fundamentalRule: "Règle Fondamentale de l'Ordre des Opérations",
    parenthesesExpl: "Quand une équation contient des parenthèses, on DOIT toujours calculer en priorité absolue le bloc entre parenthèses () avant de faire les autres calculs !",
    riddleOfDay: "Défi du jour",
    step1Expl: "Oui ! (3 + 2) est calculé en premier et donne 5. Ensuite, 5 × 4 = 20.",
    solveStep1: "Résoudre étape 1",
    yourAnswer: "Votre Réponse",
    parenthesesSuccess: "Félicitations ! (3 + 2) × 4 = 5 × 4 = 20. Vous respectez l'ordre de priorité ! 🌟",
    parenthesesIncorrect: "Faux. Indice : Calculez d'abord ce qu'il y a entre parenthèses !"
  },
  ES: {
    incompatibleTitle: "Nivel de grado incompatible",
    incompatibleText: "Este módulo de exploración matemática básica está diseñado para estudiantes de secundaria y bachillerato. Los conceptos abordados (fracciones, aritmética básica) no son adecuados para el nivel universitario.",
    incompatibleSuggestion: "💡 Sugerencia para el Agente de Nivel 3: Utilice <FunctionPlotter />, <FunctionManipulator /> o <EquationManipulator /> para el nivel universitario.",
    explorerTitle: "Explorador de Matemáticas Básicas",
    explorerSubtitle: "Descubra las operaciones matemáticas fundamentales de forma visual e interactiva",
    tabAddSub: "➕ / ➖ Suma y Resta",
    tabMulDiv: "✖️ / ➗ Multiplicación y División",
    tabFractions: "🍕 Fracciones Visuales",
    tabParentheses: "✨ Paréntesis y Orden",
    mode: "Modo",
    addition: "Suma (+)",
    subtraction: "Resta (-)",
    firstNumber: "Primer número",
    secondNumber: "Segundo número",
    objectsToAdd: "Objetos para sumar",
    tactileObjects: "Objetos táctiles (haga clic para tachar)",
    graduatedAxis: "Eje graduado (Representación gráfica)",
    verify: "Verificar",
    greatJob: (numA, op, numB, correctVal) => `¡Buen trabajo! ${numA} ${op} ${numB} = ${correctVal}! 🎉`,
    notQuite: "No del todo. ¡Intente contar los objetos de nuevo!",
    multiplication: "Multiplicación (×)",
    division: "División (÷)",
    rowsGroups: "Filas (Grupos)",
    columnsSize: "Columnas (Tamaño)",
    totalToDistribute: "Total a distribuir",
    divisorGroups: "Divisor (Grupos)",
    multiplicationGrid: (rows, cols) => `Matriz de multiplicación: ${rows} filas × ${cols} columnas`,
    fairDistribution: (total, groups) => `Distribución equitativa de ${total} objetos en ${groups} grupos`,
    groupLabel: (num) => `Grupo ${num}`,
    remainderText: (rem) => `⚠️ Residuo: ${rem} objeto(s) que no se pueden distribuir equitativamente.`,
    awesomeFeedback: (expr, val) => `¡Increíble! ${expr} = ${val}! 🏆`,
    tryAgainGrid: "¡Inténtelo de nuevo, use la cuadrícula visual para ayudarse!",
    numerator: "Numerador (Partes coloreadas)",
    denominator: "Denominador (Partes totales)",
    circularPie: "Representación circular de pastel",
    writtenFraction: "Fracción escrita",
    fractionExpl: (num, den) => `Esta fracción representa exactamente ${num} partes de un total de ${den} partes.`,
    decimalValue: (val) => `Valor decimal: ${val}`,
    fundamentalRule: "Regla fundamental del orden de las operaciones",
    parenthesesExpl: "¡Cuando una ecuación contiene paréntesis, siempre DEBE calcular primero el bloque dentro de los paréntesis () antes de realizar otras operaciones!",
    riddleOfDay: "Acertijo del día",
    step1Expl: "¡Sí! (3 + 2) se calcula primero para dar 5. Luego, 5 × 4 = 20.",
    solveStep1: "Resolver paso 1",
    yourAnswer: "Su respuesta",
    parenthesesSuccess: "¡Felicitaciones! (3 + 2) × 4 = 5 × 4 = 20. ¡Respetó el orden de las operaciones! 🌟",
    parenthesesIncorrect: "Incorrecto. Consejo: ¡Calcule primero lo que está dentro de los paréntesis!"
  },
  DE: {
    incompatibleTitle: "Inkompatible Klassenstufe",
    incompatibleText: "Dieses grundlegende Mathe-Erkundungsmodul ist für Schüler der Mittel- und Oberstufe konzipiert. Die behandelten Konzepte (Brüche, einfache Arithmetik) sind nicht für das Universitätsniveau geeignet.",
    incompatibleSuggestion: "💡 Vorschlag für Level-3-Agenten: Bitte verwenden Sie <FunctionPlotter />, <FunctionManipulator /> oder <EquationManipulator /> für Universitätsniveau.",
    explorerTitle: "Grundlegender Mathe-Erkundung",
    explorerSubtitle: "Entdecken Sie grundlegende mathematische Operationen auf visuelle und interaktive Weise",
    tabAddSub: "➕ / ➖ Addieren & Subtrahieren",
    tabMulDiv: "✖️ / ➗ Multiplizieren & Dividieren",
    tabFractions: "🍕 Visuelle Brüche",
    tabParentheses: "✨ Klammern & Reihenfolge",
    mode: "Modus",
    addition: "Addition (+)",
    subtraction: "Subtraktion (-)",
    firstNumber: "Erste Zahl",
    secondNumber: "Zweite Zahl",
    objectsToAdd: "Objekte zum Hinzufügen",
    tactileObjects: "Taktile Objekte (zum Durchstreichen anklicken)",
    graduatedAxis: "Zahlenstrahl (Grafische Darstellung)",
    verify: "Überprüfen",
    greatJob: (numA, op, numB, correctVal) => `Gut gemacht! ${numA} ${op} ${numB} = ${correctVal}! 🎉`,
    notQuite: "Nicht ganz. Versuche, die Objekte noch einmal zu zählen!",
    multiplication: "Multiplikation (×)",
    division: "Division (÷)",
    rowsGroups: "Zeilen (Gruppen)",
    columnsSize: "Spalten (Größe)",
    totalToDistribute: "Gesamtmenge zum Verteilen",
    divisorGroups: "Divisor (Gruppen)",
    multiplicationGrid: (rows, cols) => `Multiplikationsgitter: ${rows} Zeilen × ${cols} Spalten`,
    fairDistribution: (total, groups) => `Gerechte Aufteilung von ${total} Objekten auf ${groups} Gruppen`,
    groupLabel: (num) => `Gruppe ${num}`,
    remainderText: (rem) => `⚠️ Rest: ${rem} Objekt(e), das/die nicht gleichmäßig verteilt werden kann/können.`,
    awesomeFeedback: (expr, val) => `Großartig! ${expr} = ${val}! 🏆`,
    tryAgainGrid: "Versuche es noch einmal, nutze das visuelle Gitter als Hilfe!",
    numerator: "Zähler (Farbige Teile)",
    denominator: "Nenner (Gesamtteile)",
    circularPie: "Kreisdiagramm-Darstellung",
    writtenFraction: "Geschriebener Bruch",
    fractionExpl: (num, den) => `Dieser Bruch stellt genau ${num} von insgesamt ${den} Teilen dar.`,
    decimalValue: (val) => `Dezimalwert: ${val}`,
    fundamentalRule: "Grundregel der Rangfolge der Operationen",
    parenthesesExpl: "Wenn eine Gleichung Klammern enthält, MÜSSEN Sie immer zuerst den Block innerhalb der Klammern () berechnen, bevor Sie andere Operationen durchführen!",
    riddleOfDay: "Rätsel des Tages",
    step1Expl: "Ja! (3 + 2) wird zuerst berechnet und ergibt 5. Dann ist 5 × 4 = 20.",
    solveStep1: "Schritt 1 lösen",
    yourAnswer: "Ihre Antwort",
    parenthesesSuccess: "Herzlichen Glückwunsch! (3 + 2) × 4 = 5 × 4 = 20. Sie haben die Klammerregel beachtet! 🌟",
    parenthesesIncorrect: "Falsch. Hinweis: Berechnen Sie zuerst, was in den Klammern steht!"
  },
  PT: {
    incompatibleTitle: "Nível escolar incompatível",
    incompatibleText: "Este módulo de exploração matemática básica foi projetado para alunos do ensino fundamental e médio. Os conceitos abordados (frações, aritmética básica) não são adequados para o nível universitário.",
    incompatibleSuggestion: "💡 Sugestão para o Agente de Nível 3: Use <FunctionPlotter />, <FunctionManipulator /> ou <EquationManipulator /> para o nível universitário.",
    explorerTitle: "Explorador de Matemática Básica",
    explorerSubtitle: "Descubra as operações matemáticas fundamentais de forma visual e interativa",
    tabAddSub: "➕ / ➖ Somar e Subtrair",
    tabMulDiv: "✖️ / ➗ Multiplicar e Dividir",
    tabFractions: "🍕 Frações Visuais",
    tabParentheses: "✨ Parênteses e Ordem",
    mode: "Modo",
    addition: "Adição (+)",
    subtraction: "Subtração (-)",
    firstNumber: "Primeiro Número",
    secondNumber: "Segundo Número",
    objectsToAdd: "Objetos para adicionar",
    tactileObjects: "Objetos táteis (clique para riscar)",
    graduatedAxis: "Eixo Graduado (Representação Gráfica)",
    verify: "Verificar",
    greatJob: (numA, op, numB, correctVal) => `Bom trabalho! ${numA} ${op} ${numB} = ${correctVal}! 🎉`,
    notQuite: "Não exatamente. Tente contar os objetos novamente!",
    multiplication: "Multiplicação (×)",
    division: "Divisão (÷)",
    rowsGroups: "Linhas (Grupos)",
    columnsSize: "Colunas (Tamanho)",
    totalToDistribute: "Total a distribuir",
    divisorGroups: "Divisor (Grupos)",
    multiplicationGrid: (rows, cols) => `Grade de multiplicação: ${rows} linhas × ${cols} colunas`,
    fairDistribution: (total, groups) => `Distribuição justa de ${total} objetos em ${groups} grupos`,
    groupLabel: (num) => `Grupo ${num}`,
    remainderText: (rem) => `⚠️ Resto: ${rem} objeto(s) que não pode(m) ser distribuído(s) igualmente.`,
    awesomeFeedback: (expr, val) => `Incrível! ${expr} = ${val}! 🏆`,
    tryAgainGrid: "Tente novamente, use a grade visual para ajudar!",
    numerator: "Numerador (Partes coloridas)",
    denominator: "Denominador (Total de partes)",
    circularPie: "Representação em Pizza",
    writtenFraction: "Fração Escrita",
    fractionExpl: (num, den) => `Esta fração representa exatamente ${num} partes de um total de ${den} partes.`,
    decimalValue: (val) => `Valor decimal: ${val}`,
    fundamentalRule: "Regra Fundamental da Ordem das Operações",
    parenthesesExpl: "Quando uma equação contém parênteses, você DEVE sempre calcular o bloco dentro dos parênteses () primeiro antes de fazer outras operações!",
    riddleOfDay: "Desafio do Dia",
    step1Expl: "Sim! (3 + 2) é calculado primeiro para dar 5. Depois, 5 × 4 = 20.",
    solveStep1: "Resolver Passo 1",
    yourAnswer: "Sua Resposta",
    parenthesesSuccess: "Parabéns! (3 + 2) × 4 = 5 × 4 = 20. Você respeitou a ordem das operações! 🌟",
    parenthesesIncorrect: "Incorreto. Dica: Calcule primeiro o que está dentro dos parênteses!"
  },
  ZH: {
    incompatibleTitle: "年级水平不兼容",
    incompatibleText: "此基础数学探索模块专为初中和高中学生设计。所涉及的概念（分数、基础算术）不适合大学水平。",
    incompatibleSuggestion: "💡 针对3级代理的建议：大学水平请使用 <FunctionPlotter />、<FunctionManipulator /> 或 <EquationManipulator />。",
    explorerTitle: "基础数学探索器",
    explorerSubtitle: "通过直观和互动的方式发现基本的数学运算",
    tabAddSub: "➕ / ➖ 加法与减法",
    tabMulDiv: "✖️ / ➗ 乘法与除法",
    tabFractions: "🍕 直观分数",
    tabParentheses: "✨ 括号与优先级",
    mode: "模式",
    addition: "加法 (+)",
    subtraction: "减法 (-)",
    firstNumber: "第一个数",
    secondNumber: "第二个数",
    objectsToAdd: "要相加的物体",
    tactileObjects: "可点按物体（点击划掉）",
    graduatedAxis: "数轴（图形表示）",
    verify: "验证",
    greatJob: (numA, op, numB, correctVal) => `太棒了！${numA} ${op} ${numB} = ${correctVal}！🎉`,
    notQuite: "不完全正确。请试着重新数一下物体！",
    multiplication: "乘法 (×)",
    division: "除法 (÷)",
    rowsGroups: "行（组）",
    columnsSize: "列（大小）",
    totalToDistribute: "要分配的总数",
    divisorGroups: "除数（组）",
    multiplicationGrid: (rows, cols) => `乘法网格：${rows} 行 × ${cols} 列`,
    fairDistribution: (total, groups) => `将 ${total} 个物体平均分配到 ${groups} 个组中`,
    groupLabel: (num) => `第 ${num} 组`,
    remainderText: (rem) => `⚠️ 余数：剩余 ${rem} 个物体无法平均分配。`,
    awesomeFeedback: (expr, val) => `太棒了！${expr} = ${val}！🏆`,
    tryAgainGrid: "再试一次，用直观的网格来帮助你！",
    numerator: "分子（有色部分）",
    denominator: "分母（总部分）",
    circularPie: "饼图表示",
    writtenFraction: "分数书写",
    fractionExpl: (num, den) => `这个分数精确表示总共 ${den} 等分中的 ${num} 部分。`,
    decimalValue: (val) => `小数值：${val}`,
    fundamentalRule: "运算法则基本规则",
    parenthesesExpl: "当等式中含有括号时，您必须首先计算括号 () 内的部分，然后再进行其他计算！",
    riddleOfDay: "今日谜题",
    step1Expl: "是的！先计算 (3 + 2) 得到 5。然后，5 × 4 = 20。",
    solveStep1: "求解第1步",
    yourAnswer: "您的答案",
    parenthesesSuccess: "恭喜你！(3 + 2) × 4 = 5 × 4 = 20。你遵守了运算顺序！🌟",
    parenthesesIncorrect: "错误。提示：请先计算括号内的内容！"
  },
  AR: {
    incompatibleTitle: "مستوى صف غير متوافق",
    incompatibleText: "تم تصميم وحدة استكشاف الرياضيات الأساسية هذه لطلاب المدارس الإعدادية والثانوية. المفاهيم التي تغطيها (الكسور، الحساب الأساسي) غير مناسبة للمستوى الجامعي.",
    incompatibleSuggestion: "💡 اقتراح لوكيل المستوى 3: يرجى استخدام <FunctionPlotter /> أو <FunctionManipulator /> أو <EquationManipulator /> للمستوى الجامعي.",
    explorerTitle: "مستكشف الرياضيات الأساسية",
    explorerSubtitle: "اكتشف العمليات الحسابية الأساسية بشكل مرئي وتفاعلي",
    tabAddSub: "➕ / ➖ الجمع والطرح",
    tabMulDiv: "✖️ / ➗ الضرب والقسمة",
    tabFractions: "🍕 تمثيل الكسور",
    tabParentheses: "✨ الأقواس والترتيب",
    mode: "الوضع",
    addition: "الجمع (+)",
    subtraction: "الطرح (-)",
    firstNumber: "الرقم الأول",
    secondNumber: "الرقم الثاني",
    objectsToAdd: "العناصر المراد جمعها",
    tactileObjects: "العناصر التفاعلية (انقر للتشطيب)",
    graduatedAxis: "المحور المدرج (التمثيل البياني)",
    verify: "تحقق",
    greatJob: (numA, op, numB, correctVal) => `عمل رائع! ${numA} ${op} ${numB} = ${correctVal}! 🎉`,
    notQuite: "ليس تماماً. حاول عد العناصر مرة أخرى!",
    multiplication: "الضرب (×)",
    division: "القسمة (÷)",
    rowsGroups: "الصفوف (المجموعات)",
    columnsSize: "الأعمدة (الحجم)",
    totalToDistribute: "الإجمالي للتوزيع",
    divisorGroups: "المقسوم عليه (المجموعات)",
    multiplicationGrid: (rows, cols) => `شبكة الضرب: ${rows} صفوف × ${cols} أعمدة`,
    fairDistribution: (total, groups) => `توزيع عادل لـ ${total} عناصر على ${groups} مجموعات`,
    groupLabel: (num) => `المجموعة ${num}`,
    remainderText: (rem) => `⚠️ الباقي: ${rem} عنصر (عناصر) لا يمكن توزيعها بالتساوي.`,
    awesomeFeedback: (expr, val) => `رائع! ${expr} = ${val}! 🏆`,
    tryAgainGrid: "حاول مجدداً، استخدم الشبكة المرئية لمساعدتك!",
    numerator: "البسط (الأجزاء الملونة)",
    denominator: "المقام (إجمالي الأجزاء)",
    circularPie: "تمثيل الدائرة المجزأة",
    writtenFraction: "الكسر المكتوب",
    fractionExpl: (num, den) => `يمثل هذا الكسر بالضبط ${num} أجزاء من إجمالي ${den} أجزاء.`,
    decimalValue: (val) => `القيمة العشرية: ${val}`,
    fundamentalRule: "القاعدة الأساسية لترتيب العمليات",
    parenthesesExpl: "عندما تحتوي المعادلة على أقواس، يجب عليك دائماً حساب ما بداخل الأقواس () أولاً قبل القيام بالعمليات الأخرى!",
    riddleOfDay: "لغز اليوم",
    step1Expl: "نعم! يتم حساب (3 + 2) أولاً ليعطي 5. ثم، 5 × 4 = 20.",
    solveStep1: "حل الخطوة الأولى",
    yourAnswer: "إجابتك",
    parenthesesSuccess: "تهانينا! (3 + 2) × 4 = 5 × 4 = 20. لقد احترمت ترتيب العمليات! 🌟",
    parenthesesIncorrect: "غير صحيح. تلميح: احسب ما بداخل الأقواس أولاً!"
  },
  HI: {
    incompatibleTitle: "असंगत ग्रेड स्तर",
    incompatibleText: "यह बुनियादी गणित अन्वेषण मॉड्यूल माध्यमिक और उच्च विद्यालय के छात्रों के लिए डिज़ाइन किया गया है। कवर की गई अवधारणाएं (भिन्न, बुनियादी अंकगणित) विश्वविद्यालय स्तर के अनुकूल नहीं हैं।",
    incompatibleSuggestion: "💡 स्तर 3 एजेंट के लिए सुझाव: कृपया विश्वविद्यालय स्तर के लिए <FunctionPlotter />, <FunctionManipulator />, या <EquationManipulator /> का उपयोग करें।",
    explorerTitle: "बुनियादी गणित अन्वेषक",
    explorerSubtitle: "बुनियादी गणितीय क्रियाओं को दृश्य और संवादात्मक रूप से खोजें",
    tabAddSub: "➕ / ➖ जोड़ें और घटाएं",
    tabMulDiv: "✖️ / ➗ गुणा और भाग",
    tabFractions: "🍕 भिन्न पाई",
    tabParentheses: "✨ कोष्ठक और क्रम",
    mode: "मोड",
    addition: "जोड़ (+)",
    subtraction: "घटाव (-)",
    firstNumber: "पहली संख्या",
    secondNumber: "दूसरी संख्या",
    objectsToAdd: "जोड़ने के लिए वस्तुएं",
    tactileObjects: "स्पर्शनीय वस्तुएं (काटने के लिए क्लिक करें)",
    graduatedAxis: "संख्या रेखा (ग्राफिक प्रतिनिधित्व)",
    verify: "सत्यापित करें",
    greatJob: (numA, op, numB, correctVal) => `बहुत बढ़िया! ${numA} ${op} ${numB} = ${correctVal}! 🎉`,
    notQuite: "पूरी तरह से सही नहीं है। वस्तुओं को फिर से गिनने का प्रयास करें!",
    multiplication: "गुणा (×)",
    division: "भाग (÷)",
    rowsGroups: "पंक्तियाँ (समूह)",
    columnsSize: "कॉलम (आकार)",
    totalToDistribute: "वितरित करने के लिए कुल",
    divisorGroups: "भाजक (समूह)",
    multiplicationGrid: (rows, cols) => `गुणा ग्रिड: ${rows} पंक्तियाँ × ${cols} कॉलम`,
    fairDistribution: (total, groups) => `${total} वस्तुओं का ${groups} समूहों में समान वितरण`,
    groupLabel: (num) => `समूह ${num}`,
    remainderText: (rem) => `⚠️ शेषफल: ${rem} वस्तु(एं) जिन्हें समान रूप से वितरित नहीं किया जा सकता।`,
    awesomeFeedback: (expr, val) => `अद्भुत! ${expr} = ${val}! 🏆`,
    tryAgainGrid: "फिर से प्रयास करें, सहायता के लिए दृश्य ग्रिड का उपयोग करें!",
    numerator: "अंश (रंगीन भाग)",
    denominator: "हर (कुल भाग)",
    circularPie: "वृत्ताकार पाई प्रतिनिधित्व",
    writtenFraction: "लिखित भिन्न",
    fractionExpl: (num, den) => `यह भिन्न कुल ${den} भागों में से ठीक ${num} भागों को दर्शाती है।`,
    decimalValue: (val) => `दशमलव मान: ${val}`,
    fundamentalRule: "संचालन के क्रम का मौलिक नियम",
    parenthesesExpl: "जब किसी समीकरण में कोष्ठक होते हैं, तो आपको हमेशा अन्य क्रियाओं को करने से पहले कोष्ठक () के अंदर के हिस्से की गणना पहले करनी होगी!",
    riddleOfDay: "आज की पहेली",
    step1Expl: "हाँ! (3 + 2) की गणना पहले की जाती है जिससे 5 मिलता है। फिर, 5 × 4 = 20.",
    solveStep1: "चरण 1 हल करें",
    yourAnswer: "आपका उत्तर",
    parenthesesSuccess: "बधाई हो! (3 + 2) × 4 = 5 × 4 = 20. आपने संचालन के क्रम का पालन किया! 🌟",
    parenthesesIncorrect: "गलत। संकेत: पहले कोष्ठक के अंदर की गणना करें!"
  },
  UR: {
    incompatibleTitle: "غیر مطابقت پذیر گریڈ لیول",
    incompatibleText: "بنیادی ریاضی کی دریافت کا یہ ماڈیول مڈل اور ہائی اسکول کے طلباء کے لیے ڈیزائن کیا گیا ہے۔ احاطہ شدہ تصورات (کسر، بنیادی حساب) یونیورسٹی کی سطح کے لیے موزوں نہیں ہیں۔",
    incompatibleSuggestion: "💡 لیول 3 ایجنٹ کے لیے مشورہ: براہ کرم یونیورسٹی کی سطح کے لیے <FunctionPlotter />، <FunctionManipulator /> یا <EquationManipulator /> استعمال کریں۔",
    explorerTitle: "بنیادی ریاضی کا ایکسپلورر",
    explorerSubtitle: "بنیادی ریاضی کے عمل کو بصری اور انٹرایکٹو طریقے سے دریافت کریں",
    tabAddSub: "➕ / ➖ جمع اور تفریق",
    tabMulDiv: "✖️ / ➗ ضرب اور تقسیم",
    tabFractions: "🍕 فریکشنز پائی",
    tabParentheses: "✨ قوسین اور ترتیب",
    mode: "موڈ",
    addition: "جمع (+)",
    subtraction: "تفریق (-)",
    firstNumber: "پہلا نمبر",
    secondNumber: "دوسرا نمبر",
    objectsToAdd: "جمع کرنے کے لیے اشیاء",
    tactileObjects: "ٹچ ایبل اشیاء (کاٹنے کے لیے کلک کریں)",
    graduatedAxis: "نمبر لائن (بصری نمائندگی)",
    verify: "تصدیق کریں",
    greatJob: (numA, op, numB, correctVal) => `بہت عمدہ! ${numA} ${op} ${numB} = ${correctVal}! 🎉`,
    notQuite: "مکمل طور پر درست نہیں۔ اشیاء کو دوبارہ گننے کی کوشش کریں!",
    multiplication: "ضرب (×)",
    division: "تقسيم (÷)",
    rowsGroups: "قطاریں (گروپ)",
    columnsSize: "کالم (سائز)",
    totalToDistribute: "تقسیم کرنے کے لیے کل",
    divisorGroups: "تقسیم کار (گروپ)",
    multiplicationGrid: (rows, cols) => `ضرب کا گرڈ: ${rows} قطاریں × ${cols} کالم`,
    fairDistribution: (total, groups) => `${total} اشیاء کی ${groups} گروپس میں مساوی تقسیم`,
    groupLabel: (num) => `گروپ ${num}`,
    remainderText: (rem) => `⚠️ باقی: ${rem} اشیاء جو مساوی طور پر تقسیم نہیں کی جا سکتیں۔`,
    awesomeFeedback: (expr, val) => `شاندار! ${expr} = ${val}! 🏆`,
    tryAgainGrid: "دوبارہ کوشش کریں، مدد کے لیے بصری گرڈ استعمال کریں!",
    numerator: "شمار کنندہ (رنگین حصے)",
    denominator: "مخرج (کل حصے)",
    circularPie: "گول پائی کی شکل میں نمائندگی",
    writtenFraction: "لکھی ہوئی کسر",
    fractionExpl: (num, den) => `یہ کسر کل ${den} حصوں میں سے ٹھیک ${num} حصوں کو ظاہر کرتی ہے۔`,
    decimalValue: (val) => `عشاریہ قیمت: ${val}`,
    fundamentalRule: "حساب کے ترتیب کا بنیادی اصول",
    parenthesesExpl: "جب کسی مساوات میں قوسین ہوں، تو آپ کو ہمیشہ دوسرے حسابات کرنے سے پہلے قوسین () کے اندر موجود حصے کو پہلے حل کرنا ہوگا!",
    riddleOfDay: "آج کا معمہ",
    step1Expl: "جی ہاں! پہلے (3 + 2) کو حل کرنے سے 5 حاصل ہوتا ہے۔ پھر، 5 × 4 = 20۔",
    solveStep1: "مرحلہ 1 حل کریں",
    yourAnswer: "آپ کا جواب",
    parenthesesSuccess: "مبارک ہو! (3 + 2) × 4 = 5 × 4 = 20۔ آپ نے حساب کے ترتیب کا درست خیال رکھا! 🌟",
    parenthesesIncorrect: "غلط۔ اشارہ: پہلے قوسین کے اندر کا حصہ حل کریں!"
  }
};

export const BasicMathExplorer = ({
  initialTab,
  initialMode,
  initialNumA,
  initialNumB,
  gradeLevel
}: BasicMathExplorerProps = {}) => {
  const { language } = useLanguage();
  const langKey = language?.toUpperCase() || 'EN';
  const t = TRANSLATIONS[langKey] || TRANSLATIONS.EN;

  const [activeTab, setActiveTab] = useState<ExplorerTab>(initialTab || 'add-sub');

  // --- TAB 1: ADDITION / SUBTRACTION STATE ---
  const [addSubMode, setAddSubMode] = useState<'add' | 'sub'>((initialMode === 'add' || initialMode === 'sub') ? initialMode : 'sub');
  const [numA, setNumA] = useState(initialNumA !== undefined ? initialNumA : 8);
  const [numB, setNumB] = useState(initialNumB !== undefined ? initialNumB : 3);
  const [crossedIndexes, setCrossedIndexes] = useState<number[]>([]);
  const [tab1Guess, setTab1Guess] = useState('');
  const [tab1Feedback, setTab1Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // --- TAB 2: MULTIPLICATION / DIVISION STATE ---
  const [mulDivMode, setMulDivMode] = useState<'mul' | 'div'>('mul');
  const [factorA, setFactorA] = useState(3); // rows or groups
  const [factorB, setFactorB] = useState(4); // cols or size
  const [divTotal, setDivTotal] = useState(12);
  const [divDivisor, setDivDivisor] = useState(3);
  const [tab2Guess, setTab2Guess] = useState('');
  const [tab2Feedback, setTab2Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // --- TAB 3: FRACTIONS STATE ---
  const [fracNum, setFracNum] = useState(3);
  const [fracDen, setFracDen] = useState(4);
  const [fracNumB, setFracNumB] = useState(2);
  const [fracDenB, setFracDenB] = useState(3);
  const [compareMode, setCompareMode] = useState(false);

  // --- TAB 4: PARENTHESES STATE ---
  const [parenthesisStep, setParenthesisStep] = useState(0);
  const [tab4Guess, setTab4Guess] = useState('');
  const [tab4Feedback, setTab4Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Reset tab states
  const handleTabChange = (tab: ExplorerTab) => {
    setActiveTab(tab);
    setCrossedIndexes([]);
    setTab1Guess('');
    setTab1Feedback(null);
    setTab2Guess('');
    setTab2Feedback(null);
    setTab4Guess('');
    setTab4Feedback(null);
    setParenthesisStep(0);
    setCompareMode(false);
  };

  // --- HELPERS ---
  const renderStars = (count: number, activeCount: number, type: 'heart' | 'star' = 'star') => {
    return Array.from({ length: count }).map((_, idx) => {
      const isActive = idx < activeCount;
      const isCrossed = addSubMode === 'sub' && crossedIndexes.includes(idx);
      const color = isCrossed ? '#ef4444' : isActive ? '#60a5fa' : '#475569';
      const fill = isCrossed ? 'none' : isActive ? color : 'none';

      return (
        <div 
          key={idx}
          onClick={() => {
            if (addSubMode === 'sub') {
              if (crossedIndexes.includes(idx)) {
                setCrossedIndexes(prev => prev.filter(i => i !== idx));
              } else if (crossedIndexes.length < numB) {
                setCrossedIndexes(prev => [...prev, idx]);
              }
            }
          }}
          className={`relative w-[48px] h-[48px] rounded-xl flex items-center justify-center border transition-all duration-300 cursor-pointer select-none ${
            isCrossed 
              ? 'bg-rose-500/10 border-rose-500/30' 
              : 'bg-slate-950 border-slate-850 hover:border-slate-700'
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2">
            {type === 'star' ? (
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
            ) : (
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            )}
          </svg>
          {isCrossed && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-[80%] h-0.5 bg-red-500 rotate-45" />
              <div className="absolute w-[80%] h-0.5 bg-red-500 -rotate-45" />
            </div>
          )}
        </div>
      );
    });
  };

  // Verification functions
  const verifyTab1 = () => {
    const guessVal = parseInt(tab1Guess, 10);
    const correctVal = addSubMode === 'add' ? numA + numB : numA - numB;
    if (guessVal === correctVal) {
      setTab1Feedback({
        isCorrect: true,
        text: t.greatJob(numA, addSubMode === 'add' ? '+' : '-', numB, correctVal)
      });
    } else {
      setTab1Feedback({
        isCorrect: false,
        text: t.notQuite
      });
    }
  };

  const verifyTab2 = () => {
    const guessVal = parseInt(tab2Guess, 10);
    const correctVal = mulDivMode === 'mul' ? factorA * factorB : Math.floor(divTotal / divDivisor);
    if (guessVal === correctVal) {
      setTab2Feedback({
        isCorrect: true,
        text: t.awesomeFeedback(mulDivMode === 'mul' ? `${factorA} × ${factorB}` : `${divTotal} ÷ ${divDivisor}`, correctVal)
      });
    } else {
      setTab2Feedback({
        isCorrect: false,
        text: t.tryAgainGrid
      });
    }
  };

  const verifyTab4 = () => {
    const guessVal = parseInt(tab4Guess, 10);
    if (guessVal === 20) {
      setTab4Feedback({
        isCorrect: true,
        text: t.parenthesesSuccess
      });
      setParenthesisStep(2);
    } else {
      setTab4Feedback({
        isCorrect: false,
        text: t.parenthesesIncorrect
      });
    }
  };

  if (gradeLevel === 'university') {
    return (
      <div className="my-10 p-8 rounded-[40px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl text-center max-w-xl mx-auto shadow-2xl">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wider animate-pulse">
          {t.incompatibleTitle}
        </h3>
        <p className="text-slate-300 text-sm mb-4 leading-relaxed">
          {t.incompatibleText}
        </p>
        <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3">
          {t.incompatibleSuggestion}
        </p>
      </div>
    );
  }

  return (
    <div className="my-10 rounded-[40px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl shadow-2xl overflow-hidden neon-glow-indigo">
      {/* Header Tabs switcher */}
      <div className="border-b border-slate-850 bg-slate-950/40 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <span className="text-sm">🧮</span>
          </div>
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider">
              {t.explorerTitle}
            </h4>
            <p className="text-[10px] text-slate-400 font-bold">
              {t.explorerSubtitle}
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2">
          {(['add-sub', 'mul-div', 'fractions', 'parentheses'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border select-none transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/15 neon-glow-indigo'
                  : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:neon-glow-indigo'
              }`}
            >
              {tab === 'add-sub' ? t.tabAddSub :
               tab === 'mul-div' ? t.tabMulDiv :
               tab === 'fractions' ? t.tabFractions :
               t.tabParentheses}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">

        {/* TAB 1: ADDITION & SUBTRACTION */}
        {activeTab === 'add-sub' && (
          <div className="space-y-6">
            {/* Top Config */}
            <div className="p-5 rounded-3xl border border-slate-850 bg-slate-950/40 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider block">{t.mode}</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => { setAddSubMode('add'); setTab1Feedback(null); }}
                    className={`py-1.5 rounded-xl text-[9px] font-black uppercase border tracking-wider select-none cursor-pointer transition-all ${
                      addSubMode === 'add' ? 'bg-indigo-600 border-indigo-500 text-white neon-glow-indigo' : 'bg-slate-950 border-slate-850 text-slate-400 hover:neon-glow-indigo'
                    }`}
                  >
                    {t.addition}
                  </button>
                  <button
                    onClick={() => { setAddSubMode('sub'); setTab1Feedback(null); }}
                    className={`py-1.5 rounded-xl text-[9px] font-black uppercase border tracking-wider select-none cursor-pointer transition-all ${
                      addSubMode === 'sub' ? 'bg-indigo-600 border-indigo-500 text-white neon-glow-indigo' : 'bg-slate-950 border-slate-850 text-slate-400 hover:neon-glow-indigo'
                    }`}
                  >
                    {t.subtraction}
                  </button>
                </div>
              </div>

              {/* Number A Slider */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                  <span>{t.firstNumber}</span>
                  <span className="font-mono text-[11px] text-white font-black">{numA}</span>
                </label>
                <input 
                  type="range" min={1} max={15} value={numA} 
                  onChange={e => { setNumA(parseInt(e.target.value, 10)); setTab1Feedback(null); }}
                  className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                />
              </div>

              {/* Number B Slider */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                  <span>{t.secondNumber}</span>
                  <span className="font-mono text-[11px] text-white font-black">{numB}</span>
                </label>
                <input 
                  type="range" min={1} max={numA} value={numB} 
                  onChange={e => { setNumB(Math.min(parseInt(e.target.value, 10), numA)); setTab1Feedback(null); }}
                  className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                />
              </div>
            </div>

            {/* Tactile display block */}
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {addSubMode === 'add' ? t.objectsToAdd : t.tactileObjects}
              </h5>

              <div className="p-6 rounded-3xl bg-slate-950/40 border border-slate-900 flex flex-wrap gap-3 items-center justify-center min-h-[100px]">
                {/* Visual rendering */}
                {addSubMode === 'add' ? (
                  <>
                    <div className="flex flex-wrap gap-2 p-3 border border-blue-500/20 bg-blue-500/5 rounded-2xl">
                      {renderStars(numA, numA, 'star')}
                    </div>
                    <span className="text-xl font-bold text-slate-500 mx-2">+</span>
                    <div className="flex flex-wrap gap-2 p-3 border border-indigo-500/20 bg-indigo-500/5 rounded-2xl">
                      {renderStars(numB, numB, 'heart')}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2 p-3 border border-rose-500/20 bg-rose-500/5 rounded-2xl">
                    {renderStars(numA, numA, 'star')}
                  </div>
                )}
              </div>
            </div>

            {/* Step-Jump Curved Number Line */}
            <div className="space-y-4 pt-4 border-t border-slate-850">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {t.graduatedAxis}
              </h5>

              <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-900 shadow-inner overflow-x-auto">
                <div className="min-w-[500px] py-6 relative">
                  {/* Axis Line */}
                  <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-800 -translate-y-1/2 rounded-full" />
                  
                  {/* Jump Bezier Curve overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
                    {(() => {
                      const startPos = numA;
                      const endPos = addSubMode === 'add' ? numA + numB : numA - numB;
                      const startPct = 4 + (startPos / 30) * 92;
                      const endPct = 4 + (endPos / 30) * 92;
                      const curveColor = addSubMode === 'add' ? '#10b981' : '#ef4444';
                      const label = addSubMode === 'add' ? `+${numB}` : `-${numB}`;
                      return (
                        <g>
                          <path 
                            d={`M ${startPct}%,26 Q ${(startPct + endPct) / 2}%,-10 ${endPct}%,26`} 
                            fill="none" 
                            stroke={curveColor} 
                            strokeWidth="3" 
                            strokeDasharray="6,4"
                          />
                          <polygon points="0,-5 -8,5 8,5" fill={curveColor} transform={`translate(${endPct * 5.8}, 32) rotate(${addSubMode === 'add' ? 60 : -60})`} />
                          <text x={`${(startPct + endPct) / 2}%`} y="8" fill={curveColor} fontSize="12" fontWeight="black" textAnchor="middle" fontFamily="monospace">
                            {label}
                          </text>
                        </g>
                      );
                    })()}
                  </svg>

                  {/* Graduated markings */}
                  <div className="relative flex justify-between px-2">
                    {Array.from({ length: 31 }).map((_, val) => {
                      const isHighlight = val === numA || val === (addSubMode === 'add' ? numA + numB : numA - numB);
                      return (
                        <div key={val} className="flex flex-col items-center justify-center" style={{ width: '3.1%' }}>
                          <div className={`w-0.5 h-3.5 ${isHighlight ? 'bg-indigo-400 h-4 w-1' : 'bg-slate-700'}`} />
                          <span className={`mt-2 font-mono text-[10px] font-black ${isHighlight ? 'text-indigo-400 scale-110' : 'text-slate-650'}`}>
                            {val}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Riddle */}
            <div className="pt-6 border-t border-slate-850 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-black text-slate-300">
                  {numA} {addSubMode === 'add' ? '+' : '-'} {numB} = 
                </span>
                <input
                  type="number"
                  placeholder="?"
                  value={tab1Guess}
                  onChange={e => setTab1Guess(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && verifyTab1()}
                  className="w-20 px-3 py-2 text-xl font-mono font-black text-center text-white bg-slate-950 border border-slate-800 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors"
                />
                <button
                  onClick={verifyTab1}
                  className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/15 cursor-pointer hover:neon-glow-indigo"
                >
                  {t.verify}
                </button>
              </div>

              {tab1Feedback && (
                <div className={`p-4 rounded-2xl border flex-1 text-[11px] font-bold ${
                  tab1Feedback.isCorrect ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-rose-500/20 bg-rose-500/5 text-rose-450'
                }`}>
                  {tab1Feedback.text}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MULTIPLICATION & DIVISION */}
        {activeTab === 'mul-div' && (
          <div className="space-y-6">
            {/* Top Config */}
            <div className="p-5 rounded-3xl border border-slate-850 bg-slate-950/40 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider block">{t.mode}</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => { setMulDivMode('mul'); setTab2Feedback(null); }}
                    className={`py-1.5 rounded-xl text-[9px] font-black uppercase border tracking-wider select-none cursor-pointer transition-all ${
                      mulDivMode === 'mul' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-850 text-slate-400'
                    }`}
                  >
                    {t.multiplication}
                  </button>
                  <button
                    onClick={() => { setMulDivMode('div'); setTab2Feedback(null); }}
                    className={`py-1.5 rounded-xl text-[9px] font-black uppercase border tracking-wider select-none cursor-pointer transition-all ${
                      mulDivMode === 'div' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-850 text-slate-400'
                    }`}
                  >
                    {t.division}
                  </button>
                </div>
              </div>

              {mulDivMode === 'mul' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                      <span>{t.rowsGroups}</span>
                      <span className="font-mono text-[11px] text-white font-black">{factorA}</span>
                    </label>
                    <input 
                      type="range" min={1} max={6} value={factorA} 
                      onChange={e => { setFactorA(parseInt(e.target.value, 10)); setTab2Feedback(null); }}
                      className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                      <span>{t.columnsSize}</span>
                      <span className="font-mono text-[11px] text-white font-black">{factorB}</span>
                    </label>
                    <input 
                      type="range" min={1} max={8} value={factorB} 
                      onChange={e => { setFactorB(parseInt(e.target.value, 10)); setTab2Feedback(null); }}
                      className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                      <span>{t.totalToDistribute}</span>
                      <span className="font-mono text-[11px] text-white font-black">{divTotal}</span>
                    </label>
                    <input 
                      type="range" min={2} max={24} step={2} value={divTotal} 
                      onChange={e => { setDivTotal(parseInt(e.target.value, 10)); setTab2Feedback(null); }}
                      className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                      <span>{t.divisorGroups}</span>
                      <span className="font-mono text-[11px] text-white font-black">{divDivisor}</span>
                    </label>
                    <input 
                      type="range" min={1} max={6} value={divDivisor} 
                      onChange={e => { setDivDivisor(parseInt(e.target.value, 10)); setTab2Feedback(null); }}
                      className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                  </div>
                </>
              )}
            </div>

            {/* Visual Grid / Grouping displays */}
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {mulDivMode === 'mul' 
                  ? t.multiplicationGrid(factorA, factorB)
                  : t.fairDistribution(divTotal, divDivisor)}
              </h5>

              <div className="p-8 rounded-3xl bg-slate-950/40 border border-slate-900 flex items-center justify-center min-h-[180px]">
                {mulDivMode === 'mul' ? (
                  /* Render rows of cols */
                  <div className="flex flex-col gap-2.5">
                    {Array.from({ length: factorA }).map((_, rIdx) => (
                      <div key={rIdx} className="flex gap-2.5">
                        {Array.from({ length: factorB }).map((_, cIdx) => (
                          <div key={cIdx} className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-[10px] font-bold">
                            {(rIdx * factorB) + cIdx + 1}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Render divisor groups */
                  <div className="flex flex-wrap gap-6 justify-center">
                    {Array.from({ length: divDivisor }).map((_, groupIdx) => {
                      const itemsInThisGroup = Math.floor(divTotal / divDivisor);
                      const remains = divTotal % divDivisor;
                      const hasExtra = groupIdx < remains;
                      const count = itemsInThisGroup + (hasExtra ? 1 : 0);

                      return (
                        <div key={groupIdx} className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 min-w-[100px] flex flex-col items-center gap-2">
                          <span className="text-[9px] font-black uppercase text-indigo-400">{t.groupLabel(groupIdx + 1)}</span>
                          <div className="flex flex-wrap gap-1 max-w-[80px] justify-center">
                            {Array.from({ length: count }).map((_, i) => (
                              <div key={i} className="w-4 h-4 rounded-full bg-indigo-400" />
                            ))}
                          </div>
                          <span className="text-[10px] font-mono font-bold text-white mt-1">x {count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {mulDivMode === 'div' && divTotal % divDivisor !== 0 && (
                <p className="text-[10px] text-amber-500 font-bold text-center">
                  {t.remainderText(divTotal % divDivisor)}
                </p>
              )}
            </div>

            {/* Validation input */}
            <div className="pt-6 border-t border-slate-850 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-black text-slate-300">
                  {mulDivMode === 'mul' 
                    ? `${factorA} × ${factorB} =` 
                    : `${divTotal} ÷ ${divDivisor} =`}
                </span>
                <input
                  type="number"
                  placeholder="?"
                  value={tab2Guess}
                  onChange={e => setTab2Guess(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && verifyTab2()}
                  className="w-20 px-3 py-2 text-xl font-mono font-black text-center text-white bg-slate-950 border border-slate-800 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors"
                />
                <button
                  onClick={verifyTab2}
                  className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/15 cursor-pointer hover:neon-glow-emerald"
                >
                  {t.verify}
                </button>
              </div>

              {tab2Feedback && (
                <div className={`p-4 rounded-2xl border flex-1 text-[11px] font-bold ${
                  tab2Feedback.isCorrect ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-rose-500/20 bg-rose-500/5 text-rose-450'
                }`}>
                  {tab2Feedback.text}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: VISUAL FRACTIONS */}
        {activeTab === 'fractions' && (
          <div className="space-y-6">
            {/* Compare mode toggle button */}
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-slate-400 font-bold">
                {compareMode ? "Compare Fraction A (Blue/Indigo) with Fraction B (Green/Emerald)" : "Discovery Sandbox - adjust values or click slices"}
              </p>
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border select-none cursor-pointer transition-all ${
                  compareMode 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg neon-glow-indigo' 
                    : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:neon-glow-indigo'
                }`}
              >
                ⚖️ {compareMode ? "Single Mode" : "Compare Mode"}
              </button>
            </div>

            <div className={compareMode ? "grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2" : "space-y-6"}>
              {/* Fraction A Card */}
              <div className="p-5 rounded-3xl border border-slate-850 bg-slate-950/20 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">
                    {compareMode ? "Fraction A" : "Fractions"}
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold">Click slices to toggle</span>
                </div>
                
                {/* Sliders for Fraction A */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                      <span>{t.numerator}</span>
                      <span className="font-mono text-[11px] text-white font-black">{fracNum}</span>
                    </label>
                    <input 
                      type="range" min={0} max={fracDen} value={fracNum} 
                      onChange={e => setFracNum(parseInt(e.target.value, 10))}
                      className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-550" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                      <span>{t.denominator}</span>
                      <span className="font-mono text-[11px] text-white font-black">{fracDen}</span>
                    </label>
                    <input 
                      type="range" min={1} max={12} value={fracDen} 
                      onChange={e => {
                        const newDen = parseInt(e.target.value, 10);
                        setFracDen(newDen);
                        setFracNum(Math.min(fracNum, newDen));
                      }}
                      className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-550" 
                    />
                  </div>
                </div>

                {/* SVG and Math info Side-by-Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 flex flex-col items-center justify-center min-h-[180px]">
                    <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90 select-none">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="1" />
                      {Array.from({ length: fracDen }).map((_, idx) => {
                        const angleSlice = 360 / fracDen;
                        const startAngle = idx * angleSlice;
                        const endAngle = (idx + 1) * angleSlice;
                        const isSelected = idx < fracNum;
                        const rad = Math.PI / 180;
                        const x1 = 50 + 44 * Math.cos(startAngle * rad);
                        const y1 = 50 + 44 * Math.sin(startAngle * rad);
                        const x2 = 50 + 44 * Math.cos(endAngle * rad);
                        const y2 = 50 + 44 * Math.sin(endAngle * rad);
                        const largeArcFlag = angleSlice > 180 ? 1 : 0;
                        const d = `M 50,50 L ${x1},${y1} A 44,44 0 ${largeArcFlag},1 ${x2},${y2} Z`;
                        return (
                          <path
                            key={idx}
                            d={d}
                            fill={isSelected ? '#6366f1' : '#1e293b'}
                            stroke="#0f172a"
                            strokeWidth="1.5"
                            className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                            onClick={() => setFracNum(idx + 1 === fracNum ? idx : idx + 1)}
                          />
                        );
                      })}
                    </svg>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-850 bg-slate-900/10 flex flex-col items-center justify-center min-h-[180px]">
                    <div className="flex flex-col items-center font-mono font-black text-3xl">
                      <span className="text-indigo-400">{fracNum}</span>
                      <div className="w-10 h-0.5 bg-slate-700 my-1 rounded" />
                      <span className="text-slate-300">{fracDen}</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-450 mt-3">
                      {t.decimalValue((fracNum / fracDen).toFixed(2))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fraction B Card (Comparison Mode) */}
              {compareMode && (
                <div className="p-5 rounded-3xl border border-slate-850 bg-slate-950/20 space-y-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                      Fraction B
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold">Click slices to toggle</span>
                  </div>
                  
                  {/* Sliders for Fraction B */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-emerald-400 tracking-wider flex justify-between">
                        <span>{t.numerator}</span>
                        <span className="font-mono text-[11px] text-white font-black">{fracNumB}</span>
                      </label>
                      <input 
                        type="range" min={0} max={fracDenB} value={fracNumB} 
                        onChange={e => setFracNumB(parseInt(e.target.value, 10))}
                        className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-550" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-emerald-400 tracking-wider flex justify-between">
                        <span>{t.denominator}</span>
                        <span className="font-mono text-[11px] text-white font-black">{fracDenB}</span>
                      </label>
                      <input 
                        type="range" min={1} max={12} value={fracDenB} 
                        onChange={e => {
                          const newDen = parseInt(e.target.value, 10);
                          setFracDenB(newDen);
                          setFracNumB(Math.min(fracNumB, newDen));
                        }}
                        className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-550" 
                      />
                    </div>
                  </div>

                  {/* SVG and Math info Side-by-Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 flex flex-col items-center justify-center min-h-[180px]">
                      <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90 select-none">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="1" />
                        {Array.from({ length: fracDenB }).map((_, idx) => {
                          const angleSlice = 360 / fracDenB;
                          const startAngle = idx * angleSlice;
                          const endAngle = (idx + 1) * angleSlice;
                          const isSelected = idx < fracNumB;
                          const rad = Math.PI / 180;
                          const x1 = 50 + 44 * Math.cos(startAngle * rad);
                          const y1 = 50 + 44 * Math.sin(startAngle * rad);
                          const x2 = 50 + 44 * Math.cos(endAngle * rad);
                          const y2 = 50 + 44 * Math.sin(endAngle * rad);
                          const largeArcFlag = angleSlice > 180 ? 1 : 0;
                          const d = `M 50,50 L ${x1},${y1} A 44,44 0 ${largeArcFlag},1 ${x2},${y2} Z`;
                          return (
                            <path
                              key={idx}
                              d={d}
                              fill={isSelected ? '#10b981' : '#1e293b'}
                              stroke="#0f172a"
                              strokeWidth="1.5"
                              className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                              onClick={() => setFracNumB(idx + 1 === fracNumB ? idx : idx + 1)}
                            />
                          );
                        })}
                      </svg>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-850 bg-slate-900/10 flex flex-col items-center justify-center min-h-[180px]">
                      <div className="flex flex-col items-center font-mono font-black text-3xl">
                        <span className="text-emerald-400">{fracNumB}</span>
                        <div className="w-10 h-0.5 bg-slate-700 my-1 rounded" />
                        <span className="text-slate-300">{fracDenB}</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-450 mt-3">
                        {t.decimalValue((fracNumB / fracDenB).toFixed(2))}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {compareMode && (
              <div className="p-5 bg-slate-950/40 border border-slate-850 rounded-3xl flex flex-col items-center justify-center gap-4 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Comparison Result</span>
                {(() => {
                  const valA = fracNum / fracDen;
                  const valB = fracNumB / fracDenB;
                  const diff = Math.abs(valA - valB);
                  const isEquivalent = diff < 0.0001;
                  
                  let symbol = "=";
                  let message = "Equivalent Fractions! (Equal size)";
                  let colorClass = "text-emerald-400 border-emerald-500/25 bg-emerald-500/5";

                  if (!isEquivalent) {
                    if (valA > valB) {
                      symbol = ">";
                      message = `Fraction A is GREATER than Fraction B (${(valA).toFixed(2)} > ${(valB).toFixed(2)})`;
                      colorClass = "text-indigo-400 border-indigo-500/25 bg-indigo-500/5";
                    } else {
                      symbol = "<";
                      message = `Fraction A is LESS than Fraction B (${(valA).toFixed(2)} < ${(valB).toFixed(2)})`;
                      colorClass = "text-emerald-400 border-emerald-500/25 bg-emerald-500/5";
                    }
                  }

                  return (
                    <>
                      <div className="flex items-center gap-6 font-mono font-black text-4xl select-none">
                        <div className="flex flex-col items-center text-indigo-400">
                          <span>{fracNum}</span>
                          <span className="text-xs">/</span>
                          <span>{fracDen}</span>
                        </div>
                        <span className="text-slate-400 scale-120">{symbol}</span>
                        <div className="flex flex-col items-center text-emerald-400">
                          <span>{fracNumB}</span>
                          <span className="text-xs">/</span>
                          <span>{fracDenB}</span>
                        </div>
                      </div>
                      <div className={`p-4 border rounded-2xl text-xs font-bold ${colorClass}`}>
                        {message}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PARENTHESES / PRIORITIES */}
        {activeTab === 'parentheses' && (
          <div className="space-y-6">
            <div className="p-5 rounded-3xl border border-slate-850 bg-slate-950/40 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {t.fundamentalRule}
              </span>
              <p className="text-slate-200 font-extrabold text-sm leading-relaxed">
                {t.parenthesesExpl}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* Target calculation problem visual representation */}
              <div className="p-6 md:p-8 rounded-3xl bg-slate-950/60 border border-slate-900 shadow-inner flex flex-col justify-between min-h-[220px]">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{t.riddleOfDay}</span>
                
                <div className="py-6 text-center select-none">
                  <div className="font-mono text-3xl font-black text-slate-100 flex justify-center items-center gap-2">
                    <span className={parenthesisStep >= 1 ? 'text-emerald-400 line-through opacity-50' : 'text-indigo-400 bg-indigo-500/10 px-2 py-1.5 rounded-xl border border-indigo-500/20'}>
                      (3 + 2)
                    </span>
                    <span className="text-slate-500">×</span>
                    <span>4</span>
                    <span className="text-slate-500">=</span>
                    <span className="text-indigo-400">?</span>
                  </div>

                  {parenthesisStep >= 1 && (
                    <div className="font-mono text-2xl font-black text-emerald-400 mt-4 flex justify-center items-center gap-2 animate-pulse">
                      <span>5</span>
                      <span className="text-slate-500">×</span>
                      <span>4</span>
                      <span className="text-slate-500">=</span>
                      <span>20</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setParenthesisStep(1);
                      setTab4Guess('20');
                      setTab4Feedback({
                        isCorrect: true,
                        text: t.step1Expl
                      });
                    }}
                    className="px-4 py-2 rounded-xl text-[9px] font-black uppercase border tracking-widest bg-slate-950 border-slate-800 text-indigo-400 hover:bg-slate-900 cursor-pointer"
                  >
                    {t.solveStep1}
                  </button>
                  <button
                    onClick={() => {
                      setParenthesisStep(0);
                      setTab4Guess('');
                      setTab4Feedback(null);
                    }}
                    className="p-2 rounded-xl border bg-slate-950 border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form input and text explaining step */}
              <div className="p-6 rounded-3xl border border-slate-850 bg-slate-900/30 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{t.yourAnswer}</span>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="?"
                      value={tab4Guess}
                      onChange={e => setTab4Guess(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && verifyTab4()}
                      className="w-20 px-3 py-2 text-xl font-mono font-black text-center text-white bg-slate-950 border border-slate-800 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <button
                      onClick={verifyTab4}
                      className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/15 cursor-pointer hover:neon-glow-indigo"
                    >
                      {t.verify}
                    </button>
                  </div>
                </div>

                {tab4Feedback && (
                  <div className={`p-4 rounded-2xl border flex-1 text-[11px] font-bold ${
                    tab4Feedback.isCorrect ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-rose-500/20 bg-rose-500/5 text-rose-450'
                  }`}>
                    {tab4Feedback.text}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
