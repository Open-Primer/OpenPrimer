"use client";
import React, { useState } from 'react';
import { TopNav, UI_STRINGS, Footer } from '../RefinedUI';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronDown, ChevronRight, AlertTriangle, GraduationCap, Shield, BookOpen, Globe, Zap, Users, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const FAQ_DATA = {
  EN: {
    title: "Frequently Asked Questions",
    subtitle: "Transparency about what OpenPrimer is — and what it is not.",
    disclaimer_banner: "OpenPrimer is a self-directed learning platform. It does not award academic degrees, diplomas, or university accreditation of any kind.",
    items: [
      {
        q: "Does OpenPrimer award diplomas or degrees?",
        a: "No. OpenPrimer does not award any diplomas, bachelor's degrees, master's degrees, doctorates, or any other form of officially recognized academic credential. Completion certificates issued by this platform have no legal or academic standing with universities, employers, or government bodies."
      },
      {
        q: "Is OpenPrimer accredited by a university or government body?",
        a: "No. OpenPrimer is not accredited by any national or international university, higher education authority, ministry of education, or professional regulatory body. It is an independent open-source educational project."
      },
      {
        q: "Can I use my OpenPrimer completion to apply to a university?",
        a: "No. University admissions offices do not recognize OpenPrimer completion records. To apply to universities, you must obtain officially recognized qualifications through accredited institutions such as the International Baccalaureate, A-Levels, or national university entrance examinations."
      },
      {
        q: "Can I put OpenPrimer on my CV or resume?",
        a: "You may mention OpenPrimer as a personal learning initiative or self-study project, similar to listing an online MOOC. However, it cannot be listed as an academic degree or certified qualification, and misrepresenting it as such may constitute academic fraud."
      },
      {
        q: "Does completing a course on OpenPrimer prove academic mastery?",
        a: "Course completion demonstrates personal engagement with the material, but it is not a standardized, externally validated assessment. It carries no legal weight as proof of academic competency recognized by institutions or employers."
      },
      {
        q: "Is the content produced by certified professors?",
        a: "All course content is generated autonomously by Artificial Intelligence models and reviewed by the OpenPrimer editorial team. It is not authored or certified by licensed professors, accredited academic institutions, or peer-reviewed academic bodies."
      },
      {
        q: "Is OpenPrimer a substitute for formal education?",
        a: "No. OpenPrimer is designed as a supplementary self-study tool, not a replacement for formal schooling, university education, or certified vocational training. It works best as a complement to an official curriculum."
      },
      {
        q: "What is the legal status of an OpenPrimer course?",
        a: "OpenPrimer courses are provided 'as-is' under the CC BY-NC-SA 4.0 license for content and the MIT license for software. They carry no legal certification value. Users bear full responsibility for the decisions they make based on the content consumed on this platform."
      },
      {
        q: "Are there any fees or paid certifications on OpenPrimer?",
        a: "No. OpenPrimer is entirely free and open-source. It does not offer paid certification programs, premium diplomas, or any form of monetized credential. Any third party claiming to issue official OpenPrimer certificates should be considered fraudulent."
      },
      {
        q: "Where can I find officially recognized online qualifications?",
        a: "For recognized online degrees, consider accredited providers such as Coursera (partnered with universities), edX, or national distance learning universities such as the Open University (UK), CNED (France), or equivalent bodies in your country."
      }
    ]
  },
  FR: {
    title: "Foire Aux Questions",
    subtitle: "Transparence sur ce qu'est OpenPrimer — et ce qu'il n'est pas.",
    disclaimer_banner: "OpenPrimer est une plateforme d'auto-apprentissage. Elle ne délivre aucun diplôme académique, aucune certification universitaire ni aucune accréditation officielle.",
    items: [
      {
        q: "OpenPrimer délivre-t-il des diplômes ou des grades universitaires ?",
        a: "Non. OpenPrimer ne délivre aucun diplôme, licence, master, doctorat ou toute autre forme de titre académique officiellement reconnu. Les attestations de complétion émises par cette plateforme n'ont aucune valeur légale ou académique auprès des universités, des employeurs ou des administrations publiques."
      },
      {
        q: "OpenPrimer est-il accrédité par une université ou un organisme officiel ?",
        a: "Non. OpenPrimer n'est accrédité par aucune université nationale ou internationale, aucune autorité de l'enseignement supérieur, aucun ministère de l'éducation, ni aucun organisme de réglementation professionnel. Il s'agit d'un projet éducatif open source indépendant."
      },
      {
        q: "Puis-je utiliser mon parcours OpenPrimer pour candidater à une université ?",
        a: "Non. Les universités ne reconnaissent pas les attestations de complétion OpenPrimer dans leurs procédures d'admission. Pour intégrer une université, vous devez obtenir des qualifications officiellement reconnues via des établissements accrédités (baccalauréat, diplômes nationaux, etc.)."
      },
      {
        q: "Puis-je mentionner OpenPrimer sur mon CV ?",
        a: "Vous pouvez mentionner OpenPrimer comme initiative personnelle d'auto-formation, à l'instar d'un MOOC en ligne. En revanche, il ne peut être présenté comme un diplôme ou une qualification certifiée, et toute représentation mensongère en ce sens pourrait constituer une fraude académique."
      },
      {
        q: "La complétion d'un cours OpenPrimer prouve-t-elle une maîtrise académique ?",
        a: "La complétion témoigne d'un engagement personnel avec le contenu, mais ne constitue pas une évaluation standardisée validée par un tiers. Elle n'a aucune valeur légale en tant que preuve de compétence académique reconnue par des institutions ou des employeurs."
      },
      {
        q: "Le contenu est-il produit par des professeurs certifiés ?",
        a: "Tout le contenu des cours est généré de manière autonome par des modèles d'Intelligence Artificielle et relu par l'équipe éditoriale d'OpenPrimer. Il n'est pas rédigé ni certifié par des professeurs agréés, des institutions académiques accréditées ou des comités de relecture académique."
      },
      {
        q: "OpenPrimer remplace-t-il une formation officielle ?",
        a: "Non. OpenPrimer est conçu comme un outil d'auto-étude complémentaire, et non comme un substitut à la scolarité officielle, à l'enseignement universitaire ou à la formation professionnelle certifiée. Il fonctionne mieux en complément d'un cursus officiel."
      },
      {
        q: "Quel est le statut légal d'un cours OpenPrimer ?",
        a: "Les cours OpenPrimer sont fournis 'en l'état' sous licence CC BY-NC-SA 4.0 pour le contenu et MIT pour le logiciel. Ils n'ont aucune valeur de certification légale. Les utilisateurs assument l'entière responsabilité des décisions prises sur la base des contenus consultés."
      },
      {
        q: "Y a-t-il des frais ou des certifications payantes sur OpenPrimer ?",
        a: "Non. OpenPrimer est entièrement gratuit et open source. Il ne propose aucun programme de certification payant, aucun diplôme premium ni aucune forme de titre monnayé. Tout tiers prétendant délivrer des certificats officiels OpenPrimer doit être considéré comme frauduleux."
      },
      {
        q: "Où trouver des qualifications en ligne officiellement reconnues ?",
        a: "Pour des diplômes en ligne reconnus, consultez des prestataires accrédités tels que Coursera (en partenariat avec des universités), edX, le CNED (France), ou l'équivalent dans votre pays."
      }
    ]
  },
  ES: {
    title: "Preguntas Frecuentes",
    subtitle: "Transparencia sobre lo que es OpenPrimer — y lo que no es.",
    disclaimer_banner: "OpenPrimer es una plataforma de aprendizaje autónomo. No otorga títulos académicos, diplomas universitarios ni ningún tipo de acreditación oficial.",
    items: [
      { q: "¿OpenPrimer otorga diplomas o títulos universitarios?", a: "No. OpenPrimer no otorga ningún diploma, licenciatura, maestría, doctorado ni ninguna otra credencial académica reconocida oficialmente. Los certificados de finalización emitidos por esta plataforma no tienen validez legal ni académica ante universidades, empleadores u organismos gubernamentales." },
      { q: "¿OpenPrimer está acreditado por alguna universidad u organismo oficial?", a: "No. OpenPrimer no está acreditado por ninguna universidad nacional o internacional, autoridad de educación superior, ministerio de educación ni organismo regulador profesional. Es un proyecto educativo de código abierto independiente." },
      { q: "¿Puedo usar mi formación en OpenPrimer para solicitar ingreso a una universidad?", a: "No. Las oficinas de admisión universitaria no reconocen los registros de finalización de OpenPrimer. Para acceder a universidades, debes obtener calificaciones oficialmente reconocidas a través de instituciones acreditadas." },
      { q: "¿Puedo incluir OpenPrimer en mi currículum?", a: "Puedes mencionar OpenPrimer como una iniciativa de aprendizaje personal o proyecto de autoestudio. Sin embargo, no puede presentarse como un título académico o certificación, y hacerlo podría constituir fraude académico." },
      { q: "¿Completar un curso en OpenPrimer demuestra dominio académico?", a: "La finalización demuestra compromiso personal con el material, pero no es una evaluación estandarizada ni validada externamente. No tiene peso legal como prueba de competencia académica reconocida por instituciones o empleadores." },
      { q: "¿El contenido está producido por profesores certificados?", a: "Todo el contenido de los cursos es generado de forma autónoma por modelos de Inteligencia Artificial y revisado por el equipo editorial de OpenPrimer. No está redactado ni certificado por profesores titulados ni instituciones académicas acreditadas." },
      { q: "¿OpenPrimer reemplaza la educación formal?", a: "No. OpenPrimer está diseñado como una herramienta complementaria de autoestudio, no como sustituto de la escolarización oficial, la educación universitaria o la formación profesional certificada." },
      { q: "¿Cuál es el estatus legal de un curso de OpenPrimer?", a: "Los cursos de OpenPrimer se ofrecen 'tal cual' bajo la licencia CC BY-NC-SA 4.0 para el contenido y MIT para el software. No tienen valor de certificación legal. Los usuarios asumen plena responsabilidad por las decisiones tomadas en base al contenido consultado." },
      { q: "¿Hay tarifas o certificaciones de pago en OpenPrimer?", a: "No. OpenPrimer es completamente gratuito y de código abierto. No ofrece programas de certificación pagados ni ninguna forma de credencial monetizada. Cualquier tercero que pretenda emitir certificados oficiales de OpenPrimer debe considerarse fraudulento." },
      { q: "¿Dónde puedo obtener calificaciones en línea reconocidas oficialmente?", a: "Para diplomas en línea reconocidos, consulta proveedores acreditados como Coursera, edX o universidades nacionales a distancia de tu país." }
    ]
  },
  DE: {
    title: "Häufig gestellte Fragen",
    subtitle: "Transparenz darüber, was OpenPrimer ist — und was es nicht ist.",
    disclaimer_banner: "OpenPrimer ist eine Plattform für selbstgesteuertes Lernen. Es werden keinerlei akademische Abschlüsse, Diplome oder universitäre Akkreditierungen vergeben.",
    items: [
      { q: "Vergibt OpenPrimer Diplome oder Hochschulabschlüsse?", a: "Nein. OpenPrimer vergibt keine Diplome, Bachelor-, Master- oder Doktortitel und keine anderen offiziell anerkannten akademischen Abschlüsse. Abschlusszertifikate dieser Plattform haben keine rechtliche oder akademische Gültigkeit bei Universitäten, Arbeitgebern oder Behörden." },
      { q: "Ist OpenPrimer von einer Universität oder Behörde akkreditiert?", a: "Nein. OpenPrimer ist von keiner nationalen oder internationalen Universität, Hochschulbehörde, Bildungsministerium oder professionellen Regulierungsbehörde akkreditiert. Es handelt sich um ein unabhängiges Open-Source-Bildungsprojekt." },
      { q: "Kann ich meinen OpenPrimer-Abschluss für eine Universitätsbewerbung nutzen?", a: "Nein. Universitäten erkennen OpenPrimer-Abschlussnachweise in ihren Zulassungsverfahren nicht an. Für eine Universitätszulassung müssen Sie offiziell anerkannte Qualifikationen über akkreditierte Institutionen erwerben." },
      { q: "Kann ich OpenPrimer in meinem Lebenslauf erwähnen?", a: "Sie können OpenPrimer als persönliche Lerninitiative oder Selbststudienprojekt erwähnen, ähnlich wie einen Online-MOOC. Es darf jedoch nicht als akademischer Abschluss oder zertifizierte Qualifikation angegeben werden, da dies akademischen Betrug darstellen kann." },
      { q: "Beweist der Abschluss eines OpenPrimer-Kurses akademische Kompetenz?", a: "Ein Kursabschluss belegt persönliches Engagement mit dem Material, ist jedoch keine standardisierte, extern validierte Prüfung. Er hat keine rechtliche Bedeutung als Nachweis akademischer Kompetenz, die von Institutionen oder Arbeitgebern anerkannt wird." },
      { q: "Wird der Inhalt von zertifizierten Professoren erstellt?", a: "Alle Kursinhalte werden autonom von KI-Modellen generiert und vom OpenPrimer-Redaktionsteam überprüft. Sie werden nicht von lizenzierten Professoren, akkreditierten akademischen Institutionen oder Peer-Review-Gremien verfasst oder zertifiziert." },
      { q: "Ersetzt OpenPrimer eine formale Ausbildung?", a: "Nein. OpenPrimer ist als ergänzendes Selbststudiumswerkzeug konzipiert, nicht als Ersatz für formale Schulbildung, Hochschulausbildung oder zertifizierte Berufsausbildung." },
      { q: "Welchen rechtlichen Status hat ein OpenPrimer-Kurs?", a: "OpenPrimer-Kurse werden 'wie besehen' unter der CC BY-NC-SA 4.0-Lizenz für Inhalte und der MIT-Lizenz für Software bereitgestellt. Sie haben keinen Zertifizierungswert. Nutzer tragen die volle Verantwortung für Entscheidungen, die auf Basis der konsumierten Inhalte getroffen werden." },
      { q: "Gibt es Gebühren oder kostenpflichtige Zertifizierungen bei OpenPrimer?", a: "Nein. OpenPrimer ist vollständig kostenlos und Open Source. Es werden keine kostenpflichtigen Zertifizierungsprogramme oder monetarisierten Abschlüsse angeboten. Dritte, die offizielle OpenPrimer-Zertifikate ausstellen, sind als betrügerisch zu betrachten." },
      { q: "Wo finde ich offiziell anerkannte Online-Qualifikationen?", a: "Für anerkannte Online-Abschlüsse empfehlen sich akkreditierte Anbieter wie Coursera, edX oder nationale Fernuniversitäten wie die FernUniversität Hagen." }
    ]
  },
  ZH: {
    title: "常见问题解答",
    subtitle: "关于 OpenPrimer 是什么、不是什么的透明说明。",
    disclaimer_banner: "OpenPrimer 是一个自主学习平台。它不颁发任何学术学位、文凭或大学认证。",
    items: [
      { q: "OpenPrimer 颁发文凭或学位吗？", a: "不。OpenPrimer 不颁发任何文凭、学士、硕士、博士或任何其他形式的官方认可学历证书。本平台颁发的课程完成证书在大学、雇主或政府机构面前没有任何法律或学术效力。" },
      { q: "OpenPrimer 是否获得大学或政府机构的认证？", a: "否。OpenPrimer 未获得任何国家或国际大学、高等教育机构、教育部或专业监管机构的认证。它是一个独立的开源教育项目。" },
      { q: "我可以用 OpenPrimer 的学习记录申请大学吗？", a: "不可以。大学招生办公室不承认 OpenPrimer 的课程完成记录。要申请大学，您必须通过认证机构获得官方认可的资格证书。" },
      { q: "我可以在简历中提及 OpenPrimer 吗？", a: "您可以将 OpenPrimer 列为个人学习项目或自学经历，类似于在线公开课（MOOC）。但不能将其列为学术学位或认证资格，否则可能构成学术欺诈。" },
      { q: "完成 OpenPrimer 课程能证明学术掌握程度吗？", a: "课程完成证明了个人对材料的学习投入，但这不是标准化的、经外部验证的评估。它不具备任何机构或雇主认可的学术能力证明的法律效力。" },
      { q: "课程内容是由认证教授创作的吗？", a: "所有课程内容均由人工智能模型自主生成，并由 OpenPrimer 编辑团队审核。内容并非由持牌教授、认证学术机构或同行评审机构撰写或认证。" },
      { q: "OpenPrimer 可以替代正规教育吗？", a: "不能。OpenPrimer 被设计为一种补充性自学工具，而非正规学校教育、大学教育或认证职业培训的替代品。" },
      { q: "OpenPrimer 课程的法律地位是什么？", a: "OpenPrimer 课程按'现状'提供，内容遵循 CC BY-NC-SA 4.0 许可，软件遵循 MIT 许可。它们不具备任何法律认证价值。用户对基于本平台内容做出的决策承担全部责任。" },
      { q: "OpenPrimer 是否收费或提供付费认证？", a: "不。OpenPrimer 完全免费且开源。它不提供任何付费认证项目或有偿学历。任何声称颁发官方 OpenPrimer 证书的第三方均应被视为欺诈行为。" },
      { q: "哪里可以获得官方认可的在线资格证书？", a: "如需获得认可的在线学位，请参考 Coursera、edX 等与大学合作的认证提供商，或您所在国家的远程教育大学。" }
    ]
  },
  PT: {
    title: "Perguntas Frequentes",
    subtitle: "Transparência sobre o que o OpenPrimer é — e o que não é.",
    disclaimer_banner: "OpenPrimer é uma plataforma de aprendizagem autónoma. Não concede diplomas académicos, graus universitários nem qualquer forma de acreditação oficial.",
    items: [
      { q: "O OpenPrimer concede diplomas ou graus universitários?", a: "Não. O OpenPrimer não concede diplomas, licenciaturas, mestrados, doutoramentos nem qualquer outra credencial académica oficialmente reconhecida. Os certificados de conclusão emitidos por esta plataforma não têm validade legal ou académica perante universidades, empregadores ou organismos governamentais." },
      { q: "O OpenPrimer é acreditado por alguma universidade ou organismo oficial?", a: "Não. O OpenPrimer não é acreditado por nenhuma universidade nacional ou internacional, autoridade de ensino superior, ministério da educação ou organismo regulador profissional. É um projeto educativo independente de código aberto." },
      { q: "Posso usar o meu percurso no OpenPrimer para candidatar-me a uma universidade?", a: "Não. Os serviços de admissão universitária não reconhecem os registos de conclusão do OpenPrimer. Para ingressar em universidades, deve obter qualificações oficialmente reconhecidas através de instituições acreditadas." },
      { q: "Posso mencionar o OpenPrimer no meu currículo?", a: "Pode mencionar o OpenPrimer como uma iniciativa de aprendizagem pessoal ou projeto de autoestudo. No entanto, não pode ser apresentado como um grau académico ou qualificação certificada, e fazê-lo poderá constituir fraude académica." },
      { q: "Concluir um curso no OpenPrimer comprova domínio académico?", a: "A conclusão demonstra empenho pessoal com o material, mas não é uma avaliação padronizada e validada externamente. Não tem validade legal como prova de competência académica reconhecida por instituições ou empregadores." },
      { q: "O conteúdo é produzido por professores certificados?", a: "Todo o conteúdo dos cursos é gerado de forma autónoma por modelos de Inteligência Artificial e revisto pela equipa editorial do OpenPrimer. Não é redigido nem certificado por professores licenciados, instituições académicas acreditadas ou comités de revisão por pares." },
      { q: "O OpenPrimer substitui a educação formal?", a: "Não. O OpenPrimer foi concebido como uma ferramenta de autoestudo complementar, não como substituto da escolaridade oficial, ensino universitário ou formação profissional certificada." },
      { q: "Qual é o estatuto legal de um curso do OpenPrimer?", a: "Os cursos do OpenPrimer são fornecidos 'tal como estão' sob a licença CC BY-NC-SA 4.0 para conteúdo e MIT para software. Não têm valor de certificação legal. Os utilizadores assumem total responsabilidade pelas decisões tomadas com base nos conteúdos consultados." },
      { q: "Existem taxas ou certificações pagas no OpenPrimer?", a: "Não. O OpenPrimer é inteiramente gratuito e de código aberto. Não oferece programas de certificação pagos nem qualquer forma de credencial monetizada. Qualquer terceiro que alegue emitir certificados oficiais do OpenPrimer deve ser considerado fraudulento." },
      { q: "Onde posso obter qualificações online oficialmente reconhecidas?", a: "Para diplomas online reconhecidos, consulte fornecedores acreditados como Coursera, edX ou universidades nacionais de ensino a distância do seu país." }
    ]
  },
  AR: {
    title: "الأسئلة الشائعة",
    subtitle: "الشفافية حول ما هو OpenPrimer — وما ليس عليه.",
    disclaimer_banner: "OpenPrimer منصة تعليم ذاتي. لا تمنح أي شهادات أكاديمية أو دبلومات جامعية أو أي نوع من الاعتماد الرسمي.",
    items: [
      { q: "هل تمنح OpenPrimer دبلومات أو درجات جامعية؟", a: "لا. لا تمنح OpenPrimer أي دبلوم أو بكالوريوس أو ماجستير أو دكتوراه أو أي شكل آخر من أشكال الاعتماد الأكاديمي المعترف به رسمياً. شهادات الإتمام الصادرة عن هذه المنصة لا قيمة قانونية أو أكاديمية لها لدى الجامعات أو أصحاب العمل أو الجهات الحكومية." },
      { q: "هل OpenPrimer معتمدة من جامعة أو جهة رسمية؟", a: "لا. لا تعتمد OpenPrimer من قِبل أي جامعة وطنية أو دولية، أو سلطة تعليمية، أو وزارة تعليم، أو هيئة تنظيمية مهنية. إنها مشروع تعليمي مستقل مفتوح المصدر." },
      { q: "هل يمكنني استخدام دراستي في OpenPrimer للتقدم إلى الجامعة؟", a: "لا. مكاتب القبول الجامعي لا تعترف بسجلات الإتمام في OpenPrimer. للالتحاق بالجامعات، يجب الحصول على مؤهلات معترف بها رسمياً من خلال مؤسسات معتمدة." },
      { q: "هل يمكنني ذكر OpenPrimer في سيرتي الذاتية؟", a: "يمكنك ذكر OpenPrimer كمبادرة تعلم شخصية أو مشروع دراسة ذاتية. غير أنه لا يمكن تقديمها كدرجة أكاديمية أو مؤهل معتمد، وقد يشكل ذلك غشاً أكاديمياً." },
      { q: "هل يُثبت إتمام دورة في OpenPrimer التحصيل الأكاديمي؟", a: "يُثبت الإتمام الانخراط الشخصي بالمادة، لكنه ليس تقييماً موحداً ومُعتمداً من طرف ثالث. ولا قيمة قانونية له كدليل على الكفاءة الأكاديمية المعترف بها من المؤسسات أو أصحاب العمل." },
      { q: "هل يُنتج المحتوى أساتذة معتمدون؟", a: "جميع محتويات الدورات مُولَّدة بشكل مستقل بواسطة نماذج الذكاء الاصطناعي ومراجَعة من فريق التحرير في OpenPrimer. ولا تتم كتابتها أو اعتمادها من قِبل أساتذة مرخصين أو مؤسسات أكاديمية معتمدة." },
      { q: "هل OpenPrimer بديل عن التعليم الرسمي؟", a: "لا. صُمِّمت OpenPrimer كأداة دراسة ذاتية تكميلية، لا كبديل عن التعليم المدرسي الرسمي أو التعليم الجامعي أو التدريب المهني المعتمد." },
      { q: "ما الوضع القانوني لدورات OpenPrimer؟", a: "تُقدَّم دورات OpenPrimer 'كما هي' بموجب ترخيص CC BY-NC-SA 4.0 للمحتوى وMIT للبرمجيات. ليس لها أي قيمة شهادات قانونية. يتحمل المستخدمون المسؤولية الكاملة عن القرارات المتخذة بناءً على المحتوى المُستهلَك." },
      { q: "هل توجد رسوم أو شهادات مدفوعة في OpenPrimer؟", a: "لا. OpenPrimer مجانية تماماً ومفتوحة المصدر. لا تقدم برامج شهادات مدفوعة أو أي شكل من أشكال الاعتماد المُموَّل. أي طرف ثالث يدّعي إصدار شهادات OpenPrimer الرسمية يُعدّ احتيالياً." },
      { q: "أين يمكنني الحصول على مؤهلات عبر الإنترنت معترف بها رسمياً؟", a: "للحصول على شهادات معتمدة عبر الإنترنت، يُنصح بمزودين معتمدين مثل Coursera وedX أو الجامعات الوطنية للتعلم عن بُعد في بلدك." }
    ]
  },
  HI: {
    title: "अक्सर पूछे जाने वाले प्रश्न",
    subtitle: "OpenPrimer क्या है — और क्या नहीं है, इस बारे में पारदर्शिता।",
    disclaimer_banner: "OpenPrimer एक स्व-निर्देशित शिक्षण मंच है। यह किसी भी प्रकार की अकादमिक डिग्री, डिप्लोमा या विश्वविद्यालय मान्यता प्रदान नहीं करता है।",
    items: [
      { q: "क्या OpenPrimer डिप्लोमा या डिग्री प्रदान करता है?", a: "नहीं। OpenPrimer कोई डिप्लोमा, स्नातक, परास्नातक, डॉक्टरेट या किसी अन्य आधिकारिक रूप से मान्यता प्राप्त अकादमिक प्रमाणपत्र प्रदान नहीं करता। इस प्लेटफ़ॉर्म द्वारा जारी पूर्णता प्रमाणपत्रों का विश्वविद्यालयों, नियोक्ताओं या सरकारी निकायों के साथ कोई कानूनी या अकादमिक महत्व नहीं है।" },
      { q: "क्या OpenPrimer किसी विश्वविद्यालय या सरकारी निकाय द्वारा मान्यता प्राप्त है?", a: "नहीं। OpenPrimer किसी राष्ट्रीय या अंतरराष्ट्रीय विश्वविद्यालय, उच्च शिक्षा प्राधिकरण, शिक्षा मंत्रालय या पेशेवर नियामक निकाय द्वारा मान्यता प्राप्त नहीं है। यह एक स्वतंत्र ओपन-सोर्स शैक्षिक परियोजना है।" },
      { q: "क्या मैं विश्वविद्यालय प्रवेश के लिए OpenPrimer की पढ़ाई का उपयोग कर सकता हूँ?", a: "नहीं। विश्वविद्यालय प्रवेश कार्यालय OpenPrimer पूर्णता रिकॉर्ड को मान्यता नहीं देते। विश्वविद्यालय में प्रवेश के लिए आपको मान्यता प्राप्त संस्थानों से आधिकारिक योग्यताएं प्राप्त करनी होंगी।" },
      { q: "क्या मैं अपने CV में OpenPrimer का उल्लेख कर सकता हूँ?", a: "आप OpenPrimer का उल्लेख व्यक्तिगत शिक्षण पहल के रूप में कर सकते हैं, जैसे कोई ऑनलाइन MOOC। हालाँकि, इसे अकादमिक डिग्री या प्रमाणित योग्यता के रूप में प्रस्तुत नहीं किया जा सकता, जो अकादमिक धोखाधड़ी हो सकती है।" },
      { q: "क्या OpenPrimer पाठ्यक्रम पूरा करना अकादमिक दक्षता साबित करता है?", a: "पूर्णता व्यक्तिगत जुड़ाव को दर्शाती है, लेकिन यह मानकीकृत, बाहरी रूप से मान्य मूल्यांकन नहीं है। इसका संस्थाओं या नियोक्ताओं द्वारा मान्यता प्राप्त अकादमिक योग्यता के प्रमाण के रूप में कोई कानूनी महत्व नहीं है।" },
      { q: "क्या सामग्री प्रमाणित प्रोफेसरों द्वारा बनाई जाती है?", a: "सभी पाठ्यक्रम सामग्री कृत्रिम बुद्धिमत्ता मॉडल द्वारा स्वायत्त रूप से उत्पन्न की जाती है और OpenPrimer की संपादकीय टीम द्वारा समीक्षा की जाती है। इसे लाइसेंस प्राप्त प्रोफेसरों, मान्यता प्राप्त अकादमिक संस्थानों या सहकर्मी-समीक्षा निकायों द्वारा नहीं लिखा या प्रमाणित किया गया है।" },
      { q: "क्या OpenPrimer औपचारिक शिक्षा का विकल्प है?", a: "नहीं। OpenPrimer एक पूरक स्व-अध्ययन उपकरण के रूप में डिज़ाइन किया गया है, न कि औपचारिक स्कूली शिक्षा, विश्वविद्यालय शिक्षा या प्रमाणित व्यावसायिक प्रशिक्षण के विकल्प के रूप में।" },
      { q: "OpenPrimer पाठ्यक्रम की कानूनी स्थिति क्या है?", a: "OpenPrimer पाठ्यक्रम सामग्री के लिए CC BY-NC-SA 4.0 और सॉफ़्टवेयर के लिए MIT लाइसेंस के तहत 'जैसा है' प्रदान किए जाते हैं। इनका कोई कानूनी प्रमाणीकरण मूल्य नहीं है।" },
      { q: "क्या OpenPrimer पर कोई शुल्क या भुगतान प्रमाणन है?", a: "नहीं। OpenPrimer पूरी तरह से मुफ़्त और ओपन-सोर्स है। यह कोई भुगतान प्रमाणन कार्यक्रम नहीं प्रदान करता। OpenPrimer प्रमाणपत्र जारी करने का दावा करने वाला कोई भी तृतीय पक्ष धोखाधड़ी माना जाना चाहिए।" },
      { q: "आधिकारिक रूप से मान्यता प्राप्त ऑनलाइन योग्यताएं कहाँ मिलती हैं?", a: "मान्यता प्राप्त ऑनलाइन डिग्री के लिए Coursera, edX या अपने देश के राष्ट्रीय दूरस्थ शिक्षा विश्वविद्यालयों से संपर्क करें।" }
    ]
  },
  UR: {
    title: "اکثر پوچھے جانے والے سوالات",
    subtitle: "OpenPrimer کیا ہے — اور کیا نہیں ہے، اس بارے میں شفافیت۔",
    disclaimer_banner: "OpenPrimer خود رہنمائی سیکھنے کا پلیٹ فارم ہے۔ یہ کسی بھی قسم کی تعلیمی ڈگری، ڈپلومہ یا یونیورسٹی ایکریڈیشن فراہم نہیں کرتا۔",
    items: [
      { q: "کیا OpenPrimer ڈپلومے یا ڈگریاں دیتا ہے؟", a: "نہیں۔ OpenPrimer کوئی ڈپلومہ، بیچلر، ماسٹر، ڈاکٹریٹ یا کوئی دیگر سرکاری طور پر تسلیم شدہ تعلیمی سند نہیں دیتا۔ اس پلیٹ فارم کے مکمل کرنے کے سرٹیفکیٹ یونیورسٹیوں، آجروں یا حکومتی اداروں کے نزدیک کوئی قانونی یا تعلیمی حیثیت نہیں رکھتے۔" },
      { q: "کیا OpenPrimer کسی یونیورسٹی یا سرکاری ادارے سے منظور شدہ ہے؟", a: "نہیں۔ OpenPrimer کسی قومی یا بین الاقوامی یونیورسٹی، اعلیٰ تعلیمی اتھارٹی، وزارت تعلیم یا پیشہ ورانہ ریگولیٹری ادارے سے منظور شدہ نہیں ہے۔ یہ ایک آزاد اوپن سورس تعلیمی منصوبہ ہے۔" },
      { q: "کیا میں یونیورسٹی داخلے کے لیے OpenPrimer کی تعلیم استعمال کر سکتا ہوں؟", a: "نہیں۔ یونیورسٹی داخلہ دفاتر OpenPrimer کے مکمل کرنے کے ریکارڈ کو تسلیم نہیں کرتے۔ یونیورسٹی میں داخلے کے لیے آپ کو منظور شدہ اداروں سے باضابطہ قابلیتیں حاصل کرنی ہوں گی۔" },
      { q: "کیا میں اپنے CV میں OpenPrimer کا ذکر کر سکتا ہوں؟", a: "آپ OpenPrimer کا ذکر ذاتی سیکھنے کی پہل کے طور پر کر سکتے ہیں جیسے آن لائن MOOC۔ تاہم اسے تعلیمی ڈگری یا تصدیق شدہ قابلیت کے طور پر پیش نہیں کیا جا سکتا، جو تعلیمی دھوکہ دہی ہو سکتی ہے۔" },
      { q: "کیا OpenPrimer کورس مکمل کرنا تعلیمی مہارت ثابت کرتا ہے؟", a: "کورس مکمل کرنا ذاتی مشغولیت ظاہر کرتا ہے، لیکن یہ معیاری، بیرونی طور پر تصدیق شدہ تشخیص نہیں ہے۔ اداروں یا آجروں کی طرف سے تسلیم شدہ تعلیمی قابلیت کے ثبوت کے طور پر اس کی کوئی قانونی حیثیت نہیں۔" },
      { q: "کیا مواد تصدیق شدہ پروفیسرز بناتے ہیں؟", a: "تمام کورس مواد مصنوعی ذہانت کے ماڈلز کے ذریعے خودکار طریقے سے تیار کیا جاتا ہے اور OpenPrimer کی ادارتی ٹیم کے ذریعے جائزہ لیا جاتا ہے۔ اسے لائسنس یافتہ پروفیسرز، منظور شدہ تعلیمی اداروں یا ہم مرتبہ جائزہ کمیٹیوں نے نہیں لکھا۔" },
      { q: "کیا OpenPrimer رسمی تعلیم کا متبادل ہے؟", a: "نہیں۔ OpenPrimer ایک تکمیلی خود مطالعہ آلے کے طور پر ڈیزائن کیا گیا ہے، نہ کہ رسمی اسکولنگ، یونیورسٹی تعلیم یا تصدیق شدہ پیشہ ورانہ تربیت کے متبادل کے طور پر۔" },
      { q: "OpenPrimer کورس کی قانونی حیثیت کیا ہے؟", a: "OpenPrimer کورسز مواد کے لیے CC BY-NC-SA 4.0 اور سافٹ ویئر کے لیے MIT لائسنس کے تحت 'جیسا ہے' فراہم کیے جاتے ہیں۔ ان کی کوئی قانونی سرٹیفیکیشن قدر نہیں۔" },
      { q: "کیا OpenPrimer پر کوئی فیس یا ادائیگی شدہ سرٹیفیکیشن ہے؟", a: "نہیں۔ OpenPrimer مکمل طور پر مفت اور اوپن سورس ہے۔ یہ کوئی ادائیگی شدہ سرٹیفیکیشن پروگرام پیش نہیں کرتا۔ OpenPrimer سرٹیفکیٹ جاری کرنے کا دعوی کرنے والا کوئی بھی فریق ثالث دھوکہ باز سمجھا جانا چاہیے۔" },
      { q: "سرکاری طور پر تسلیم شدہ آن لائن قابلیتیں کہاں سے ملتی ہیں؟", a: "تسلیم شدہ آن لائن ڈگریوں کے لیے Coursera، edX یا اپنے ملک کی قومی فاصلاتی تعلیم یونیورسٹیوں سے رابطہ کریں۔" }
    ]
  }
};

