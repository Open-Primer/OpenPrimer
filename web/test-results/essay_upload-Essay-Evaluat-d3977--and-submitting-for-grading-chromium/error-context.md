# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: essay_upload.spec.ts >> Essay Evaluation Upload & Grading Test >> should allow switching to file upload tab, dropping a file, and submitting for grading
- Location: tests\essay_upload.spec.ts:28:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h4:has-text("Évaluation du Tuteur IA")')
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 20000ms
  - waiting for locator('h4:has-text("Évaluation du Tuteur IA")')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e4]:
        - button [ref=e5]:
          - img [ref=e6]
        - link "OPENPRIMER" [ref=e7] [cursor=pointer]:
          - /url: /
          - img [ref=e11]
          - generic [ref=e15]: OPENPRIMER
        - link "Parcourir le Catalogue" [ref=e16] [cursor=pointer]:
          - /url: /catalog
      - generic [ref=e17]:
        - button "🇫🇷 Français" [ref=e19]:
          - generic [ref=e20]: 🇫🇷
          - generic [ref=e21]: Français
          - img [ref=e22]
        - generic [ref=e24]:
          - button "Défaut" [ref=e25]
          - button "Papier" [ref=e26]
          - button "Focus" [ref=e27]
        - button [ref=e28]:
          - img [ref=e29]
        - generic [ref=e36]:
          - button "Se connecter" [ref=e37] [cursor=pointer]
          - button "S'inscrire" [ref=e38] [cursor=pointer]
    - generic [ref=e39]:
      - complementary [ref=e40]:
        - generic [ref=e42]:
          - img
          - textbox "Rechercher dans ce cours..." [ref=e43]
        - generic [ref=e45]:
          - heading "Vue d'ensemble" [level=4] [ref=e46]
          - generic [ref=e47]:
            - link "Introduction" [ref=e48] [cursor=pointer]:
              - /url: /fr/l1/droit_des_entreprises/introduction
              - img [ref=e49]
              - generic [ref=e51]: Introduction
            - link "Introduction au Droit des Affaires et à l'Entreprise" [ref=e52] [cursor=pointer]:
              - /url: /fr/l1/droit_des_entreprises/introduction-droit-affaires-entreprise
              - img [ref=e53]
              - generic [ref=e55]: Introduction au Droit des Affaires et à l'Entreprise
            - link "Les Acteurs et les Formes Juridiques de l'Entreprise" [ref=e56] [cursor=pointer]:
              - /url: /fr/l1/droit_des_entreprises/acteurs-formes-juridiques-entreprise
              - img [ref=e57]
              - generic [ref=e59]: Les Acteurs et les Formes Juridiques de l'Entreprise
            - link "Le Fonctionnement et la Gouvernance de l'Entreprise" [ref=e60] [cursor=pointer]:
              - /url: /fr/l1/droit_des_entreprises/fonctionnement-gouvernance-entreprise
              - img [ref=e61]
              - generic [ref=e63]: Le Fonctionnement et la Gouvernance de l'Entreprise
            - link "Les Contrats et Opérations Courantes de l'Entreprise" [ref=e64] [cursor=pointer]:
              - /url: /fr/l1/droit_des_entreprises/contrats-operations-courantes-entreprise
              - img [ref=e65]
              - generic [ref=e67]: Les Contrats et Opérations Courantes de l'Entreprise
            - link "Les Difficultés de l'Entreprise et les Procédures Collectives" [ref=e68] [cursor=pointer]:
              - /url: /fr/l1/droit_des_entreprises/difficultes-procedures-collectives
              - img [ref=e69]
              - generic [ref=e72]: Les Difficultés de l'Entreprise et les Procédures Collectives
      - main [ref=e73]:
        - generic [ref=e75]:
          - generic [ref=e76]:
            - generic [ref=e77]:
              - link "droit des entreprises" [ref=e78] [cursor=pointer]:
                - /url: /catalog
              - img [ref=e79]
              - generic [ref=e81]: Les Difficultés de l'Entreprise et les Procédures Collectives
              - img [ref=e82]
              - generic [ref=e84]: Les Difficultés de l'Entreprise et les Procédures Collectives
            - button "Exporter" [ref=e87] [cursor=pointer]:
              - img [ref=e88]
              - generic [ref=e91]: Exporter
          - generic [ref=e92]:
            - generic [ref=e94]: Niveau L1
            - heading "Les Difficultés de l'Entreprise et les Procédures Collectives" [level=1] [ref=e95]
          - article [ref=e97]:
            - generic [ref=e98]:
              - generic [ref=e100]:
                - img [ref=e101]
                - text: Test Diagnostique Adaptatif
              - generic [ref=e104]:
                - generic [ref=e105]:
                  - text: "Testez vos connaissances pour passer directement à la suite :"
                  - paragraph [ref=e106]: Quelle est la principale différence entre une procédure de prévention (comme le mandat ad hoc) et une procédure collective (comme la sauvegarde) ?
                - generic [ref=e107]:
                  - button "Les procédures de prévention sont confidentielles et visent à éviter la cessation des paiements, tandis que les procédures collectives sont publiques et interviennent après la cessation des paiements." [ref=e108] [cursor=pointer]
                  - button "Les procédures de prévention sont gérées par le tribunal de commerce, alors que les procédures collectives sont gérées par les créanciers." [ref=e109] [cursor=pointer]
                  - button "Les procédures de prévention concernent uniquement les grandes entreprises, et les procédures collectives les petites et moyennes entreprises." [ref=e110] [cursor=pointer]
                  - button "Il n'y a pas de différence significative, les termes sont interchangeables." [ref=e111] [cursor=pointer]
                - button "Vérifier" [disabled] [ref=e112] [cursor=pointer]
            - 'heading "Introduction : Naviguer dans la Tempête Économique" [level=2] [ref=e113]'
            - paragraph [ref=e114]: Le monde des affaires est intrinsèquement lié à des cycles économiques, des innovations disruptives et des aléas imprévus. Si la création d'entreprise est souvent perçue comme un acte d'optimisme et de dynamisme, la réalité révèle qu'une part significative des entreprises rencontre, à un moment ou à un autre de leur existence, des difficultés plus ou moins importantes. Ces difficultés peuvent aller de simples tensions de trésorerie à une véritable cessation des paiements, menaçant la survie même de l'activité. La capacité d'une entreprise à anticiper et à gérer ces périodes critiques est un indicateur fondamental de sa résilience et de sa pérennité.
            - paragraph [ref=e115]: Le droit des entreprises, et plus spécifiquement le droit des procédures collectives, offre un cadre juridique destiné à anticiper, prévenir et, si nécessaire, traiter ces situations délicates. Loin d'être une simple sanction de l'échec entrepreneurial, ces mécanismes sont conçus comme des outils de gestion de crise, visant à sauvegarder l'activité économique, maintenir l'emploi et apurer le passif dans les meilleures conditions possibles. Pour l'étudiant en première année de droit (L1), comprendre ces dispositifs est fondamental pour appréhender la complexité des relations économiques et la fonction protectrice du droit dans un environnement commercial dynamique et parfois hostile.
            - paragraph [ref=e116]: Ce cours adoptera une démarche progressive, partant des concepts fondamentaux pour aboutir à des problématiques plus complexes. Nous définirons les notions clés, analyserons les textes législatifs pertinents, et étudierons les cas pratiques pour développer votre esprit critique et votre capacité d'argumentation juridique face aux défaillances d'entreprise. L'objectif est de vous fournir une grille d'analyse rigoureuse pour évaluer les situations de crise et identifier les solutions juridiques les plus adaptées.
            - generic [ref=e117]:
              - generic [ref=e118]:
                - img [ref=e119]
                - generic [ref=e122]: Complétez les espaces vides
              - generic [ref=e123]: Le droit des entreprises en difficulté vise principalement à l'activité économique, maintenir l' et apurer le .
              - button "Valider" [ref=e125] [cursor=pointer]
              - generic [ref=e126]:
                - text: 💡 En mode invité, votre progression est temporaire.
                - button "Créer un compte gratuit" [ref=e127] [cursor=pointer]
                - text: ou
                - button "se connecter" [ref=e128] [cursor=pointer]
                - text: pour la sauvegarder définitivement et débloquer votre tuteur IA personnel !
            - generic [ref=e129]:
              - generic [ref=e130]:
                - img [ref=e131]
                - generic [ref=e134]: Complétez les espaces vides
              - generic [ref=e135]: Les procédures de sont confidentielles et interviennent avant la des paiements, tandis que les procédures sont publiques et interviennent généralement après.
              - button "Valider" [ref=e137] [cursor=pointer]
              - generic [ref=e138]:
                - text: 💡 En mode invité, votre progression est temporaire.
                - button "Créer un compte gratuit" [ref=e139] [cursor=pointer]
                - text: ou
                - button "se connecter" [ref=e140] [cursor=pointer]
                - text: pour la sauvegarder définitivement et débloquer votre tuteur IA personnel !
            - heading "I. Comprendre la Défaillance de l'Entreprise" [level=2] [ref=e141]
            - paragraph [ref=e142]: Avant d'explorer les mécanismes juridiques, il est essentiel de cerner ce que l'on entend par "difficultés de l'entreprise" et de distinguer les différents degrés de gravité qui peuvent affecter une entité économique. Cette compréhension nuancée est la première étape pour choisir la procédure la plus pertinente.
            - heading "A. La Notion de Difficultés de l'Entreprise" [level=3] [ref=e143]
            - paragraph [ref=e144]: La notion de difficultés de l'entreprise est large et englobe toutes les situations susceptibles de compromettre la pérennité de l'activité. Elle ne se limite pas à la seule cessation des paiements, qui est le seuil d'ouverture des procédures de redressement et de liquidation judiciaire. Les difficultés peuvent être financières, économiques, juridiques ou sociales.
            - generic [ref=e145]:
              - generic [ref=e146]:
                - img [ref=e148]
                - generic [ref=e150]: Note
              - paragraph [ref=e152]:
                - strong [ref=e153]: Définition Juridique et Économique
                - text: Juridiquement, les difficultés sont des situations qui, sans nécessairement caractériser la cessation des paiements, sont de nature à menacer la continuité de l'exploitation. Elles peuvent se traduire par une dégradation des fonds propres, une perte de rentabilité, ou des tensions de trésorerie. Économiquement, elles se manifestent par des déséquilibres financiers (trésorerie négative, rentabilité insuffisante), opérationnels (baisse d'activité, perte de marchés significatifs, problèmes de production) ou structurels (problèmes de gouvernance, obsolescence technologique, dépendance excessive).
            - paragraph [ref=e154]: Les signes avant-coureurs sont multiples et doivent être détectés le plus tôt possible pour permettre une intervention efficace. Ils peuvent être d'ordre financier (baisse du chiffre d'affaires, dégradation des marges, retards de paiement des clients, difficultés à obtenir des crédits bancaires, augmentation des découverts bancaires), économique (perte de parts de marché, concurrence accrue, dépendance excessive vis-à-vis d'un client ou fournisseur, évolution défavorable du secteur d'activité), ou social (tensions avec le personnel, démissions clés, absentéisme élevé, grèves).
            - heading "B. Les Causes des Difficultés" [level=3] [ref=e155]
            - paragraph [ref=e156]: "Les causes des difficultés d'une entreprise sont variées et peuvent être classées en deux grandes catégories : les facteurs internes, qui relèvent de la gestion et de l'organisation de l'entreprise, et les facteurs externes, qui sont liés à l'environnement économique et réglementaire."
            - list [ref=e157]:
              - listitem [ref=e158]:
                - paragraph [ref=e159]:
                  - strong [ref=e160]: Facteurs Internes
                - list [ref=e161]:
                  - listitem [ref=e162]:
                    - strong [ref=e163]: Mauvaise gestion
                    - text: ": Absence de stratégie claire, erreurs de management (ex: investissements inappropriés, gestion de trésorerie défaillante, politique commerciale inadaptée), manque de compétences managériales."
                  - listitem [ref=e164]:
                    - strong [ref=e165]: Problèmes de production ou de qualité
                    - text: ": Coûts de production trop élevés, produits défectueux, retards de livraison, incapacité à innover ou à s'adapter aux nouvelles technologies."
                  - listitem [ref=e166]:
                    - strong [ref=e167]: Structure financière déséquilibrée
                    - text: ": Endettement excessif par rapport aux fonds propres, fonds propres insuffisants pour absorber les pertes, mauvaise gestion du besoin en fonds de roulement."
                  - listitem [ref=e168]:
                    - strong [ref=e169]: Conflits internes
                    - text: ": Désaccords profonds entre associés, problèmes de succession non anticipés, démotivation du personnel clé."
              - listitem [ref=e170]:
                - paragraph [ref=e171]:
                  - strong [ref=e172]: Facteurs Externes
                - list [ref=e173]:
                  - listitem [ref=e174]:
                    - strong [ref=e175]: Conjoncture économique défavorable
                    - text: ": Crise économique générale, récession sectorielle, inflation galopante, hausse des taux d'intérêt."
                  - listitem [ref=e176]:
                    - strong [ref=e177]: Évolution du marché
                    - text: ": Changement rapide des habitudes de consommation, apparition de nouvelles technologies rendant les produits ou services obsolètes, saturation du marché."
                  - listitem [ref=e178]:
                    - strong [ref=e179]: Concurrence accrue
                    - text: ": Arrivée de nouveaux acteurs agressifs, dumping, guerre des prix."
                  - listitem [ref=e180]:
                    - strong [ref=e181]: Évolution réglementaire ou législative
                    - text: ": Nouvelles normes environnementales, fiscales ou sociales coûteuses, restrictions d'activité."
                  - listitem [ref=e182]:
                    - strong [ref=e183]: Catastrophes naturelles ou sanitaires
                    - text: ": Pandémies (ex: COVID-19), inondations, incendies, cyberattaques majeures."
            - generic [ref=e184]:
              - generic [ref=e185]:
                - img [ref=e187]
                - generic [ref=e190]: Le saviez-vous ?
              - paragraph [ref=e192]: Saviez-vous que, selon l'INSEE, près de la moitié des entreprises créées en France ne dépassent pas le cap des cinq ans d'existence ? Les difficultés économiques et de gestion sont les principales causes de ces disparitions, soulignant l'importance cruciale des mécanismes de prévention et de traitement des défaillances. Une étude de l'Observatoire des défaillances d'entreprises révèle que les TPE/PME sont particulièrement vulnérables aux chocs externes et aux erreurs de gestion.
            - heading "II. Les Procédures de Prévention des Difficultés" [level=2] [ref=e193]
            - paragraph [ref=e194]:
              - text: Le législateur a mis en place des dispositifs visant à détecter et à traiter les difficultés d'une entreprise
              - emphasis [ref=e195]: avant
              - text: qu'elle n'atteigne l'état de cessation des paiements. Ces procédures sont caractérisées par leur nature confidentielle et leur objectif de permettre à l'entreprise de se redresser discrètement, sans altérer sa réputation ou la confiance de ses partenaires commerciaux et financiers. Elles incarnent une approche proactive du droit des entreprises en difficulté.
            - heading "A. Le Mandat Ad Hoc" [level=3] [ref=e196]
            - paragraph [ref=e197]: Le mandat ad hoc est la procédure préventive la plus souple et la plus confidentielle.
            - list [ref=e198]:
              - listitem [ref=e199]:
                - strong [ref=e200]: Conditions d'ouverture
                - text: ": L'entreprise ne doit pas être en cessation des paiements. La demande est faite par le dirigeant de l'entreprise (personne physique ou morale) au président du tribunal de commerce (ou du tribunal judiciaire pour les non-commerçants). La décision d'ouverture est discrétionnaire pour le président."
              - listitem [ref=e201]:
                - strong [ref=e202]: Objectif
                - text: ": Négocier des accords amiables avec les principaux créanciers (banques, fournisseurs stratégiques, administration fiscale et sociale) pour rééchelonner les dettes, obtenir de nouveaux financements, ou restructurer l'entreprise. Il s'agit de trouver des solutions consensuelles pour surmonter les difficultés."
              - listitem [ref=e203]:
                - strong [ref=e204]: Déroulement
                - text: ": Le président du tribunal désigne un mandataire ad hoc (souvent un administrateur judiciaire expérimenté) dont la mission est d'aider le dirigeant dans ses négociations. Le mandataire n'a aucun pouvoir de gestion et son rôle est purement consultatif, de médiation et de facilitation. La procédure est très souple, non contraignante pour le débiteur et sa durée est fixée librement par le président du tribunal, généralement pour quelques mois, renouvelable."
              - listitem [ref=e205]:
                - strong [ref=e206]: Effets
                - text: ": Les accords obtenus ne sont pas homologués par le tribunal et restent strictement confidentiels. Ils n'ont d'effet qu'entre les parties signataires, ce qui préserve la réputation de l'entreprise mais limite leur opposabilité."
            - heading "B. La Conciliation" [level=3] [ref=e207]
            - paragraph [ref=e208]: La conciliation est une procédure également amiable et confidentielle, mais avec des spécificités qui la distinguent du mandat ad hoc, notamment la possibilité d'homologation de l'accord.
            - list [ref=e209]:
              - listitem [ref=e210]:
                - strong [ref=e211]: Conditions d'ouverture
                - text: ": L'entreprise doit éprouver des difficultés juridiques, économiques ou financières avérées ou prévisibles, mais ne doit pas être en cessation des paiements depuis plus de 45 jours. Cette limite temporelle est cruciale. La demande est faite par le dirigeant au président du tribunal de commerce."
              - listitem [ref=e212]:
                - strong [ref=e213]: Objectif
                - text: ": Parvenir à un accord amiable avec les créanciers pour mettre fin aux difficultés et assurer la pérennité de l'entreprise."
              - listitem [ref=e214]:
                - strong [ref=e215]: Déroulement
                - text: ": Le président du tribunal désigne un conciliateur pour une durée maximale de 4 mois, renouvelable une fois (soit 5 mois au total). Le conciliateur a pour mission de favoriser la conclusion d'un accord entre le débiteur et ses principaux créanciers."
              - listitem [ref=e216]:
                - strong [ref=e217]: Effets
                - text: ": L'accord de conciliation peut être constaté par le président du tribunal ou homologué par jugement."
                - list [ref=e218]:
                  - listitem [ref=e219]:
                    - strong [ref=e220]: Accord constaté
                    - text: ": Il reste confidentiel et n'a d'effet qu'entre les parties signataires."
                  - listitem [ref=e221]:
                    - strong [ref=e222]: Accord homologué
                    - text: ": L'homologation lui confère une force exécutoire et le rend opposable à tous, y compris aux créanciers non signataires s'ils ont été informés et que l'accord ne porte pas atteinte à leurs droits. Elle permet également de bénéficier de privilèges pour les nouveaux apports de trésorerie (privilège de conciliation, dit \"privilège de new money\"), incitant ainsi les partenaires financiers à soutenir l'entreprise. L'homologation rend l'accord public."
            - generic [ref=e223]:
              - generic [ref=e224]:
                - generic [ref=e225]:
                  - img [ref=e227]
                  - generic [ref=e229]: Événement Historique
                - generic [ref=e230]: "2005"
              - heading "La loi de sauvegarde des entreprises de 2005" [level=5] [ref=e231]
              - paragraph [ref=e233]: La loi n°2005-845 du 26 juillet 2005, dite loi de sauvegarde des entreprises, a profondément réformé le droit des entreprises en difficulté en France. Elle a introduit la procédure de sauvegarde et renforcé les procédures de prévention comme le mandat ad hoc et la conciliation, marquant un tournant vers une approche plus protectrice de l'entreprise et de l'emploi. Cette réforme s'est largement inspirée du chapitre 11 du droit américain des faillites, qui privilégie la réorganisation et le sauvetage des entreprises viables.
            - heading "C. L'Alerte" [level=3] [ref=e234]
            - paragraph [ref=e235]: La procédure d'alerte est un mécanisme de détection précoce des difficultés, déclenché par certains acteurs internes ou externes à l'entreprise, avant même que les difficultés ne soient avérées au point de nécessiter un mandat ad hoc ou une conciliation.
            - list [ref=e236]:
              - listitem [ref=e237]:
                - paragraph [ref=e238]:
                  - strong [ref=e239]: Acteurs de l'alerte
                  - text: ":"
                - list [ref=e240]:
                  - listitem [ref=e241]:
                    - strong [ref=e242]: Commissaire aux comptes
                    - text: ": S'il constate des faits de nature à compromettre la continuité de l'exploitation, il doit en informer le dirigeant, puis le conseil d'administration/surveillance, et enfin le président du tribunal de commerce si les mesures prises sont insuffisantes ou inefficaces."
                  - listitem [ref=e243]:
                    - strong [ref=e244]: Associés
                    - text: ": Les associés peuvent poser des questions écrites aux dirigeants sur tout fait de nature à compromettre la continuité de l'exploitation."
                  - listitem [ref=e245]:
                    - strong [ref=e246]: Comité social et économique (CSE)
                    - text: ": Les représentants du personnel peuvent exercer un droit d'alerte en cas de faits préoccupants concernant la situation économique de l'entreprise."
                  - listitem [ref=e247]:
                    - strong [ref=e248]: Président du tribunal de commerce
                    - text: ": Il peut, de sa propre initiative, convoquer le dirigeant d'une entreprise qui ne dépose pas ses comptes annuels ou dont les comptes révèlent des difficultés manifestes."
              - listitem [ref=e249]:
                - paragraph [ref=e250]:
                  - strong [ref=e251]: Objectif
                  - text: ": Attirer l'attention des dirigeants sur les difficultés potentielles ou avérées et les inciter à prendre des mesures correctives avant qu'il ne soit trop tard, c'est-à-dire avant l'état de cessation des paiements."
              - listitem [ref=e252]:
                - paragraph [ref=e253]:
                  - strong [ref=e254]: Effets
                  - text: ": La procédure d'alerte n'est pas une procédure collective. Elle vise à provoquer une réaction des dirigeants et, si nécessaire, à les orienter vers les procédures amiables de prévention (mandat ad hoc, conciliation) ou, en dernier recours, vers des procédures collectives si la situation est déjà trop dégradée."
            - generic [ref=e255]:
              - generic [ref=e256]:
                - img [ref=e258]
                - generic [ref=e262]: "L'efficacité de la prévention : un défi constant"
              - paragraph [ref=e264]: Les procédures de prévention sont souvent saluées pour leur capacité à sauver des entreprises avant qu'elles ne soient trop malades. Cependant, leur efficacité dépend largement de la réactivité et de la bonne foi des dirigeants, ainsi que de la capacité des mandataires à trouver des solutions acceptables pour toutes les parties prenantes. Ne pensez-vous pas que la réticence des dirigeants à admettre leurs difficultés et à solliciter ces procédures confidentielles constitue le principal frein à leur succès ? Comment pourrait-on encourager une utilisation plus précoce et plus systématique de ces outils, par exemple en déstigmatisant le recours à ces procédures ou en renforçant les mécanismes d'alerte ?
            - heading "III. Les Procédures Collectives de Traitement" [level=2] [ref=e265]
            - paragraph [ref=e266]: Lorsque les difficultés sont trop importantes pour être résolues par les procédures de prévention, ou que l'entreprise est en état de cessation des paiements, les procédures collectives s'imposent. Elles sont judiciaires, publiques et visent à organiser collectivement le sort de l'entreprise et de ses créanciers, sous le contrôle du tribunal.
            - heading "A. Principes Généraux et Acteurs" [level=3] [ref=e267]
            - paragraph [ref=e268]: "Les procédures collectives sont régies par le Code de commerce (Livre VI). Elles reposent sur plusieurs principes fondamentaux :"
            - list [ref=e269]:
              - listitem [ref=e270]:
                - strong [ref=e271]: Principe de l'égalité des créanciers
                - text: "(paritas creditorum) : Tous les créanciers sont traités de manière égale, sous l'égide du tribunal, sauf exceptions légales (créanciers privilégiés, salariés). Ce principe interdit les paiements préférentiels."
              - listitem [ref=e272]:
                - strong [ref=e273]: Principe de la collectivité
                - text: ": La procédure s'applique à l'ensemble des créanciers, qui ne peuvent plus agir individuellement pour recouvrer leurs dettes. Leurs droits sont exercés collectivement dans le cadre de la procédure."
              - listitem [ref=e274]:
                - strong [ref=e275]: Principe de la protection de l'entreprise
                - text: ": L'objectif premier est de sauvegarder l'activité économique, maintenir l'emploi et apurer le passif, plutôt que de simplement liquider les actifs."
            - paragraph [ref=e276]: "Les principaux acteurs de ces procédures sont des mandataires de justice et des organes du tribunal :"
            - list [ref=e277]:
              - listitem [ref=e278]:
                - strong [ref=e279]: Le Tribunal de commerce
                - text: "(ou Tribunal judiciaire pour les non-commerçants) : Juge de la procédure, il prononce l'ouverture, suit le déroulement, prend les décisions clés (ex: arrêt du plan, prononcé de la liquidation) et assure le contrôle de l'ensemble des opérations."
              - listitem [ref=e280]:
                - strong [ref=e281]: Le Juge-commissaire
                - text: ": Désigné par le tribunal, il est chargé de veiller au déroulement rapide de la procédure et à la protection des intérêts en présence (débiteur, créanciers, salariés). Il autorise certains actes importants."
              - listitem [ref=e282]:
                - strong [ref=e283]: L'Administrateur judiciaire
                - text: ": Mandataire de justice, il assiste ou remplace le dirigeant dans la gestion de l'entreprise pendant la période d'observation. Son rôle est de faciliter la réorganisation et l'élaboration du plan."
              - listitem [ref=e284]:
                - strong [ref=e285]: Le Mandataire judiciaire
                - text: ": Représentant des créanciers, il est chargé de vérifier les créances déclarées et d'assurer la défense de leurs intérêts collectifs."
              - listitem [ref=e286]:
                - strong [ref=e287]: Le Liquidateur judiciaire
                - text: ": En cas de liquidation, il est chargé de réaliser l'actif de l'entreprise (vendre les biens) et de répartir le produit entre les créanciers selon l'ordre légal."
              - listitem [ref=e288]:
                - strong [ref=e289]: Le Débiteur
                - text: "(dirigeant de l'entreprise) : Il conserve un rôle plus ou moins important selon la procédure, allant de l'assistance à un dessaisissement total."
              - listitem [ref=e290]:
                - strong [ref=e291]: Les Créanciers
                - text: ": Ils déclarent leurs créances et participent aux décisions collectives via les organes de représentation (comités de créanciers)."
            - heading "B. La Procédure de Sauvegarde" [level=3] [ref=e292]
            - paragraph [ref=e293]:
              - text: La procédure de sauvegarde est une procédure collective préventive, ouverte
              - emphasis [ref=e294]: avant
              - text: la cessation des paiements, à l'initiative exclusive du débiteur.
            - list [ref=e295]:
              - listitem [ref=e296]:
                - strong [ref=e297]: Conditions d'ouverture
                - text: ": L'entreprise doit justifier de difficultés qu'elle n'est pas en mesure de surmonter, mais elle ne doit pas être en cessation des paiements. La demande est faite"
                - emphasis [ref=e298]: uniquement
                - text: par le débiteur (le dirigeant).
              - listitem [ref=e299]:
                - strong [ref=e300]: Objectifs
                - text: ": Faciliter la réorganisation de l'entreprise pour permettre la poursuite de l'activité, le maintien de l'emploi et l'apurement du passif. C'est une procédure de restructuration qui vise à prévenir la cessation des paiements."
              - listitem [ref=e301]:
                - strong [ref=e302]: Déroulement
                - text: ":"
                - list [ref=e303]:
                  - listitem [ref=e304]:
                    - strong [ref=e305]: Jugement d'ouverture
                    - text: ": Le tribunal prononce l'ouverture de la sauvegarde et désigne un administrateur judiciaire et un mandataire judiciaire."
                  - listitem [ref=e306]:
                    - strong [ref=e307]: Période d'observation
                    - text: "(max. 6 mois, renouvelable 2 fois pour un total de 18 mois) : Le tribunal observe la situation de l'entreprise. L'administrateur judiciaire est désigné pour assister le débiteur dans la gestion. Le mandataire judiciaire est désigné pour représenter les créanciers et vérifier les créances."
                  - listitem [ref=e308]:
                    - strong [ref=e309]: Établissement d'un plan de sauvegarde
                    - text: ": L'administrateur, avec le débiteur, élabore un projet de plan de sauvegarde qui propose des mesures de réorganisation (rééchelonnement des dettes, cessions d'actifs non stratégiques, restructuration opérationnelle, etc.). Ce plan est soumis aux créanciers (via des comités ou consultations individuelles) et au tribunal."
                  - listitem [ref=e310]:
                    - strong [ref=e311]: Arrêt du plan de sauvegarde
                    - text: ": Si le plan est accepté et jugé viable, le tribunal l'arrête. Il s'impose alors à tous les créanciers concernés."
              - listitem [ref=e312]:
                - strong [ref=e313]: Effets
                - text: ":"
                - list [ref=e314]:
                  - listitem [ref=e315]:
                    - strong [ref=e316]: Suspension des poursuites individuelles
                    - text: ": Les créanciers ne peuvent plus agir en justice individuellement pour recouvrer leurs dettes antérieures à l'ouverture."
                  - listitem [ref=e317]:
                    - strong [ref=e318]: Interdiction de payer les dettes antérieures
                    - text: ": Le débiteur ne peut plus payer les dettes nées avant l'ouverture de la procédure."
                  - listitem [ref=e319]:
                    - strong [ref=e320]: Maintien du dirigeant
                    - text: ": Le dirigeant conserve ses pouvoirs de gestion, mais est assisté par l'administrateur judiciaire."
            - generic [ref=e321]:
              - generic [ref=e322]:
                - img [ref=e324]
                - heading "L'influence du droit américain sur la sauvegarde" [level=4] [ref=e326]
              - paragraph [ref=e328]: La procédure de sauvegarde française, introduite par la loi de 2005, est souvent présentée comme une transposition du "Chapter 11" du droit américain des faillites. Le Chapter 11 permet aux entreprises en difficulté de se réorganiser sous protection judiciaire, en suspendant les poursuites des créanciers et en élaborant un plan de redressement. Cette inspiration marque un changement de paradigme dans le droit français, passant d'une logique de sanction de l'échec à une logique de sauvetage de l'entreprise viable. Cependant, des différences notables subsistent, notamment en ce qui concerne le rôle des créanciers (plus actif aux États-Unis) et la flexibilité de la procédure. La France a cherché à adapter ce modèle à sa propre tradition juridique, en conservant un rôle central pour le juge et en encadrant davantage les négociations.
            - generic [ref=e329]:
              - generic [ref=e330]:
                - img [ref=e332]
                - generic [ref=e334]: Idée Brillante
              - heading "Le privilège de post-déclaration (ou 'privilège de new money')" [level=5] [ref=e335]
              - paragraph [ref=e337]: Une idée brillante du droit des procédures collectives est le "privilège de post-déclaration" ou "privilège de new money". Il permet aux créanciers qui ont apporté de nouveaux financements à l'entreprise dans le cadre d'un accord de conciliation homologué ou d'un plan de sauvegarde/redressement, d'être payés en priorité sur les autres créanciers en cas d'ouverture ultérieure d'une procédure collective. Ce mécanisme incitatif vise à encourager les partenaires financiers à soutenir l'entreprise en difficulté, en leur offrant une garantie de remboursement supérieure, essentielle pour la survie de l'entreprise.
            - heading "C. La Procédure de Redressement Judiciaire" [level=3] [ref=e338]
            - paragraph [ref=e339]: La procédure de redressement judiciaire est ouverte lorsque l'entreprise est en cessation des paiements et qu'un redressement est jugé possible. C'est la procédure collective "par défaut" lorsque la cessation des paiements est constatée.
            - list [ref=e340]:
              - listitem [ref=e341]:
                - strong [ref=e342]: Conditions d'ouverture
                - text: ": L'entreprise doit être en cessation des paiements, c'est-à-dire dans l'impossibilité de faire face à son passif exigible avec son actif disponible. La demande peut être faite par le débiteur (dans les 45 jours suivant la cessation des paiements), un créancier, ou le procureur de la République."
              - listitem [ref=e343]:
                - strong [ref=e344]: Objectifs
                - text: ": Poursuite de l'activité, maintien de l'emploi et apurement du passif. L'objectif est de permettre à l'entreprise de se redresser et de retrouver une situation saine."
              - listitem [ref=e345]:
                - strong [ref=e346]: Déroulement
                - text: ": Similaire à la sauvegarde, avec un jugement d'ouverture, une période d'observation (max. 6 mois, renouvelable 2 fois) et l'élaboration d'un plan de redressement. Cependant, le dirigeant est souvent dessaisi de ses pouvoirs de gestion, qui sont exercés par l'administrateur judiciaire, ou il est assisté mais sous un contrôle plus strict."
              - listitem [ref=e347]:
                - strong [ref=e348]: Effets
                - text: ": Suspension des poursuites individuelles, interdiction de payer les dettes antérieures. Le plan de redressement peut prévoir un rééchelonnement des dettes, des cessions d'actifs, voire un plan de continuation (maintien de l'activité) ou un plan de cession (vente de l'entreprise ou d'une partie de ses actifs à un repreneur)."
            - heading "D. La Procédure de Liquidation Judiciaire" [level=3] [ref=e349]
            - paragraph [ref=e350]: La procédure de liquidation judiciaire est la procédure la plus grave, ouverte lorsque le redressement de l'entreprise est manifestement impossible. Elle marque la fin de l'activité et la disparition de l'entreprise.
            - list [ref=e351]:
              - listitem [ref=e352]:
                - strong [ref=e353]: Conditions d'ouverture
                - text: ": L'entreprise doit être en cessation des paiements et son redressement doit être manifestement impossible. Cette impossibilité est appréciée par le tribunal. La demande peut être faite par le débiteur, un créancier, ou le procureur de la République."
              - listitem [ref=e354]:
                - strong [ref=e355]: Objectifs
                - text: ": Mettre fin à l'activité de l'entreprise, réaliser son actif (vendre ses biens) et désintéresser les créanciers par répartition du produit des ventes, selon un ordre de priorité légal."
              - listitem [ref=e356]:
                - strong [ref=e357]: Déroulement
                - text: ":"
                - list [ref=e358]:
                  - listitem [ref=e359]:
                    - strong [ref=e360]: Jugement d'ouverture
                    - text: ": Le tribunal prononce la liquidation judiciaire et désigne un liquidateur judiciaire. Il met fin à l'activité de l'entreprise, sauf autorisation exceptionnelle de poursuite temporaire."
                  - listitem [ref=e361]:
                    - strong [ref=e362]: Dessaisissement du débiteur
                    - text: ": Le dirigeant est totalement dessaisi de ses pouvoirs de gestion et de disposition. Le liquidateur le remplace pour toutes les opérations de liquidation."
                  - listitem [ref=e363]:
                    - strong [ref=e364]: Réalisation de l'actif
                    - text: ": Le liquidateur procède à la vente des biens de l'entreprise (immeubles, machines, stocks, créances, etc.) dans les meilleures conditions possibles."
                  - listitem [ref=e365]:
                    - strong [ref=e366]: Vérification et répartition des créances
                    - text: ": Le liquidateur vérifie les créances déclarées par les créanciers et, une fois l'actif réalisé, procède à la répartition du produit entre les créanciers, selon un ordre de priorité légal (salariés, frais de justice, créanciers privilégiés, créanciers chirographaires)."
                  - listitem [ref=e367]:
                    - strong [ref=e368]: Clôture de la liquidation
                    - text: ": La procédure est clôturée lorsque tous les créanciers ont été payés (clôture pour extinction du passif) ou lorsque le liquidateur constate qu'il n'y a plus d'actif à réaliser et que les créanciers restants ne peuvent être payés (clôture pour insuffisance d'actif)."
              - listitem [ref=e369]:
                - strong [ref=e370]: Effets
                - text: ": Dissolution de la personne morale, licenciement des salariés (soumis à des règles spécifiques), fin définitive de l'activité."
            - generic [ref=e371]:
              - generic [ref=e372]:
                - generic [ref=e373]:
                  - img [ref=e375]
                  - generic [ref=e378]: Anecdote Historique
                - generic [ref=e379]: Années 2010-2020
              - heading "Le cas des 'entreprises zombies'" [level=5] [ref=e380]
              - paragraph [ref=e382]: "Dans les années 2010, notamment après la crise financière de 2008, un phénomène a été observé en Europe et au Japon : celui des \"entreprises zombies\". Il s'agit d'entreprises qui, bien que techniquement insolvables et incapables de générer suffisamment de profits pour couvrir leurs dettes, sont maintenues en vie artificiellement grâce à des taux d'intérêt très bas ou des refinancements constants. Ces entreprises, souvent peu productives, occupent des parts de marché et des ressources (capital, main-d'œuvre) qui pourraient être allouées à des entreprises plus dynamiques, freinant ainsi la croissance économique globale. Ce phénomène soulève la question de la pertinence des procédures collectives, qui, en cherchant à tout prix à sauver l'entreprise, pourraient parfois prolonger l'agonie d'entités non viables, au détriment de l'efficience économique globale."
            - heading "IV. Les Effets des Procédures Collectives" [level=2] [ref=e383]
            - paragraph [ref=e384]: L'ouverture d'une procédure collective a des conséquences profondes et immédiates sur l'entreprise elle-même, ses dirigeants, ses créanciers et l'ensemble de ses contrats en cours. Ces effets sont conçus pour geler la situation, protéger le patrimoine de l'entreprise et organiser un traitement collectif des difficultés.
            - heading "A. Sur l'Entreprise et ses Dirigeants" [level=3] [ref=e385]
            - list [ref=e386]:
              - listitem [ref=e387]:
                - strong [ref=e388]: Dessaisissement ou assistance
                - text: ": Le degré de contrôle du dirigeant sur son entreprise varie considérablement. En sauvegarde, le dirigeant est assisté par l'administrateur judiciaire. En redressement, il peut être assisté ou, plus fréquemment, totalement dessaisi au profit de l'administrateur. En liquidation, il est systématiquement et totalement dessaisi de ses pouvoirs de gestion et de disposition, le liquidateur prenant le contrôle exclusif."
              - listitem [ref=e389]:
                - strong [ref=e390]: Interdiction de payer les dettes antérieures
                - text: ": Dès le jugement d'ouverture, l'entreprise ne peut plus payer les dettes nées avant cette date. C'est le principe de l'arrêt des poursuites individuelles et de l'égalité des créanciers. Tout paiement effectué en violation de cette règle peut être annulé (période suspecte)."
              - listitem [ref=e391]:
                - strong [ref=e392]: Poursuites et sanctions
                - text: ": Les dirigeants (de droit ou de fait) peuvent faire l'objet de sanctions civiles (faillite personnelle, interdiction de gérer, action en comblement de passif) ou pénales (banqueroute) en cas de fautes de gestion graves ayant contribué aux difficultés de l'entreprise. Ces sanctions visent à responsabiliser les dirigeants et à prévenir les abus."
              - listitem [ref=e393]:
                - strong [ref=e394]: Maintien de l'activité
                - text: ": En sauvegarde et redressement, l'activité est maintenue pendant la période d'observation, l'objectif étant de permettre la réorganisation. En liquidation, l'activité cesse généralement, sauf autorisation exceptionnelle du tribunal pour une durée limitée si cela permet de maximiser la valeur des actifs à vendre."
            - heading "B. Sur les Créanciers" [level=3] [ref=e395]
            - list [ref=e396]:
              - listitem [ref=e397]:
                - strong [ref=e398]: Suspension des poursuites individuelles
                - text: ": C'est un effet majeur. Les créanciers ne peuvent plus engager ou poursuivre des actions en justice individuelles contre l'entreprise pour recouvrer leurs créances antérieures. Ils doivent désormais passer par la procédure collective."
              - listitem [ref=e399]:
                - strong [ref=e400]: Déclaration des créances
                - text: ": Obligation pour tous les créanciers (sauf les salariés pour leurs salaires) de déclarer leurs créances au mandataire judiciaire (ou liquidateur) dans un délai de deux mois à compter de la publication du jugement d'ouverture au BODACC (Bulletin Officiel des Annonces Civiles et Commerciales). L'absence de déclaration dans les délais entraîne l'extinction de la créance."
              - listitem [ref=e401]:
                - strong [ref=e402]: Ordre de paiement
                - text: ": Les créanciers sont payés selon un ordre de priorité légal strict, qui déroge au principe de l'égalité des créanciers. Cet ordre est généralement :"
                - list [ref=e403]:
                  - listitem [ref=e404]: Les super-privilèges (salaires des 60 derniers jours, frais de justice de la procédure).
                  - listitem [ref=e405]: Les créances nées après le jugement d'ouverture pour les besoins de la procédure ou de l'activité (créances post-ouverture).
                  - listitem [ref=e406]: Les créanciers bénéficiant de sûretés (hypothèques, gages) ou de privilèges spéciaux (Trésor Public, organismes sociaux).
                  - listitem [ref=e407]: Les créanciers chirographaires (créanciers ordinaires sans sûreté).
            - heading "C. Sur les Contrats en Cours" [level=3] [ref=e408]
            - paragraph [ref=e409]: Les contrats en cours (baux commerciaux, contrats de fourniture, de prestation de services, de travail, etc.) ne sont pas automatiquement résiliés par l'ouverture d'une procédure collective.
            - list [ref=e410]:
              - listitem [ref=e411]:
                - strong [ref=e412]: Option de l'administrateur/liquidateur
                - text: ": L'administrateur (en sauvegarde/redressement) ou le liquidateur (en liquidation) dispose d'une option : soit il décide de poursuivre le contrat (en s'assurant que l'entreprise pourra honorer ses engagements pour les prestations futures), soit il y met fin. Le cocontractant ne peut pas exiger la résiliation du contrat du seul fait de l'ouverture de la procédure."
              - listitem [ref=e413]:
                - strong [ref=e414]: Protection de l'emploi
                - text: ": Les contrats de travail sont soumis à des règles spécifiques et protectrices. Les licenciements économiques, s'ils sont nécessaires dans le cadre d'un plan de sauvegarde ou de redressement, doivent être autorisés par le juge-commissaire et sont encadrés par des procédures particulières (consultation des représentants du personnel, plan de sauvegarde de l'emploi). En liquidation, les licenciements sont généralement prononcés par le liquidateur."
            - generic [ref=e415]:
              - heading "Évolution des défaillances d'entreprises en France" [level=4] [ref=e417]:
                - img [ref=e418]
                - generic [ref=e420]: Évolution des défaillances d'entreprises en France
              - img [ref=e424]:
                - generic [ref=e426]: "0"
                - generic [ref=e428]: "14250"
                - generic [ref=e430]: "28500"
                - generic [ref=e432]: "42750"
                - generic [ref=e434]: "57000"
                - generic [ref=e435]: Nombre de défaillances
                - generic [ref=e436]: Année
                - generic [ref=e439] [cursor=pointer]: "2019"
                - generic [ref=e442] [cursor=pointer]: "2020"
                - generic [ref=e445] [cursor=pointer]: "2021"
                - generic [ref=e448] [cursor=pointer]: "2022"
                - generic [ref=e451] [cursor=pointer]: "2023"
            - paragraph [ref=e452]:
              - emphasis [ref=e453]: "Figure 1 : Évolution des défaillances d'entreprises en France (données fictives à titre illustratif) - Ce graphique montre une tendance des défaillances d'entreprises, avec une baisse notable pendant la période COVID-19 due aux aides de l'État et aux mesures de soutien, suivie d'une remontée progressive à mesure que ces mesures sont levées et que les difficultés structurelles refont surface."
            - paragraph [ref=e454]:
              - emphasis [ref=e455]: "Vidéo 1 : Les procédures collectives : sauvegarde, redressement, liquidation - Cette vidéo explicative synthétise les principales caractéristiques des trois procédures collectives, en mettant en lumière leurs objectifs et leurs différences fondamentales."
              - link "Accéder directement à la ressource" [ref=e456] [cursor=pointer]:
                - /url: https://www.youtube.com/watch?v=yXQ-2v3-70w
            - 'heading "V. Synthèse des Procédures : Un Cheminement Logique" [level=2] [ref=e457]'
            - paragraph [ref=e458]: Pour mieux visualiser l'articulation entre les différentes procédures et comprendre la logique de leur enchaînement, voici un schéma simplifié du cheminement possible d'une entreprise en difficulté. Ce diagramme illustre la progression depuis la détection précoce des difficultés jusqu'aux issues possibles, qu'il s'agisse d'un retour à la normale ou de la cessation définitive de l'activité.
            - generic [ref=e459]:
              - button "Plein écran" [ref=e460] [cursor=pointer]:
                - img [ref=e461]
              - document [ref=e467]:
                - generic [ref=e469]:
                  - generic [ref=e486]:
                    - paragraph [ref=e492]: Non cessation des paiements
                    - paragraph [ref=e498]: Accord amiable
                    - paragraph [ref=e504]: Accord homologué ou constaté
                    - paragraph [ref=e510]: Mesures correctives prises
                    - paragraph [ref=e516]: Cessation des paiements
                    - paragraph [ref=e522]: Oui
                    - paragraph [ref=e528]: Plan de redressement
                    - paragraph [ref=e534]: Non
                    - paragraph [ref=e540]: Réalisation de l'actif
                    - paragraph [ref=e546]: Échec du plan
                    - paragraph [ref=e552]: Échec de la prévention
                    - paragraph [ref=e558]: Pas de prévention
                  - generic [ref=e559]:
                    - paragraph [ref=e566]: Entreprise en Difficulté
                    - paragraph [ref=e573]: Difficultés avérées ou prévisibles?
                    - paragraph [ref=e580]: Prévention
                    - paragraph [ref=e587]: Mandat Ad Hoc
                    - paragraph [ref=e594]: Conciliation
                    - paragraph [ref=e601]: Alerte
                    - paragraph [ref=e608]: Retour à une situation normale
                    - paragraph [ref=e615]: Procédures Collectives
                    - paragraph [ref=e622]: Redressement possible?
                    - paragraph [ref=e629]: Redressement Judiciaire
                    - paragraph [ref=e636]: Liquidation Judiciaire
                    - paragraph [ref=e643]: Clôture de la liquidation
            - paragraph [ref=e644]:
              - emphasis [ref=e645]: "Figure 2 : Schéma des procédures de prévention et de traitement des difficultés d'entreprise - Ce diagramme de flux illustre le parcours juridique d'une entreprise confrontée à des difficultés, de la prévention à la liquidation, en fonction de l'état de cessation des paiements et des perspectives de redressement."
            - generic [ref=e647]:
              - generic [ref=e649]:
                - img [ref=e651]
                - generic [ref=e653]: "Calcul d'Application Rapide : Cas pratique : Choisir la bonne procédure"
              - generic [ref=e654]: La société 'TechInnov', spécialisée dans le développement de logiciels, emploie 50 salariés. Depuis 6 mois, elle subit une forte baisse de son chiffre d'affaires due à l'arrivée d'un concurrent majeur et à des retards dans le développement de son nouveau produit phare. Les tensions de trésorerie sont importantes, mais l'entreprise parvient encore à payer ses salaires et ses fournisseurs à échéance, bien que parfois avec quelques jours de retard. Le dirigeant, M. Dupont, est conscient de la gravité de la situation et souhaite trouver une solution discrète pour renégocier ses dettes bancaires et obtenir un délai de paiement de l'URSSAF, afin de stabiliser l'entreprise et de finaliser le nouveau produit. Il ne veut pas que ses difficultés soient rendues publiques, car cela pourrait effrayer ses clients et ses investisseurs potentiels. Quelle procédure juridique M. Dupont devrait-il envisager en priorité ? Justifiez votre choix en expliquant pourquoi les autres procédures seraient moins adaptées à la situation de 'TechInnov'.
              - generic [ref=e655]:
                - textbox "Saisissez votre réflexion ici..." [ref=e657]
                - button "Valider" [disabled] [ref=e659] [cursor=pointer]:
                  - generic [ref=e660]: Valider
                  - img [ref=e661]
            - generic [ref=e663]:
              - generic [ref=e664]:
                - img [ref=e666]
                - generic [ref=e671]: "Au-delà des procédures : la résilience entrepreneuriale"
              - paragraph [ref=e673]: Après avoir exploré les mécanismes juridiques de gestion des difficultés, il est crucial de comprendre que le droit n'est qu'un outil parmi d'autres. La véritable résilience d'une entreprise face à la crise réside dans sa capacité d'adaptation, d'innovation et de leadership. Les prochaines étapes de votre parcours en droit des entreprises pourraient vous amener à étudier les stratégies de croissance, la gestion des risques, la gouvernance d'entreprise, ou encore le rôle de l'éthique dans la prise de décision managériale, des domaines où la prévention des difficultés est une préoccupation constante et où la vision stratégique du dirigeant est primordiale.
            - heading "Conclusion" [level=2] [ref=e674]
            - paragraph [ref=e675]: Les difficultés de l'entreprise et les procédures collectives constituent un pan essentiel du droit des affaires, reflétant la volonté du législateur de concilier la liberté d'entreprendre avec la protection de l'activité économique et de l'emploi. Ces mécanismes, allant de la prévention discrète au traitement judiciaire public, sont des outils complexes mais indispensables pour la régulation économique.
            - generic [ref=e676]:
              - heading "Points Clés à Retenir" [level=3] [ref=e677]:
                - img [ref=e678]
                - text: Points Clés à Retenir
              - list [ref=e680]:
                - listitem [ref=e681]:
                  - generic [ref=e683]: Les difficultés de l'entreprise englobent toute situation menaçant sa pérennité, distincte de la cessation des paiements qui est l'impossibilité de faire face au passif exigible avec l'actif disponible. Cette distinction est fondamentale pour le choix de la procédure.
                - listitem [ref=e684]:
                  - generic [ref=e686]: Les procédures de prévention (mandat ad hoc, conciliation, alerte) sont des dispositifs amiables et confidentiels. Elles visent à résoudre les difficultés en amont de la cessation des paiements, avec l'aide d'un tiers désigné par le tribunal, afin de préserver l'entreprise et sa réputation.
                - listitem [ref=e687]:
                  - generic [ref=e689]: Les procédures collectives (sauvegarde, redressement judiciaire, liquidation judiciaire) sont judiciaires et publiques. Elles interviennent après la cessation des paiements (sauf la sauvegarde, qui est préventive mais collective) pour organiser collectivement le sort de l'entreprise et de ses créanciers.
                - listitem [ref=e690]:
                  - generic [ref=e692]: Chaque procédure collective a des objectifs, des conditions d'ouverture et des effets distincts sur l'entreprise, ses dirigeants, ses créanciers et ses contrats en cours, allant de la réorganisation et du maintien de l'activité à la cessation définitive de l'entreprise.
            - paragraph [ref=e693]: Ces mécanismes juridiques, bien que complexes, sont des instruments vitaux pour la régulation économique. Ils posent la question fondamentale de l'équilibre entre la protection des intérêts individuels (créanciers, dirigeants) et l'intérêt collectif (maintien de l'emploi, activité économique, ordre public économique). La gestion proactive des crises, la détection précoce des signes de difficultés et la bonne utilisation de ces outils sont des compétences clés pour tout acteur du monde des affaires.
            - paragraph [ref=e694]:
              - strong [ref=e695]: "Questions pour la discussion :"
            - list [ref=e696]:
              - listitem [ref=e697]: Comment, selon vous, le droit pourrait-il encore mieux encourager les dirigeants à anticiper les difficultés, plutôt que de réagir une fois la situation devenue critique ? Faut-il renforcer les obligations d'alerte ou les incitations au recours aux procédures préventives ?
              - listitem [ref=e698]: Quels sont les enjeux sociaux et éthiques des décisions prises dans le cadre de ces procédures, notamment en ce qui concerne le maintien de l'emploi et la responsabilité des dirigeants ?
              - listitem [ref=e699]: Dans quelle mesure la publicité des procédures collectives est-elle un mal nécessaire pour la transparence du marché, ou un frein à la réorganisation des entreprises ?
            - generic [ref=e700]:
              - generic [ref=e702]:
                - img [ref=e703]
                - heading "Évaluation Rédactionnelle" [level=3] [ref=e708]
              - generic [ref=e709]:
                - generic [ref=e710]: Subject / Question
                - paragraph [ref=e711]: Analysez les objectifs et les conditions d'ouverture des procédures de sauvegarde et de redressement judiciaire. Mettez en évidence leurs différences fondamentales et discutez de l'importance de la distinction entre 'difficultés' et 'cessation des paiements' pour le choix de la procédure appropriée. Vous illustrerez votre propos par des exemples concrets de situations d'entreprise.
                - generic [ref=e712]:
                  - img [ref=e713]
                  - generic [ref=e716]:
                    - text: "Barème de notation :"
                    - strong [ref=e717]: de 0 à 20
              - generic [ref=e718]:
                - generic [ref=e719]:
                  - button "📝 Rédiger" [ref=e720] [cursor=pointer]
                  - button "📁 Déposer" [ref=e721] [cursor=pointer]
                  - button "🎙️ Oral" [ref=e722] [cursor=pointer]
                - generic [ref=e724]:
                  - generic [ref=e725] [cursor=pointer]:
                    - button "Choose File" [disabled] [ref=e726]
                    - generic:
                      - img "Preview"
                      - generic:
                        - paragraph: concept_map.png
                        - paragraph: 0.1 KB
                  - generic [ref=e727]:
                    - generic [ref=e728]: Notes d'accompagnement / description de votre travail
                    - textbox "Décrivez brièvement votre schéma, dessin ou document pour aider le tuteur IA à l'évaluer..." [disabled] [ref=e729]: Voici le schéma conceptuel représentant le traitement des difficultés des entreprises.
                - button "Le tuteur IA évalue votre copie..." [disabled] [ref=e731] [cursor=pointer]:
                  - img [ref=e732]
                  - text: Le tuteur IA évalue votre copie...
                - generic [ref=e737]: 💡 En mode invité, votre note est temporaire. Créez un compte ou connectez-vous pour conserver votre relevé de notes !
            - heading "Glossaire" [level=3] [ref=e738]
            - list [ref=e739]:
              - listitem [ref=e740]:
                - strong [ref=e741]: Cessation des paiements
                - text: ": Situation juridique dans laquelle une entreprise est dans l'impossibilité de faire face à son passif exigible avec son actif disponible."
                - link "Wikipédia" [ref=e742] [cursor=pointer]:
                  - /url: https://fr.wikipedia.org/wiki/Cessation_des_paiements
              - listitem [ref=e743]:
                - strong [ref=e744]: Conciliation
                - text: ": Procédure amiable et confidentielle de prévention des difficultés d'une entreprise, ouverte lorsque l'entreprise éprouve des difficultés juridiques, économiques ou financières avérées ou prévisibles, mais n'est pas en cessation des paiements depuis plus de 45 jours. ["
                - link "Wikipédia" [ref=e745] [cursor=pointer]:
                  - /url: https://fr.wikipedia.org/wiki/Wikip%C3%A9dia
                - text: )]
              - listitem [ref=e746]:
                - strong [ref=e747]: Mandat ad hoc
                - text: ": Procédure amiable et confidentielle de prévention des difficultés d'une entreprise, permettant à un mandataire désigné par le président du tribunal de commerce d'aider le débiteur à négocier avec ses principaux créanciers."
                - link "Wikipédia" [ref=e748] [cursor=pointer]:
                  - /url: https://fr.wikipedia.org/wiki/Mandat_ad_hoc
              - listitem [ref=e749]:
                - strong [ref=e750]: Procédure de liquidation judiciaire
                - text: ": Procédure collective ouverte lorsque l'entreprise est en cessation des paiements et que son redressement est manifestement impossible. Elle vise à mettre fin à l'activité de l'entreprise, à réaliser son actif et à désintéresser les créanciers par répartition du produit des ventes."
                - link "Wikipédia" [ref=e751] [cursor=pointer]:
                  - /url: https://fr.wikipedia.org/wiki/Liquidation_judiciaire
              - listitem [ref=e752]:
                - strong [ref=e753]: Procédure de redressement judiciaire
                - text: ": Procédure collective ouverte lorsque l'entreprise est en cessation des paiements et qu'un redressement est jugé possible. Elle vise à permettre la poursuite de l'activité, le maintien de l'emploi et l'apurement du passif par l'élaboration d'un plan de redressement."
                - link "Wikipédia" [ref=e754] [cursor=pointer]:
                  - /url: https://fr.wikipedia.org/wiki/Redressement_judiciaire
              - listitem [ref=e755]:
                - strong [ref=e756]: Procédure de sauvegarde
                - text: ": Procédure collective ouverte à la demande du débiteur qui justifie de difficultés qu'il n'est pas en mesure de surmonter, mais qui n'est pas encore en cessation des paiements. Elle vise à faciliter la réorganisation de l'entreprise pour permettre la poursuite de l'activité, le maintien de l'emploi et l'apurement du passif."
                - link "Wikipédia" [ref=e757] [cursor=pointer]:
                  - /url: https://fr.wikipedia.org/wiki/Proc%C3%A9dure_de_sauvegarde
            - generic [ref=e758]:
              - generic [ref=e759]:
                - generic [ref=e760]:
                  - generic [ref=e762]: 📚
                  - heading "Références" [level=3] [ref=e764]
                - generic [ref=e765]:
                  - button "Apparition" [ref=e766] [cursor=pointer]
                  - button "Alphabétique" [ref=e767] [cursor=pointer]
              - generic [ref=e768]:
                - generic [ref=e769]:
                  - link "[1]" [ref=e771] [cursor=pointer]:
                    - /url: "#cite-1"
                  - generic [ref=e772]:
                    - generic [ref=e773]:
                      - text: "Code de commerce, Livre VI : Des difficultés des entreprises. Version consolidée."
                      - link "[Légifrance." [ref=e774] [cursor=pointer]:
                        - /url: https://scholar.google.com/scholar?q=Code%20de%20commerce%2C%20Livre%20VI%20%3A%20Des%20difficult%C3%A9s%20des%20entreprises.%20Version%20consolid%C3%A9e.%20%5D
                      - text: "]"
                    - generic [ref=e775]:
                      - text: "|"
                      - link "Google Scholar" [ref=e776] [cursor=pointer]:
                        - /url: https://scholar.google.com/scholar?q=Code%20de%20commerce%2C%20Livre%20VI%20%3A%20Des%20difficult%C3%A9s%20des%20entreprises.%20Version%20consolid%C3%A9e.%20%5BL%C3%A9gifrance%5D
                - generic [ref=e777]:
                  - link "[2]" [ref=e779] [cursor=pointer]:
                    - /url: "#cite-2"
                  - generic [ref=e780]:
                    - generic [ref=e781]:
                      - text: "Legeais, D. (2023). *Droit des entreprises en difficulté*. LexisNexis, Paris, 12e éd., p. 45-78. ISBN: 978-2711038597."
                      - link "[LexisNexis." [ref=e782] [cursor=pointer]:
                        - /url: https://scholar.google.com/scholar?q=Legeais%2C%20D.%20(2023).%20*Droit%20des%20entreprises%20en%20difficult%C3%A9*.%20LexisNexis%2C%20Paris%2C%2012e%20%C3%A9d.%2C%20p.%2045-78.%20ISBN%3A%20978-2711038597.%20%5D
                      - text: "]"
                    - generic [ref=e783]:
                      - text: "|"
                      - link "Google Scholar" [ref=e784] [cursor=pointer]:
                        - /url: https://scholar.google.com/scholar?q=Legeais%2C%20D.%20().%20Droit%20des%20entreprises%20en%20difficult%C3%A9.%20LexisNexis%2C%20Paris%2C%2012e%20%C3%A9d.%2C%20p.%20-.%20ISBN%3A%20-.%20%5BLexisNexis%5D
                - generic [ref=e785]:
                  - link "[3]" [ref=e787] [cursor=pointer]:
                    - /url: "#cite-3"
                  - generic [ref=e788]:
                    - generic [ref=e789]:
                      - text: "Pérochon, F. (2023). *Entreprises en difficulté*. LGDJ, Paris, 10e éd., p. 89-112. ISBN: 978-2275122176."
                      - link "[LGDJ." [ref=e790] [cursor=pointer]:
                        - /url: https://scholar.google.com/scholar?q=P%C3%A9rochon%2C%20F.%20(2023).%20*Entreprises%20en%20difficult%C3%A9*.%20LGDJ%2C%20Paris%2C%2010e%20%C3%A9d.%2C%20p.%2089-112.%20ISBN%3A%20978-2275122176.%20%5D
                      - text: "]"
                    - generic [ref=e791]:
                      - text: "|"
                      - link "Google Scholar" [ref=e792] [cursor=pointer]:
                        - /url: https://scholar.google.com/scholar?q=P%C3%A9rochon%2C%20F.%20().%20Entreprises%20en%20difficult%C3%A9.%20LGDJ%2C%20Paris%2C%2010e%20%C3%A9d.%2C%20p.%20-.%20ISBN%3A%20-.%20%5BLGDJ%5D
                - generic [ref=e793]:
                  - link "[4]" [ref=e795] [cursor=pointer]:
                    - /url: "#cite-4"
                  - generic [ref=e796]:
                    - generic [ref=e797]:
                      - text: "Couret, A. (2022). *Droit des entreprises en difficulté*. Dalloz, Paris, 11e éd., p. 30-60. ISBN: 978-2247217300."
                      - link "[Dalloz." [ref=e798] [cursor=pointer]:
                        - /url: https://scholar.google.com/scholar?q=Couret%2C%20A.%20(2022).%20*Droit%20des%20entreprises%20en%20difficult%C3%A9*.%20Dalloz%2C%20Paris%2C%2011e%20%C3%A9d.%2C%20p.%2030-60.%20ISBN%3A%20978-2247217300.%20%5D
                      - text: "]"
                    - generic [ref=e799]:
                      - text: "|"
                      - link "Google Scholar" [ref=e800] [cursor=pointer]:
                        - /url: https://scholar.google.com/scholar?q=Couret%2C%20A.%20().%20Droit%20des%20entreprises%20en%20difficult%C3%A9.%20Dalloz%2C%20Paris%2C%2011e%20%C3%A9d.%2C%20p.%20-.%20ISBN%3A%20-.%20%5BDalloz%5D
                - generic [ref=e801]:
                  - link "[5]" [ref=e803] [cursor=pointer]:
                    - /url: "#cite-5"
                  - generic [ref=e804]:
                    - generic [ref=e805]:
                      - text: "Riou, C. (2021). *Les procédures collectives*. Gualino, Paris, 5e éd., p. 25-50. ISBN: 978-2297095908."
                      - link "[Lextenso." [ref=e806] [cursor=pointer]:
                        - /url: https://scholar.google.com/scholar?q=Riou%2C%20C.%20(2021).%20*Les%20proc%C3%A9dures%20collectives*.%20Gualino%2C%20Paris%2C%205e%20%C3%A9d.%2C%20p.%2025-50.%20ISBN%3A%20978-2297095908.%20%5D
                      - text: "]"
                    - generic [ref=e807]:
                      - text: "|"
                      - link "Google Scholar" [ref=e808] [cursor=pointer]:
                        - /url: https://scholar.google.com/scholar?q=Riou%2C%20C.%20().%20Les%20proc%C3%A9dures%20collectives.%20Gualino%2C%20Paris%2C%205e%20%C3%A9d.%2C%20p.%20-.%20ISBN%3A%20-.%20%5BLextenso%5D
                - generic [ref=e809]:
                  - link "[6]" [ref=e811] [cursor=pointer]:
                    - /url: "#cite-6"
                  - generic [ref=e812]:
                    - generic [ref=e813]:
                      - text: INSEE. (2023). *Créations et défaillances d'entreprises*. Données statistiques et analyses. Consulté le 15 octobre 2023.
                      - link "[INSEE." [ref=e814] [cursor=pointer]:
                        - /url: https://scholar.google.com/scholar?q=INSEE.%20(2023).%20*Cr%C3%A9ations%20et%20d%C3%A9faillances%20d'entreprises*.%20Donn%C3%A9es%20statistiques%20et%20analyses.%20Consult%C3%A9%20le%2015%20octobre%202023.%20%5D
                      - text: "]"
                    - generic [ref=e815]:
                      - text: "|"
                      - link "Google Scholar" [ref=e816] [cursor=pointer]:
                        - /url: https://scholar.google.com/scholar?q=INSEE.%20().%20Cr%C3%A9ations%20et%20d%C3%A9faillances%20d'entreprises.%20Donn%C3%A9es%20statistiques%20et%20analyses.%20Consult%C3%A9%20le%20%20octobre%20.%20%5BINSEE%5D
                - generic [ref=e817]:
                  - link "[7]" [ref=e819] [cursor=pointer]:
                    - /url: "#cite-7"
                  - generic [ref=e820]:
                    - text: "Rist, M. (2018). \"La loi de sauvegarde des entreprises : un bilan mitigé\". *Revue des Procédures Collectives*, n° 3, p. 15-22. ISSN: 1265-1234. [Lextenso Revues]"
                    - generic [ref=e821]:
                      - text: "|"
                      - link "Google Scholar" [ref=e822] [cursor=pointer]:
                        - /url: https://scholar.google.com/scholar?q=Rist%2C%20M.%20().%20%22La%20loi%20de%20sauvegarde%20des%20entreprises%20%3A%20un%20bilan%20mitig%C3%A9%22.%20Revue%20des%20Proc%C3%A9dures%20Collectives%2C%20n%C2%B0%20%2C%20p.%20-.%20ISSN%3A%20-.%20%5BLextenso%20Revues%5D
                - generic [ref=e823]:
                  - link "[8]" [ref=e825] [cursor=pointer]:
                    - /url: "#cite-8"
                  - generic [ref=e826]:
                    - text: "Garrigues, J.-P. (2019). \"Le mandat ad hoc et la conciliation : des outils de prévention efficaces ?\". *Journal des Sociétés*, n° 168, p. 45-52. ISSN: 1265-1234. [Lextenso Revues]"
                    - generic [ref=e827]:
                      - text: "|"
                      - link "Google Scholar" [ref=e828] [cursor=pointer]:
                        - /url: https://scholar.google.com/scholar?q=Garrigues%2C%20J.-P.%20().%20%22Le%20mandat%20ad%20hoc%20et%20la%20conciliation%20%3A%20des%20outils%20de%20pr%C3%A9vention%20efficaces%20%3F%22.%20Journal%20des%20Soci%C3%A9t%C3%A9s%2C%20n%C2%B0%20%2C%20p.%20-.%20ISSN%3A%20-.%20%5BLextenso
                - generic [ref=e829]:
                  - link "[9]" [ref=e831] [cursor=pointer]:
                    - /url: "#cite-9"
                  - generic [ref=e832]:
                    - generic [ref=e833]:
                      - text: "Chaput, Y. (2020). *Droit des entreprises en difficulté*. Litec, Paris, 9e éd., p. 70-95. ISBN: 978-2711033455."
                      - link "[Litec." [ref=e834] [cursor=pointer]:
                        - /url: https://scholar.google.com/scholar?q=Chaput%2C%20Y.%20(2020).%20*Droit%20des%20entreprises%20en%20difficult%C3%A9*.%20Litec%2C%20Paris%2C%209e%20%C3%A9d.%2C%20p.%2070-95.%20ISBN%3A%20978-2711033455.%20%5D
                      - text: "]"
                    - generic [ref=e835]:
                      - text: "|"
                      - link "Google Scholar" [ref=e836] [cursor=pointer]:
                        - /url: https://scholar.google.com/scholar?q=Chaput%2C%20Y.%20().%20Droit%20des%20entreprises%20en%20difficult%C3%A9.%20Litec%2C%20Paris%2C%209e%20%C3%A9d.%2C%20p.%20-.%20ISBN%3A%20-.%20%5BLitec%5D
                - generic [ref=e837]:
                  - link "[10]" [ref=e839] [cursor=pointer]:
                    - /url: "#cite-10"
                  - generic [ref=e840]:
                    - generic [ref=e841]:
                      - text: "Vidéo explicative sur les procédures collectives. (2022). *Les procédures collectives : sauvegarde, redressement, liquidation*. YouTube. Chaîne : Le Droit pour Tous."
                      - link "[YouTube." [ref=e842] [cursor=pointer]:
                        - /url: https://scholar.google.com/scholar?q=Vid%C3%A9o%20explicative%20sur%20les%20proc%C3%A9dures%20collectives.%20(2022).%20*Les%20proc%C3%A9dures%20collectives%20%3A%20sauvegarde%2C%20redressement%2C%20liquidation*.%20YouTube.%20Cha%C3%AEne%20%3A%20Le%20D
                      - text: "]"
                    - generic [ref=e843]:
                      - text: "|"
                      - link "Google Scholar" [ref=e844] [cursor=pointer]:
                        - /url: https://scholar.google.com/scholar?q=Vid%C3%A9o%20explicative%20sur%20les%20proc%C3%A9dures%20collectives.%20().%20Les%20proc%C3%A9dures%20collectives%20%3A%20sauvegarde%2C%20redressement%2C%20liquidation.%20YouTube.%20Cha%C3%AEne%20%3A%20Le%20Droit%20p
          - generic [ref=e845]:
            - img [ref=e847]
            - heading "Cours Terminé !" [level=3] [ref=e850]
            - paragraph [ref=e851]: Vous avez fini de lire ce cours en accès libre-service. Connectez-vous ou créez un compte pour sauvegarder votre progression, poser des questions au Tuteur IA, et passer des évaluations.
            - generic [ref=e852]:
              - link "Parcourir le Catalogue" [ref=e853] [cursor=pointer]:
                - /url: /catalog
                - text: Parcourir le Catalogue
                - img [ref=e854]
              - button "Créer un Compte" [ref=e856] [cursor=pointer]
    - generic [ref=e857]:
      - generic [ref=e858]:
        - button "Masquer" [ref=e859] [cursor=pointer]:
          - img [ref=e860]
        - generic [ref=e863]:
          - generic [ref=e864]: 💬
          - generic [ref=e865]:
            - paragraph [ref=e866]: Conseil du Tuteur
            - heading "Coach Socratique" [level=4] [ref=e867]
        - paragraph [ref=e868]: 💬 Bienvenue sur OpenPrimer. Je suis votre guide pédagogique. Pour l'instant, aucun cours ne figure dans votre cursus. Quel domaine de la connaissance éveille votre curiosité aujourd'hui ? Parcourez le catalogue pour commencer.
        - button "Discuter avec le tuteur" [ref=e869] [cursor=pointer]:
          - img [ref=e870]
          - text: Discuter avec le tuteur
      - button [ref=e873] [cursor=pointer]:
        - img [ref=e874]
    - generic [ref=e878]:
      - generic [ref=e879]:
        - button "Previous sentence" [ref=e880]:
          - img [ref=e881]
        - button "Play or restart speech from top of screen" [ref=e883]:
          - img [ref=e884]
        - button "Stop speech" [disabled] [ref=e886]:
          - img [ref=e887]
        - button "Next sentence" [ref=e889]:
          - img [ref=e890]
      - generic [ref=e892]:
        - button "Volume control" [ref=e894]:
          - img [ref=e895]
        - button "Reading speed control" [ref=e900] [cursor=pointer]: 1.0x
        - button "Speech settings" [ref=e902]:
          - img [ref=e903]
  - alert [ref=e906]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const BASE_URL = 'http://localhost:3000';
  4  | 
  5  | test.describe('Essay Evaluation Upload & Grading Test', () => {
  6  |   
  7  |   test.beforeEach(async ({ page, context }) => {
  8  |     page.on('pageerror', (err) => {
  9  |       console.log('🔴 BROWSER PAGE ERROR:', err.message, err.stack);
  10 |     });
  11 |     page.on('console', (msg) => {
  12 |       if (msg.type() === 'error') {
  13 |         console.log('🔴 BROWSER CONSOLE ERROR:', msg.text());
  14 |       }
  15 |     });
  16 | 
  17 |     await context.addCookies([{
  18 |       name: 'openprimer_lang',
  19 |       value: 'FR',
  20 |       url: BASE_URL
  21 |     }]);
  22 |     await page.addInitScript(() => {
  23 |       window.localStorage.setItem('openprimer_lang', 'FR');
  24 |       window.localStorage.setItem('op_allow_sandbox', 'true');
  25 |     });
  26 |   });
  27 | 
  28 |   test('should allow switching to file upload tab, dropping a file, and submitting for grading', async ({ page }) => {
  29 |     // Navigate directly to the final lesson of droit_des_entreprises
  30 |     await page.goto(`${BASE_URL}/fr/l1/droit_des_entreprises/difficultes-procedures-collectives`, { waitUntil: 'networkidle' });
  31 |     
  32 |     // Scroll down to the essay evaluation section
  33 |     const essayHeading = page.locator('h3:has-text("Évaluation Rédactionnelle")');
  34 |     await expect(essayHeading).toBeVisible();
  35 |     await essayHeading.scrollIntoViewIfNeeded();
  36 | 
  37 |     // Check if evaluation is not started yet and click "Démarrer l'Évaluation"
  38 |     const startButton = page.locator('button:has-text("Démarrer l\'Évaluation")');
  39 |     if (await startButton.isVisible()) {
  40 |       await startButton.click();
  41 |     }
  42 | 
  43 |     // Verify Tab buttons are present
  44 |     const writeTab = page.locator('button:has-text("Rédiger")');
  45 |     const uploadTab = page.locator('button:has-text("Déposer")');
  46 |     await expect(writeTab).toBeVisible();
  47 |     await expect(uploadTab).toBeVisible();
  48 | 
  49 |     // Switch to Upload Tab
  50 |     await uploadTab.click();
  51 | 
  52 |     // Verify file dropzone is visible
  53 |     const dropzoneText = page.locator('text=Glissez et déposez votre fichier ici');
  54 |     await expect(dropzoneText).toBeVisible();
  55 | 
  56 |     // Simulate selecting/uploading a file
  57 |     const fileInput = page.locator('input[type="file"]');
  58 |     await fileInput.setInputFiles({
  59 |       name: 'concept_map.png',
  60 |       mimeType: 'image/png',
  61 |       buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5CYII=', 'base64')
  62 |     });
  63 | 
  64 |     // Verify file details are displayed after selection
  65 |     await expect(page.locator('text=concept_map.png')).toBeVisible();
  66 | 
  67 |     // Add accompanying notes
  68 |     const notesTextarea = page.locator('textarea[placeholder*="Décrivez brièvement"]');
  69 |     await expect(notesTextarea).toBeVisible();
  70 |     await notesTextarea.fill('Voici le schéma conceptuel représentant le traitement des difficultés des entreprises.');
  71 | 
  72 |     // Click submit button
  73 |     const submitButton = page.locator('button:has-text("Soumettre ma rédaction")');
  74 |     await expect(submitButton).toBeVisible();
  75 |     await submitButton.click();
  76 | 
  77 |     // Wait for the grading results to render
  78 |     const feedbackTitle = page.locator('h4:has-text("Évaluation du Tuteur IA")');
> 79 |     await expect(feedbackTitle).toBeVisible({ timeout: 20000 });
     |                                 ^ Error: expect(locator).toBeVisible() failed
  80 | 
  81 |     // Verify the grade circle and its content exist
  82 |     const gradeCircle = page.locator('.rounded-full:has-text("Note")');
  83 |     await expect(gradeCircle).toBeVisible();
  84 | 
  85 |     const gradeLabel = gradeCircle.locator('span').first();
  86 |     await expect(gradeLabel).toHaveText("Note");
  87 | 
  88 |     const gradeText = gradeCircle.locator('span').nth(1);
  89 |     await expect(gradeText).toBeVisible();
  90 |     
  91 |     // Verify that file info is persisted in read-only view
  92 |     await expect(page.locator('p.text-slate-100:has-text("concept_map.png")')).toBeVisible();
  93 |     await expect(page.locator('p.italic:has-text("Voici le schéma conceptuel")')).toBeVisible();
  94 |   });
  95 | });
  96 | 
```