export const FaqPage = () => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang.toUpperCase() as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const key = lang.toUpperCase() as keyof typeof FAQ_DATA;
  const d = FAQ_DATA[key] || FAQ_DATA.EN;
  const isRTL = lang.toUpperCase() === 'AR' || lang.toUpperCase() === 'UR';

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
      <TopNav />
      <div className="max-w-4xl mx-auto px-8 pt-32 pb-24">

        {/* Header */}
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <HelpCircle className="w-3 h-3" /> FAQ
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-[0.95] bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-red-400">
            {d.title}
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">{d.subtitle}</p>
        </header>

        {/* Disclaimer Banner */}
        <div className="mb-16 p-6 rounded-3xl bg-red-500/5 border border-red-500/20 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-2xl bg-red-600/20 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-red-300 text-sm leading-relaxed font-medium">{d.disclaimer_banner}</p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 mb-20">
          {d.items.map((item, i) => (
            <div
              key={i}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden ${openIndex === i ? 'border-amber-500/30 bg-slate-900/60' : 'border-slate-800 bg-slate-900/20 hover:border-slate-700'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-8 py-6 text-left gap-4"
              >
                <span className="font-bold text-slate-100 text-sm leading-relaxed pr-4">{item.q}</span>
                <div className={`shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${openIndex === i ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {openIndex === i && (
                <div className="px-8 pb-7">
                  <div className="h-px bg-slate-800/60 mb-5" />
                  <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="p-12 bg-gradient-to-br from-slate-900/60 to-transparent border border-slate-800 rounded-[60px] text-center">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-800">
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-black tracking-tighter mb-4 text-slate-100">
            {lang.toUpperCase() === 'FR' ? 'Commencer à apprendre gratuitement' :
             lang.toUpperCase() === 'ES' ? 'Empezar a aprender gratis' :
             lang.toUpperCase() === 'DE' ? 'Kostenlos lernen beginnen' :
             lang.toUpperCase() === 'AR' ? 'ابدأ التعلم مجاناً' :
             lang.toUpperCase() === 'ZH' ? '免费开始学习' :
             lang.toUpperCase() === 'PT' ? 'Comece a aprender gratuitamente' :
             lang.toUpperCase() === 'HI' ? 'मुफ़्त में सीखना शुरू करें' :
             lang.toUpperCase() === 'UR' ? 'مفت سیکھنا شروع کریں' :
             'Start Learning for Free'}
          </h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            {lang.toUpperCase() === 'FR' ? 'OpenPrimer est un outil pédagogique libre et gratuit. Aucune inscription requise pour commencer.' :
             lang.toUpperCase() === 'ES' ? 'OpenPrimer es una herramienta pedagógica libre y gratuita. No se requiere registro para comenzar.' :
             lang.toUpperCase() === 'DE' ? 'OpenPrimer ist ein freies, kostenloses Lernwerkzeug. Keine Registrierung erforderlich.' :
             lang.toUpperCase() === 'AR' ? 'OpenPrimer أداة تعليمية مجانية ومفتوحة. لا يلزم التسجيل للبدء.' :
             lang.toUpperCase() === 'ZH' ? 'OpenPrimer 是免费开放的教学工具，无需注册即可开始。' :
             lang.toUpperCase() === 'PT' ? 'OpenPrimer é uma ferramenta pedagógica gratuita e aberta. Não é necessário registo para começar.' :
             lang.toUpperCase() === 'HI' ? 'OpenPrimer एक मुफ़्त और खुला शिक्षण उपकरण है। शुरुआत के लिए पंजीकरण आवश्यक नहीं।' :
             lang.toUpperCase() === 'UR' ? 'OpenPrimer ایک مفت اور کھلا تعلیمی آلہ ہے۔ شروع کرنے کے لیے رجسٹریشن ضروری نہیں۔' :
             'OpenPrimer is a free, open pedagogical tool. No signup required to begin.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog" className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all shadow-xl">
              {t.catalog} <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/legal" className="inline-flex items-center gap-3 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">
              {t.legal_notice} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};
