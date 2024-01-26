import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
if (window.innerWidth <= 600) {
  //document.body.style.display = 'none'; // Hide the entire body

  // Display a message for mobile users
  const errorMessage = document.createElement('div');
  errorMessage.innerHTML = 'This website does not work on mobile phones.';
  errorMessage.style.fontSize = '20px';
  errorMessage.style.textAlign = 'center';
  errorMessage.style.padding = '20px';
  errorMessage.style.color = '#FFFFFF'; // Adjust the color based on your design
  errorMessage.style.backgroundColor = '#000000'; // Adjust the background color based on your design
  document.body.appendChild(errorMessage);
}
else{
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create a modal container
  const modalContainer = document.createElement('div');
  modalContainer.style.position = 'absolute';
  modalContainer.style.top = '10px';
  modalContainer.style.left = '10px';
  modalContainer.style.padding = '10px';
  modalContainer.style.background = 'rgba(255, 255, 255, 1)';
  modalContainer.style.fontFamily = 'monospace';
  modalContainer.style.borderRadius = '0px';
  modalContainer.style.maxWidth = '33vw';
  modalContainer.style.zIndex = '1'; // Ensure the modal appears above the canvas
  document.body.appendChild(modalContainer);

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.innerHTML = '<h2>The Latent Library: <i>The Great Gatsby</i></h2><body>Each cube in the constellation represents a sentence in <i>The Great Gatsby</i> by F. Scott Fitzgerald. They are arranged by their latent embedding (reduced to three dimensions by SKLearn&apos;s TSNE algorithm) in the Google Universal Sentence Encoder. In effect, this means similar sentences are near each other. Use the arrow keys to move and the mouse to change the camera angle. Sentences in the crosshairs will be displayed here. Built by <a href="https://willallstetter.com">Will Allstetter</a>.</body>';
  modalContent.style.color = '#000';
  modalContainer.appendChild(modalContent);

  let cubes = []; // Use an array to store multiple cubes
  var embeddingLookup = {}; //dictionary

  // Variables for handling mouse movement
  let isMouseDown = false;
  let previousMousePosition = {
    x: 0,
    y: 0
  };

  // Variables for handling arrow key movement
  let moveForward = false;
  let moveBackward = false;
  let moveLeft = false;
  let moveRight = false;

  // Raycaster for detecting intersections
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  async function fetchData() {
    try {
      const response = {
    "0": {
        "#": "0",
        "Sentence": "In my younger and more vulnerable years my father gave me some advicethat I\u2019ve been turning over in my mind ever since.",
        "Embedding": "[  0.23134887 -17.432552    -1.478037  ]"
    },
    "1": {
        "#": "1",
        "Sentence": "\u201cWhenever you feel like criticizing anyone,\u201d he told me, \u201cjustremember that all the people in this world haven\u2019t had the advantagesthat you\u2019ve had.\u201dHe didn\u2019t say any more, but we\u2019ve always been unusually communicativein a reserved way, and I understood that he meant a great deal morethan that.",
        "Embedding": "[ -5.6698127   6.957845  -11.115731 ]"
    },
    "2": {
        "#": "2",
        "Sentence": "In consequence, I\u2019m inclined to reserve all judgements, ahabit that has opened up many curious natures to me and also made methe victim of not a few veteran bores.",
        "Embedding": "[ 21.67445      0.03306261 -12.688594  ]"
    },
    "3": {
        "#": "3",
        "Sentence": "The abnormal mind is quick todetect and attach itself to this quality when it appears in a normalperson, and so it came about that in college I was unjustly accused ofbeing a politician, because I was privy to the secret griefs of wild,unknown men.",
        "Embedding": "[-3.5978382 -2.708278   4.2044263]"
    },
    "4": {
        "#": "4",
        "Sentence": "Most of the confidences were unsought\u2014frequently I havefeigned sleep, preoccupation, or a hostile levity when I realized bysome unmistakable sign that an intimate revelation was quivering onthe horizon; for the intimate revelations of young men, or at leastthe terms in which they express them, are usually plagiaristic andmarred by obvious suppressions.",
        "Embedding": "[17.977139  7.018448 12.506796]"
    },
    "5": {
        "#": "5",
        "Sentence": "Reserving judgements is a matter ofinfinite hope.",
        "Embedding": "[-14.994624  -6.683142   8.839694]"
    },
    "6": {
        "#": "6",
        "Sentence": "I am still a little afraid of missing something if Iforget that, as my father snobbishly suggested, and I snobbishlyrepeat, a sense of the fundamental decencies is parcelled outunequally at birth.",
        "Embedding": "[  8.55993    -0.7816582 -11.835326 ]"
    },
    "7": {
        "#": "7",
        "Sentence": "And, after boasting this way of my tolerance, I come to the admissionthat it has a limit.",
        "Embedding": "[  2.5341074 -33.522526   12.780255 ]"
    },
    "8": {
        "#": "8",
        "Sentence": "Conduct may be founded on the hard rock or thewet marshes, but after a certain point I don\u2019t care what it\u2019s foundedon.",
        "Embedding": "[-6.783041  -1.5314524 -1.5714859]"
    },
    "9": {
        "#": "9",
        "Sentence": "When I came back from the East last autumn I felt that I wantedthe world to be in uniform and at a sort of moral attention forever; Iwanted no more riotous excursions with privileged glimpses into thehuman heart.",
        "Embedding": "[ 27.577291  12.472821 -17.957388]"
    },
    "10": {
        "#": "10",
        "Sentence": "Only Gatsby, the man who gives his name to this book, wasexempt from my reaction\u2014Gatsby, who represented everything for which Ihave an unaffected scorn.",
        "Embedding": "[ 5.882853 39.36049  -6.460466]"
    },
    "11": {
        "#": "11",
        "Sentence": "If personality is an unbroken series ofsuccessful gestures, then there was something gorgeous about him, someheightened sensitivity to the promises of life, as if he were relatedto one of those intricate machines that register earthquakes tenthousand miles away.",
        "Embedding": "[10.911514   6.1828737 16.491215 ]"
    },
    "12": {
        "#": "12",
        "Sentence": "This responsiveness had nothing to do with thatflabby impressionability which is dignified under the name of the\u201ccreative temperament\u201d\u2014it was an extraordinary gift for hope, aromantic readiness such as I have never found in any other person andwhich it is not likely I shall ever find again.",
        "Embedding": "[-3.9696646  9.128264  15.863279 ]"
    },
    "13": {
        "#": "13",
        "Sentence": "No\u2014Gatsby turned outall right at the end; it is what preyed on Gatsby, what foul dustfloated in the wake of his dreams that temporarily closed out myinterest in the abortive sorrows and short-winded elations of men.",
        "Embedding": "[ 8.0002165 34.031475   4.44183  ]"
    },
    "14": {
        "#": "14",
        "Sentence": "My family have been prominent, well-to-do people in this MiddleWestern city for three generations.",
        "Embedding": "[-16.922787    5.3226213   6.279109 ]"
    },
    "15": {
        "#": "15",
        "Sentence": "The Carraways are something of aclan, and we have a tradition that we\u2019re descended from the Dukes ofBuccleuch, but the actual founder of my line was my grandfather\u2019sbrother, who came here in fifty-one, sent a substitute to the CivilWar, and started the whole sale hardware business that my fathercarries on today.",
        "Embedding": "[ 12.155325  17.000452 -24.990253]"
    },
    "16": {
        "#": "16",
        "Sentence": "I never saw this great-uncle, but I\u2019m supposed to look like him\u2014withspecial reference to the rather hard-boiled painting that hangs infather\u2019s office.",
        "Embedding": "[ 2.6656463  7.102535  -7.748029 ]"
    },
    "17": {
        "#": "17",
        "Sentence": "I graduated from New Haven in 1915, just a quarter ofa century after my father, and a little later I participated in thatdelayed Teutonic migration known as the Great War.",
        "Embedding": "[ 15.447917  13.592447 -22.074568]"
    },
    "18": {
        "#": "18",
        "Sentence": "I enjoyed thecounter-raid so thoroughly that I came back restless.",
        "Embedding": "[  2.8394098 -13.738276    9.282712 ]"
    },
    "19": {
        "#": "19",
        "Sentence": "Instead of being the warm centre of the world, the Middle West now seemed like theragged edge of the universe\u2014so I decided to go East and learn the bondbusiness.",
        "Embedding": "[ 23.695744  12.822433 -15.736626]"
    },
    "20": {
        "#": "20",
        "Sentence": "Everybody I knew was in the bond business, so I supposed itcould support one more single man.",
        "Embedding": "[-0.53886807 -7.799077   -7.136984  ]"
    },
    "21": {
        "#": "21",
        "Sentence": "All my aunts and uncles talked itover as if they were choosing a prep school for me, and finally said,\u201cWhy\u2014ye-es,\u201d with very grave, hesitant faces.",
        "Embedding": "[-14.378884    4.373195    4.1397796]"
    },
    "22": {
        "#": "22",
        "Sentence": "Father agreed to financeme for a year, and after various delays I came East, permanently, Ithought, in the spring of twenty-two.",
        "Embedding": "[ 17.544922  19.298853 -19.970808]"
    },
    "23": {
        "#": "23",
        "Sentence": "The practical thing was to find rooms in the city, but it was a warmseason, and I had just left a country of wide lawns and friendlytrees, so when a young man at the office suggested that we take ahouse together in a commuting town, it sounded like a great idea.",
        "Embedding": "[17.208107 18.075974 13.908216]"
    },
    "24": {
        "#": "24",
        "Sentence": "Hefound the house, a weather-beaten cardboard bungalow at eighty amonth, but at the last minute the firm ordered him to Washington, andI went out to the country alone.",
        "Embedding": "[17.376612 22.735554 12.102761]"
    },
    "25": {
        "#": "25",
        "Sentence": "I had a dog\u2014at least I had him for afew days until he ran away\u2014and an old Dodge and a Finnish woman, whomade my bed and cooked breakfast and muttered Finnish wisdom to herself over the electric stove.",
        "Embedding": "[26.093472  18.385822  -1.9951069]"
    },
    "26": {
        "#": "26",
        "Sentence": "It was lonely for a day or so until one morning some man, morerecently arrived than I, stopped me on the road.",
        "Embedding": "[  4.4231825 -18.554712   -3.0375414]"
    },
    "27": {
        "#": "27",
        "Sentence": "\u201cHow do you get to West Egg village?\u201d he asked helplessly.",
        "Embedding": "[  5.1598716  17.05578   -27.280544 ]"
    },
    "28": {
        "#": "28",
        "Sentence": "I told him.",
        "Embedding": "[-27.792995  -12.453139   -2.5882838]"
    },
    "29": {
        "#": "29",
        "Sentence": "And as I walked on I was lonely no longer.",
        "Embedding": "[-20.212454 -22.71926  -32.392944]"
    },
    "30": {
        "#": "30",
        "Sentence": "I was a guide,a pathfinder, an original settler.",
        "Embedding": "[ -8.013557  29.871866 -25.303534]"
    },
    "31": {
        "#": "31",
        "Sentence": "He had casually conferred on me thefreedom of the neighbourhood.",
        "Embedding": "[ -4.2858033 -28.165157   -0.8755615]"
    },
    "32": {
        "#": "32",
        "Sentence": "And so with the sunshine and the great bursts of leaves growing on thetrees, just as things grow in fast movies, I had that familiarconviction that life was beginning over again with the summer.",
        "Embedding": "[24.041077  12.6005745  5.0038514]"
    },
    "33": {
        "#": "33",
        "Sentence": "There was so much to read, for one thing, and so much fine health tobe pulled down out of the young breath-giving air.",
        "Embedding": "[52.16553     0.07260961  5.187592  ]"
    },
    "34": {
        "#": "34",
        "Sentence": "I bought a dozenvolumes on banking and credit and investment securities, and theystood on my shelf in red and gold like new money from the mint,promising to unfold the shining secrets that only Midas and Morgan andMaecenas knew.",
        "Embedding": "[11.668839 36.56196  16.869556]"
    },
    "35": {
        "#": "35",
        "Sentence": "And I had the high intention of reading many otherbooks besides.",
        "Embedding": "[  1.7820199 -21.762169  -11.340898 ]"
    },
    "36": {
        "#": "36",
        "Sentence": "I was rather literary in college\u2014one year I wrote aseries of very solemn and obvious editorials for the Yale News\u2014and nowI was going to bring back all such things into my life and becomeagain that most limited of all specialists, the \u201cwell-rounded man.\u201dThis isn\u2019t just an epigram\u2014life is much more successfully looked atfrom a single window, after all.",
        "Embedding": "[-2.6706424  5.923478  16.914846 ]"
    },
    "37": {
        "#": "37",
        "Sentence": "It was a matter of chance that I should have rented a house in one ofthe strangest communities in North America.",
        "Embedding": "[ 30.435556    3.6994646 -21.598108 ]"
    },
    "38": {
        "#": "38",
        "Sentence": "It was on that slenderriotous island which extends itself due east of New York\u2014and wherethere are, among other natural curiosities, two unusual formations ofland.",
        "Embedding": "[42.606785 19.077623 12.271964]"
    },
    "39": {
        "#": "39",
        "Sentence": "Twenty miles from the city a pair of enormous eggs, identical incontour and separated only by a courtesy bay, jut out into the mostdomesticated body of salt water in the Western hemisphere, the greatwet barnyard of Long Island Sound.",
        "Embedding": "[28.482769  32.63813    0.3641023]"
    },
    "40": {
        "#": "40",
        "Sentence": "They are not perfect ovals\u2014like theegg in the Columbus story, they are both crushed flat at the contactend\u2014but their physical resemblance must be a source of perpetualwonder to the gulls that fly overhead.",
        "Embedding": "[46.453094 19.137365 12.410867]"
    },
    "41": {
        "#": "41",
        "Sentence": "To the wingless a moreinteresting phenomenon is their dissimilarity in every particularexcept shape and size.",
        "Embedding": "[49.166405 18.038315 12.376366]"
    },
    "42": {
        "#": "42",
        "Sentence": "I lived at West Egg, the\u2014well, the less fashionable of the two, thoughthis is a most superficial tag to express the bizarre and not a littlesinister contrast between them.",
        "Embedding": "[28.366188  35.588726  -5.9718256]"
    },
    "43": {
        "#": "43",
        "Sentence": "My house was at the very tip of theegg, only fifty yards from the Sound, and squeezed between two hugeplaces that rented for twelve or fifteen thousand a season.",
        "Embedding": "[ 22.92067     5.4817786 -21.73536  ]"
    },
    "44": {
        "#": "44",
        "Sentence": "The one onmy right was a colossal affair by any standard\u2014it was a factualimitation of some H\u00f4tel de Ville in Normandy, with a tower on oneside, spanking new under a thin beard of raw ivy, and a marbleswimming pool, and more than forty acres of lawn and garden.",
        "Embedding": "[26.300339 24.493113  8.207872]"
    },
    "45": {
        "#": "45",
        "Sentence": "It wasGatsby\u2019s mansion.",
        "Embedding": "[-40.525703 -26.375126   2.686731]"
    },
    "46": {
        "#": "46",
        "Sentence": "Or, rather, as I didn\u2019t know Mr. Gatsby, it was amansion inhabited by a gentleman of that name.",
        "Embedding": "[ 3.9567752 37.43081   -7.776614 ]"
    },
    "47": {
        "#": "47",
        "Sentence": "My own house was aneyesore, but it was a small eyesore, and it had been overlooked, so Ihad a view of the water, a partial view of my neighbour\u2019s lawn, andthe consoling proximity of millionaires\u2014all for eighty dollars amonth.",
        "Embedding": "[ 17.125439  14.203251 -12.100121]"
    },
    "48": {
        "#": "48",
        "Sentence": "Across the courtesy bay the white palaces of fashionable East Eggglittered along the water, and the history of the summer really beginson the evening I drove over there to have dinner with the Tom Buchanans.",
        "Embedding": "[13.924128   24.379599    0.11586751]"
    },
    "49": {
        "#": "49",
        "Sentence": "Daisy was my second cousin once removed, and I\u2019d known Tomin college.",
        "Embedding": "[-41.337555  10.582226  11.515031]"
    },
    "50": {
        "#": "50",
        "Sentence": "And just after the war I spent two days with them in Chicago.",
        "Embedding": "[  1.7772185 -10.353881  -38.551983 ]"
    },
    "51": {
        "#": "51",
        "Sentence": "Her husband, among various physical accomplishments, had been one ofthe most powerful ends that ever played football at New Haven\u2014a national figure in a way, one of those men who reach such an acute limited excellence at twenty-one that everything afterward savours of anticlimax.",
        "Embedding": "[ 8.365992  6.465824 18.329124]"
    },
    "52": {
        "#": "52",
        "Sentence": "His family were enormously wealthy\u2014even in college hisfreedom with money was a matter for reproach\u2014but now he\u2019d left Chicagoand come East in a fashion that rather took your breath away: forinstance, he\u2019d brought down a string of polo ponies from LakeForest.",
        "Embedding": "[21.457222 31.79289  -9.388055]"
    },
    "53": {
        "#": "53",
        "Sentence": "It was hard to realize that a man in my own generation waswealthy enough to do that.",
        "Embedding": "[ -0.35362083 -25.964275   -20.171513  ]"
    },
    "54": {
        "#": "54",
        "Sentence": "Why they came East I don\u2019t know.",
        "Embedding": "[-33.77566    4.452834 -17.214384]"
    },
    "55": {
        "#": "55",
        "Sentence": "They had spent a year in France forno particular reason, and then drifted here and there unrestfullywherever people played polo and were rich together.",
        "Embedding": "[ 20.287228  33.630936 -10.73067 ]"
    },
    "56": {
        "#": "56",
        "Sentence": "This was apermanent move, said Daisy over the telephone, but I didn\u2019t believeit\u2014I had no sight into Daisy\u2019s heart, but I felt that Tom would drifton forever seeking, a little wistfully, for the dramatic turbulence ofsome irrecoverable football game.",
        "Embedding": "[-2.348118  8.436023 21.008062]"
    },
    "57": {
        "#": "57",
        "Sentence": "And so it happened that on a warm windy evening I drove over to EastEgg to see two old friends whom I scarcely knew at all.",
        "Embedding": "[  3.2662418  -5.6422577 -20.03976  ]"
    },
    "58": {
        "#": "58",
        "Sentence": "Their housewas even more elaborate than I expected, a cheerful red-and-whiteGeorgian Colonial mansion, overlooking the bay.",
        "Embedding": "[ 18.922503  15.773614 -14.761935]"
    },
    "59": {
        "#": "59",
        "Sentence": "The lawn started atthe beach and ran towards the front door for a quarter of a mile,jumping over sundials and brick walks and burning gardens\u2014finally whenit reached the house drifting up the side in bright vines as thoughfrom the momentum of its run.",
        "Embedding": "[35.859898  12.858385   5.1441193]"
    },
    "60": {
        "#": "60",
        "Sentence": "The front was broken by a line of Frenchwindows, glowing now with reflected gold and wide open to the warmwindy afternoon, and Tom Buchanan in riding clothes was standing withhis legs apart on the front porch.",
        "Embedding": "[29.022396  10.384769   5.7585545]"
    },
    "61": {
        "#": "61",
        "Sentence": "He had changed since his New Haven years.",
        "Embedding": "[-29.10501  -25.936188 -10.655099]"
    },
    "62": {
        "#": "62",
        "Sentence": "Now he was a sturdystraw-haired man of thirty, with a rather hard mouth and asupercilious manner.",
        "Embedding": "[ 25.65557   -10.172865   -2.0084147]"
    },
    "63": {
        "#": "63",
        "Sentence": "Two shining arrogant eyes had establisheddominance over his face and gave him the appearance of always leaningaggressively forward.",
        "Embedding": "[ 31.2795    -20.84832     7.2529483]"
    },
    "64": {
        "#": "64",
        "Sentence": "Not even the effeminate swank of his ridingclothes could hide the enormous power of that body\u2014he seemed to fillthose glistening boots until he strained the top lacing, and you couldsee a great pack of muscle shifting when his shoulder moved under histhin coat.",
        "Embedding": "[16.802164   2.3795867 17.060163 ]"
    },
    "65": {
        "#": "65",
        "Sentence": "It was a body capable of enormous leverage\u2014a cruel body.",
        "Embedding": "[  2.2552054 -28.045034  -20.687914 ]"
    },
    "66": {
        "#": "66",
        "Sentence": "His speaking voice, a gruff husky tenor, added to the impression offractiousness he conveyed.",
        "Embedding": "[  9.709556  -11.3544035  40.16223  ]"
    },
    "67": {
        "#": "67",
        "Sentence": "There was a touch of paternal contempt init, even toward people he liked\u2014and there were men at New Haven whohad hated his guts.",
        "Embedding": "[24.223125  -5.1876264 -4.9878373]"
    },
    "68": {
        "#": "68",
        "Sentence": "\u201cNow, don\u2019t think my opinion on these matters is final,\u201d he seemed tosay, \u201cjust because I\u2019m stronger and more of a man than you are.\u201d Wewere in the same senior society, and while we were never intimate Ialways had the impression that he approved of me and wanted me to likehim with some harsh, defiant wistfulness of his own.",
        "Embedding": "[-3.280677  -1.6555333 -2.982904 ]"
    },
    "69": {
        "#": "69",
        "Sentence": "We talked for a few minutes on the sunny porch.",
        "Embedding": "[ -0.7911327 -47.577343    4.3240833]"
    },
    "70": {
        "#": "70",
        "Sentence": "\u201cI\u2019ve got a nice place here,\u201d he said, his eyes flashing aboutrestlessly.",
        "Embedding": "[ -5.4159303 -26.930069   -9.62856  ]"
    },
    "71": {
        "#": "71",
        "Sentence": "Turning me around by one arm, he moved a broad flat hand along thefront vista, including in its sweep a sunken Italian garden, a halfacre of deep, pungent roses, and a snub-nosed motorboat that bumpedthe tide offshore.",
        "Embedding": "[26.556355 28.060534  8.066272]"
    },
    "72": {
        "#": "72",
        "Sentence": "\u201cIt belonged to Demaine, the oil man.\u201d He turned me around again,politely and abruptly.",
        "Embedding": "[ 13.195577  -37.70412    -3.5975695]"
    },
    "73": {
        "#": "73",
        "Sentence": "\u201cWe\u2019ll go inside.\u201dWe walked through a high hallway into a bright rosy-coloured space,fragilely bound into the house by French windows at either end.",
        "Embedding": "[38.721348 12.011927  5.731078]"
    },
    "74": {
        "#": "74",
        "Sentence": "Thewindows were ajar and gleaming white against the fresh grass outsidethat seemed to grow a little way into the house.",
        "Embedding": "[36.02535   16.230112   5.2388988]"
    },
    "75": {
        "#": "75",
        "Sentence": "A breeze blew throughthe room, blew curtains in at one end and out the other like paleflags, twisting them up toward the frosted wedding-cake of theceiling, and then rippled over the wine-coloured rug, making a shadowon it as wind does on the sea.",
        "Embedding": "[41.602184  5.068405  6.740881]"
    },
    "76": {
        "#": "76",
        "Sentence": "The only completely stationary object in the room was an enormouscouch on which two young women were buoyed up as though upon ananchored balloon.",
        "Embedding": "[30.1392     2.1943297 29.687178 ]"
    },
    "77": {
        "#": "77",
        "Sentence": "They were both in white, and their dresses wererippling and fluttering as if they had just been blown back in after ashort flight around the house.",
        "Embedding": "[31.16644   1.320785 26.073404]"
    },
    "78": {
        "#": "78",
        "Sentence": "I must have stood for a few momentslistening to the whip and snap of the curtains and the groan of apicture on the wall.",
        "Embedding": "[39.633995   3.6534169  8.006262 ]"
    },
    "79": {
        "#": "79",
        "Sentence": "Then there was a boom as Tom Buchanan shut therear windows and the caught wind died out about the room, and thecurtains and the rugs and the two young women ballooned slowly to thefloor.",
        "Embedding": "[26.570831 12.96687  19.764673]"
    },
    "80": {
        "#": "80",
        "Sentence": "The younger of the two was a stranger to me.",
        "Embedding": "[-19.847921 -25.096737 -26.888294]"
    },
    "81": {
        "#": "81",
        "Sentence": "She was extended fulllength at her end of the divan, completely motionless, and with herchin raised a little, as if she were balancing something on it whichwas quite likely to fall.",
        "Embedding": "[ 9.526396 -8.258657 22.491379]"
    },
    "82": {
        "#": "82",
        "Sentence": "If she saw me out of the corner of her eyesshe gave no hint of it\u2014indeed, I was almost surprised into murmuringan apology for having disturbed her by coming in.",
        "Embedding": "[-1.4471554 -1.9119059  9.011402 ]"
    },
    "83": {
        "#": "83",
        "Sentence": "The other girl, Daisy, made an attempt to rise\u2014she leaned slightlyforward with a conscientious expression\u2014then she laughed, an absurd,charming little laugh, and I laughed too and came forward into theroom.",
        "Embedding": "[ 7.1427526  3.7624106 34.88098  ]"
    },
    "84": {
        "#": "84",
        "Sentence": "\u201cI\u2019m p-paralysed with happiness.\u201dShe laughed again, as if she said something very witty, and held myhand for a moment, looking up into my face, promising that there wasno one in the world she so much wanted to see.",
        "Embedding": "[-1.8214134 -4.012141  13.549003 ]"
    },
    "85": {
        "#": "85",
        "Sentence": "That was a way she had.",
        "Embedding": "[-32.707302  -21.655231   -7.6400104]"
    },
    "86": {
        "#": "86",
        "Sentence": "She hinted in a murmur that the surname of the balancing girl wasBaker.",
        "Embedding": "[ -0.7308071 -13.0510645  25.308405 ]"
    },
    "87": {
        "#": "87",
        "Sentence": "(I\u2019ve heard it said that Daisy\u2019s murmur was only to make peoplelean toward her; an irrelevant criticism that made it no lesscharming.)",
        "Embedding": "[ -2.2957907 -11.143396   23.041718 ]"
    },
    "88": {
        "#": "88",
        "Sentence": "At any rate, Miss Baker\u2019s lips fluttered, she nodded at me almostimperceptibly, and then quickly tipped her head back again\u2014the objectshe was balancing had obviously tottered a little and given hersomething of a fright.",
        "Embedding": "[4.5629587 1.636242  8.987549 ]"
    },
    "89": {
        "#": "89",
        "Sentence": "Again a sort of apology arose to my lips.",
        "Embedding": "[  3.1786292 -20.765461  -31.474232 ]"
    },
    "90": {
        "#": "90",
        "Sentence": "Almost any exhibition of complete self-sufficiency draws a stunnedtribute from me.",
        "Embedding": "[  9.329059 -17.461332 -24.763176]"
    },
    "91": {
        "#": "91",
        "Sentence": "I looked back at my cousin, who began to ask me questions in her low,thrilling voice.",
        "Embedding": "[-23.706097    5.852253    7.5609474]"
    },
    "92": {
        "#": "92",
        "Sentence": "It was the kind of voice that the ear follows up anddown, as if each speech is an arrangement of notes that will never beplayed again.",
        "Embedding": "[ 11.666584  -11.3592825  36.157757 ]"
    },
    "93": {
        "#": "93",
        "Sentence": "Her face was sad and lovely with bright things in it,bright eyes and a bright passionate mouth, but there was an excitementin her voice that men who had cared for her found difficult to forget:a singing compulsion, a whispered \u201cListen,\u201d a promise that she haddone gay, exciting things just a while since and that there were gay,exciting things hovering in the next hour.",
        "Embedding": "[13.4889555 -7.736308  28.929459 ]"
    },
    "94": {
        "#": "94",
        "Sentence": "I told her how I had stopped off in Chicago for a day on my way East,and how a dozen people had sent their love through me.",
        "Embedding": "[-16.089163    -0.17864254  23.422844  ]"
    },
    "95": {
        "#": "95",
        "Sentence": "\u201cDo they miss me?\u201d she cried ecstatically.",
        "Embedding": "[-31.881916    -0.18878013  17.356869  ]"
    },
    "96": {
        "#": "96",
        "Sentence": "\u201cThe whole town is desolate.",
        "Embedding": "[-37.674706 -28.919418   6.186278]"
    },
    "97": {
        "#": "97",
        "Sentence": "All the cars have the left rear wheelpainted black as a mourning wreath, and there\u2019s a persistent wail allnight along the north shore.\u201d\u201cHow gorgeous!",
        "Embedding": "[33.630074   2.5473413  3.5702927]"
    },
    "98": {
        "#": "98",
        "Sentence": "Let\u2019s go back, Tom.",
        "Embedding": "[-24.878555   18.094059   -1.1377282]"
    },
    "99": {
        "#": "99",
        "Sentence": "Tomorrow!\u201d Then she addedirrelevantly: \u201cYou ought to see the baby.\u201d\u201cI\u2019d like to.\u201d\u201cShe\u2019s asleep.",
        "Embedding": "[-20.536264   -4.3450346   0.8819528]"
    },
    "100": {
        "#": "100",
        "Sentence": "She\u2019s three years old.",
        "Embedding": "[-28.176414 -26.482573  15.725018]"
    },
    "101": {
        "#": "101",
        "Sentence": "Haven\u2019t you ever seen her?\u201d\u201cNever.\u201d\u201cWell, you ought to see her.",
        "Embedding": "[-35.399456  -10.566203    6.9653807]"
    },
    "102": {
        "#": "102",
        "Sentence": "She\u2019s\u2014\u201dTom Buchanan, who had been hovering restlessly about the room, stoppedand rested his hand on my shoulder.",
        "Embedding": "[18.3487   -9.413607 15.36884 ]"
    },
    "103": {
        "#": "103",
        "Sentence": "\u201cWhat you doing, Nick?\u201d\u201cI\u2019m a bond man.\u201d\u201cWho with?\u201dI told him.",
        "Embedding": "[-11.005524   8.724537 -26.984737]"
    },
    "104": {
        "#": "104",
        "Sentence": "\u201cNever heard of them,\u201d he remarked decisively.",
        "Embedding": "[-15.264766 -28.281908 -12.044592]"
    },
    "105": {
        "#": "105",
        "Sentence": "This annoyed me.",
        "Embedding": "[-33.503635 -10.488349 -10.83983 ]"
    },
    "106": {
        "#": "106",
        "Sentence": "\u201cYou will,\u201d I answered shortly.",
        "Embedding": "[-21.699026    1.1735954 -13.838108 ]"
    },
    "107": {
        "#": "107",
        "Sentence": "\u201cYou will if you stay in the East.\u201d\u201cOh, I\u2019ll stay in the East, don\u2019t you worry,\u201d he said, glancing atDaisy and then back at me, as if he were alert for somethingmore.",
        "Embedding": "[-10.581275    -0.97603786 -13.288245  ]"
    },
    "108": {
        "#": "108",
        "Sentence": "\u201cI\u2019d be a God damned fool to live anywhere else.\u201dAt this point Miss Baker said: \u201cAbsolutely!\u201d with such suddenness thatI started\u2014it was the first word she had uttered since I came into theroom.",
        "Embedding": "[-4.873408   3.9013708 11.226708 ]"
    },
    "109": {
        "#": "109",
        "Sentence": "Evidently it surprised her as much as it did me, for she yawnedand with a series of rapid, deft movements stood up into the room.",
        "Embedding": "[10.216344  -9.6858225 20.609829 ]"
    },
    "110": {
        "#": "110",
        "Sentence": "\u201cI\u2019m stiff,\u201d she complained, \u201cI\u2019ve been lying on that sofa for as longas I can remember.\u201d\u201cDon\u2019t look at me,\u201d Daisy retorted, \u201cI\u2019ve been trying to get you toNew York all afternoon.\u201d\u201cNo, thanks,\u201d said Miss Baker to the four cocktails just in from thepantry.",
        "Embedding": "[ 4.4271173 16.669897  -3.5028436]"
    },
    "111": {
        "#": "111",
        "Sentence": "\u201cI\u2019m absolutely in training.\u201dHer host looked at her incredulously.",
        "Embedding": "[-24.530933 -12.305854  14.360598]"
    },
    "112": {
        "#": "112",
        "Sentence": "\u201cYou are!\u201d He took down his drink as if it were a drop in the bottomof a glass.",
        "Embedding": "[-12.004562  -17.608744   -7.6498427]"
    },
    "113": {
        "#": "113",
        "Sentence": "\u201cHow you ever get anything done is beyond me.\u201dI looked at Miss Baker, wondering what it was she \u201cgot done.\u201d Ienjoyed looking at her.",
        "Embedding": "[-0.6222333  3.9704208  9.060719 ]"
    },
    "114": {
        "#": "114",
        "Sentence": "She was a slender, small-breasted girl, withan erect carriage, which she accentuated by throwing her body backwardat the shoulders like a young cadet.",
        "Embedding": "[10.837584   7.4895506 25.617823 ]"
    },
    "115": {
        "#": "115",
        "Sentence": "Her grey sun-strained eyes lookedback at me with polite reciprocal curiosity out of a wan, charming,discontented face.",
        "Embedding": "[ 29.677578  -26.005318    2.7898374]"
    },
    "116": {
        "#": "116",
        "Sentence": "It occurred to me now that I had seen her, or apicture of her, somewhere before.",
        "Embedding": "[-13.892037  -13.4368925  23.736536 ]"
    },
    "117": {
        "#": "117",
        "Sentence": "\u201cYou live in West Egg,\u201d she remarked contemptuously.",
        "Embedding": "[  1.8251246  19.30444   -25.575682 ]"
    },
    "118": {
        "#": "118",
        "Sentence": "\u201cI know somebodythere.\u201d\u201cI don\u2019t know a single\u2014\u201d\u201cYou must know Gatsby.\u201d\u201cGatsby?\u201d demanded Daisy.",
        "Embedding": "[-16.22337   10.237897  26.212093]"
    },
    "119": {
        "#": "119",
        "Sentence": "\u201cWhat Gatsby?\u201dBefore I could reply that he was my neighbour dinner was announced;wedging his tense arm imperatively under mine, Tom Buchanan compelledme from the room as though he were moving a checker to another square.",
        "Embedding": "[ 6.376312 14.013325  2.56868 ]"
    },
    "120": {
        "#": "120",
        "Sentence": "Slenderly, languidly, their hands set lightly on their hips, the twoyoung women preceded us out on to a rosy-coloured porch, open towardthe sunset, where four candles flickered on the table in thediminished wind.",
        "Embedding": "[33.987362  7.572701 12.819475]"
    },
    "121": {
        "#": "121",
        "Sentence": "\u201cWhy candles?\u201d objected Daisy, frowning.",
        "Embedding": "[-20.644354  21.942831  28.758324]"
    },
    "122": {
        "#": "122",
        "Sentence": "She snapped them out with herfingers.",
        "Embedding": "[-25.341148 -20.854025  16.43158 ]"
    },
    "123": {
        "#": "123",
        "Sentence": "\u201cIn two weeks it\u2019ll be the longest day in the year.\u201d Shelooked at us all radiantly.",
        "Embedding": "[ -3.4232812   1.6536081 -33.235435 ]"
    },
    "124": {
        "#": "124",
        "Sentence": "\u201cDo you always watch for the longest dayof the year and then miss it?",
        "Embedding": "[ -6.143144    3.9067085 -32.543465 ]"
    },
    "125": {
        "#": "125",
        "Sentence": "I always watch for the longest day inthe year and then miss it.\u201d\u201cWe ought to plan something,\u201d yawned Miss Baker, sitting down at thetable as if she were getting into bed.",
        "Embedding": "[-1.1254079  6.0613723 11.8154955]"
    },
    "126": {
        "#": "126",
        "Sentence": "\u201cAll right,\u201d said Daisy.",
        "Embedding": "[-17.089443  15.693478  23.475895]"
    },
    "127": {
        "#": "127",
        "Sentence": "\u201cWhat\u2019ll we plan?\u201d She turned to mehelplessly: \u201cWhat do people plan?\u201dBefore I could answer her eyes fastened with an awed expression on herlittle finger.",
        "Embedding": "[ 4.876115  -3.6812742 24.748335 ]"
    },
    "128": {
        "#": "128",
        "Sentence": "\u201cLook!\u201d she complained; \u201cI hurt it.\u201dWe all looked\u2014the knuckle was black and blue.",
        "Embedding": "[ 10.602407   4.633677 -35.41056 ]"
    },
    "129": {
        "#": "129",
        "Sentence": "\u201cYou did it, Tom,\u201d she said accusingly.",
        "Embedding": "[-21.155981   14.034357    2.0807183]"
    },
    "130": {
        "#": "130",
        "Sentence": "\u201cI know you didn\u2019t mean to,but you did do it.",
        "Embedding": "[-20.991674     0.11134247 -21.469135  ]"
    },
    "131": {
        "#": "131",
        "Sentence": "That\u2019s what I get for marrying a brute of a man, agreat, big, hulking physical specimen of a\u2014\u201d\u201cI hate that word \u2018hulking,\u2019\u200a\u201d objected Tom crossly, \u201ceven inkidding.\u201d\u201cHulking,\u201d insisted Daisy.",
        "Embedding": "[17.850443  -4.475578  -2.0286078]"
    },
    "132": {
        "#": "132",
        "Sentence": "Sometimes she and Miss Baker talked at once, unobtrusively and with abantering inconsequence that was never quite chatter, that was as coolas their white dresses and their impersonal eyes in the absence of alldesire.",
        "Embedding": "[ 2.8936415  3.3200004 14.447176 ]"
    },
    "133": {
        "#": "133",
        "Sentence": "They were here, and they accepted Tom and me, making only apolite pleasant effort to entertain or to be entertained.",
        "Embedding": "[ 30.72243  -17.172838  21.72785 ]"
    },
    "134": {
        "#": "134",
        "Sentence": "They knewthat presently dinner would be over and a little later the evening toowould be over and casually put away.",
        "Embedding": "[ 48.411106  -6.021873 -12.566298]"
    },
    "135": {
        "#": "135",
        "Sentence": "It was sharply different from theWest, where an evening was hurried from phase to phase towards itsclose, in a continually disappointed anticipation or else in sheernervous dread of the moment itself.",
        "Embedding": "[ 23.80992  -10.994293   4.697752]"
    },
    "136": {
        "#": "136",
        "Sentence": "\u201cYou make me feel uncivilized, Daisy,\u201d I confessed on my second glassof corky but rather impressive claret.",
        "Embedding": "[-22.89229   19.274796  19.019867]"
    },
    "137": {
        "#": "137",
        "Sentence": "\u201cCan\u2019t you talk about crops orsomething?\u201dI meant nothing in particular by this remark, but it was taken up inan unexpected way.",
        "Embedding": "[ -3.0467553 -17.048948   20.17375  ]"
    },
    "138": {
        "#": "138",
        "Sentence": "\u201cCivilization\u2019s going to pieces,\u201d broke out Tom violently.",
        "Embedding": "[-23.812805    27.350819    -0.12490641]"
    },
    "139": {
        "#": "139",
        "Sentence": "\u201cI\u2019vegotten to be a terrible pessimist about things.",
        "Embedding": "[-13.192947  -8.941      9.348518]"
    },
    "140": {
        "#": "140",
        "Sentence": "Have you read The Riseof the Coloured Empires by this man Goddard?\u201d\u201cWhy, no,\u201d I answered, rather surprised by his tone.",
        "Embedding": "[-0.19332922  2.9526844  -7.1082993 ]"
    },
    "141": {
        "#": "141",
        "Sentence": "\u201cWell, it\u2019s a fine book, and everybody ought to read it.",
        "Embedding": "[-16.669876   -2.6136198  -6.0026083]"
    },
    "142": {
        "#": "142",
        "Sentence": "The idea isif we don\u2019t look out the white race will be\u2014will be utterlysubmerged.",
        "Embedding": "[ 11.465134   9.344353 -27.590443]"
    },
    "143": {
        "#": "143",
        "Sentence": "It\u2019s all scientific stuff; it\u2019s been proved.\u201d\u201cTom\u2019s getting very profound,\u201d said Daisy, with an expression ofunthoughtful sadness.",
        "Embedding": "[-9.241367 12.93519  27.047215]"
    },
    "144": {
        "#": "144",
        "Sentence": "\u201cHe reads deep books with long words inthem.",
        "Embedding": "[-18.260935    1.0069777  -4.59046  ]"
    },
    "145": {
        "#": "145",
        "Sentence": "What was that word we\u2014\u201d\u201cWell, these books are all scientific,\u201d insisted Tom, glancing at herimpatiently.",
        "Embedding": "[-26.997574  27.532967   9.458428]"
    },
    "146": {
        "#": "146",
        "Sentence": "\u201cThis fellow has worked out the whole thing.",
        "Embedding": "[-35.312775  -22.86389    -4.4371815]"
    },
    "147": {
        "#": "147",
        "Sentence": "It\u2019s up tous, who are the dominant race, to watch out or these other races willhave control of things.\u201d\u201cWe\u2019ve got to beat them down,\u201d whispered Daisy, winking ferociouslytoward the fervent sun.",
        "Embedding": "[ 20.8464    12.365718 -28.910198]"
    },
    "148": {
        "#": "148",
        "Sentence": "\u201cYou ought to live in California\u2014\u201d began Miss Baker, but Tominterrupted her by shifting heavily in his chair.",
        "Embedding": "[-6.0975547  6.768201  11.091757 ]"
    },
    "149": {
        "#": "149",
        "Sentence": "\u201cThis idea is that we\u2019re Nordics.",
        "Embedding": "[-35.052837 -24.960636  -7.30178 ]"
    },
    "150": {
        "#": "150",
        "Sentence": "I am, and you are, and you are,and\u2014\u201d After an infinitesimal hesitation he included Daisy with aslight nod, and she winked at me again.",
        "Embedding": "[1.9385107 3.1526406 0.0583147]"
    },
    "151": {
        "#": "151",
        "Sentence": "\u201c\u2014And we\u2019ve produced all thethings that go to make civilization\u2014oh, science and art, and allthat.",
        "Embedding": "[  3.6751416 -29.563736    8.9853325]"
    },
    "152": {
        "#": "152",
        "Sentence": "Do you see?\u201dThere was something pathetic in his concentration, as if hiscomplacency, more acute than of old, was not enough to him any more.",
        "Embedding": "[ 24.763288  -12.388098   -5.3001547]"
    },
    "153": {
        "#": "153",
        "Sentence": "When, almost immediately, the telephone rang inside and the butlerleft the porch Daisy seized upon the momentary interruption and leanedtowards me.",
        "Embedding": "[40.260906   4.026371   2.2074203]"
    },
    "154": {
        "#": "154",
        "Sentence": "\u201cI\u2019ll tell you a family secret,\u201d she whispered enthusiastically.",
        "Embedding": "[-24.998333  -5.875149  14.4115  ]"
    },
    "155": {
        "#": "155",
        "Sentence": "\u201cIt\u2019s about the butler\u2019s nose.",
        "Embedding": "[ -3.8380487   9.943044  -27.308716 ]"
    },
    "156": {
        "#": "156",
        "Sentence": "Do you want to hear about the butler\u2019snose?\u201d\u201cThat\u2019s why I came over tonight.\u201d\u201cWell, he wasn\u2019t always a butler; he used to be the silver polisherfor some people in New York that had a silver service for two hundredpeople.",
        "Embedding": "[ -5.1456094   9.001215  -19.67043  ]"
    },
    "157": {
        "#": "157",
        "Sentence": "He had to polish it from morning till night, until finally itbegan to affect his nose\u2014\u201d\u201cThings went from bad to worse,\u201d suggested Miss Baker.",
        "Embedding": "[18.064081  -9.928471  -1.7536254]"
    },
    "158": {
        "#": "158",
        "Sentence": "\u201cYes.",
        "Embedding": "[-42.054848   -6.6908526  -8.6083145]"
    },
    "159": {
        "#": "159",
        "Sentence": "Things went from bad to worse, until finally he had to give uphis position.\u201dFor a moment the last sunshine fell with romantic affection upon herglowing face; her voice compelled me forward breathlessly as Ilistened\u2014then the glow faded, each light deserting her with lingeringregret, like children leaving a pleasant street at dusk.",
        "Embedding": "[15.158958 -6.926391 27.483034]"
    },
    "160": {
        "#": "160",
        "Sentence": "The butler came back and murmured something close to Tom\u2019s ear,whereupon Tom frowned, pushed back his chair, and without a word wentinside.",
        "Embedding": "[10.440844 24.970436 17.34539 ]"
    },
    "161": {
        "#": "161",
        "Sentence": "As if his absence quickened something within her, Daisy leanedforward again, her voice glowing and singing.",
        "Embedding": "[ 8.966328 -6.057702 35.062656]"
    },
    "162": {
        "#": "162",
        "Sentence": "\u201cI love to see you at my table, Nick.",
        "Embedding": "[-24.385614  14.598834  17.119884]"
    },
    "163": {
        "#": "163",
        "Sentence": "You remind me of a\u2014of a rose, anabsolute rose.",
        "Embedding": "[-27.390043    0.1351248 -38.982754 ]"
    },
    "164": {
        "#": "164",
        "Sentence": "Doesn\u2019t he?\u201d She turned to Miss Baker for confirmation:\u201cAn absolute rose?\u201dThis was untrue.",
        "Embedding": "[-8.824436   6.2902994  7.699403 ]"
    },
    "165": {
        "#": "165",
        "Sentence": "I am not even faintly like a rose.",
        "Embedding": "[-27.554604   -1.4628358 -37.95684  ]"
    },
    "166": {
        "#": "166",
        "Sentence": "She was onlyextemporizing, but a stirring warmth flowed from her, as if her heartwas trying to come out to you concealed in one of those breathless,thrilling words.",
        "Embedding": "[ 11.760977 -12.316126  25.266338]"
    },
    "167": {
        "#": "167",
        "Sentence": "Then suddenly she threw her napkin on the table andexcused herself and went into the house.",
        "Embedding": "[ 22.62651  -16.57916   26.641665]"
    },
    "168": {
        "#": "168",
        "Sentence": "Miss Baker and I exchanged a short glance consciously devoid ofmeaning.",
        "Embedding": "[-0.3265034  5.7905493  5.6427393]"
    },
    "169": {
        "#": "169",
        "Sentence": "I was about to speak when she sat up alertly and said \u201cSh!\u201din a warning voice.",
        "Embedding": "[ 16.506063  -29.508726   -4.2573724]"
    },
    "170": {
        "#": "170",
        "Sentence": "A subdued impassioned murmur was audible in theroom beyond, and Miss Baker leaned forward unashamed, trying to hear.",
        "Embedding": "[32.02768  -8.153749 23.564705]"
    },
    "171": {
        "#": "171",
        "Sentence": "The murmur trembled on the verge of coherence, sank down,mounted excitedly, and then ceased altogether.",
        "Embedding": "[30.701294 -7.471335 25.09827 ]"
    },
    "172": {
        "#": "172",
        "Sentence": "\u201cThis Mr. Gatsby you spoke of is my neighbour\u2014\u201d I began.",
        "Embedding": "[-3.864018 36.899536 -8.79469 ]"
    },
    "173": {
        "#": "173",
        "Sentence": "\u201cDon\u2019t talk.",
        "Embedding": "[-37.336365   -6.5974298 -16.207502 ]"
    },
    "174": {
        "#": "174",
        "Sentence": "I want to hear what happens.\u201d\u201cIs something happening?\u201d I inquired innocently.",
        "Embedding": "[-23.326109   -2.0771017  -5.327452 ]"
    },
    "175": {
        "#": "175",
        "Sentence": "\u201cYou mean to say you don\u2019t know?\u201d said Miss Baker, honestly surprised.",
        "Embedding": "[-6.7973657  5.6261606  6.3623576]"
    },
    "176": {
        "#": "176",
        "Sentence": "\u201cI thought everybody knew.\u201d\u201cI don\u2019t.\u201d\u201cWhy\u2014\u201d she said hesitantly.",
        "Embedding": "[-27.13921  -13.955095   6.858993]"
    },
    "177": {
        "#": "177",
        "Sentence": "\u201cTom\u2019s got some woman in New York.\u201d\u201cGot some woman?\u201d I repeated blankly.",
        "Embedding": "[-17.182007   19.778212    6.4115677]"
    },
    "178": {
        "#": "178",
        "Sentence": "Miss Baker nodded.",
        "Embedding": "[-4.641352  8.00096   4.767566]"
    },
    "179": {
        "#": "179",
        "Sentence": "\u201cShe might have the decency not to telephone him at dinner time.",
        "Embedding": "[-14.2573185 -18.403254   11.222711 ]"
    },
    "180": {
        "#": "180",
        "Sentence": "Don\u2019t you think?\u201dAlmost before I had grasped her meaning there was the flutter of adress and the crunch of leather boots, and Tom and Daisy were back atthe table.",
        "Embedding": "[ 1.0091631 18.954262  -1.0441635]"
    },
    "181": {
        "#": "181",
        "Sentence": "\u201cIt couldn\u2019t be helped!\u201d cried Daisy with tense gaiety.",
        "Embedding": "[-22.100945    9.6425705  24.516481 ]"
    },
    "182": {
        "#": "182",
        "Sentence": "She sat down, glanced searchingly at Miss Baker and then at me, andcontinued: \u201cI looked outdoors for a minute, and it\u2019s very romanticoutdoors.",
        "Embedding": "[1.2822006 4.265847  6.708101 ]"
    },
    "183": {
        "#": "183",
        "Sentence": "There\u2019s a bird on the lawn that I think must be anightingale come over on the Cunard or White Star Line.",
        "Embedding": "[ 14.908793  28.359745 -14.794145]"
    },
    "184": {
        "#": "184",
        "Sentence": "He\u2019s singingaway\u2014\u201d Her voice sang: \u201cIt\u2019s romantic, isn\u2019t it, Tom?\u201d\u201cVery romantic,\u201d he said, and then miserably to me: \u201cIf it\u2019s lightenough after dinner, I want to take you down to the stables.\u201dThe telephone rang inside, startlingly, and as Daisy shook her head decisively at Tom the subject of the stables, in fact all subjects, vanished into air.",
        "Embedding": "[ 3.0373304 14.6822    -5.908511 ]"
    },
    "185": {
        "#": "185",
        "Sentence": "Among the broken fragments of the last five minute sat table I remember the candles being lit again, pointlessly, and Iwas conscious of wanting to look squarely at everyone, and yet toavoid all eyes.",
        "Embedding": "[41.293156   6.2362394 -8.425436 ]"
    },
    "186": {
        "#": "186",
        "Sentence": "I couldn\u2019t guess what Daisy and Tom were thinking, butI doubt if even Miss Baker, who seemed to have mastered a certainhardy scepticism, was able utterly to put this fifth guest\u2019s shrillmetallic urgency out of mind.",
        "Embedding": "[-1.9621714  8.214778  18.28426  ]"
    },
    "187": {
        "#": "187",
        "Sentence": "To a certain temperament the situationmight have seemed intriguing\u2014my own instinct was to telephoneimmediately for the police.",
        "Embedding": "[ 27.226477  -9.717359 -23.097116]"
    },
    "188": {
        "#": "188",
        "Sentence": "The horses, needless to say, were not mentioned again.",
        "Embedding": "[-10.813601  41.443172  -7.542842]"
    },
    "189": {
        "#": "189",
        "Sentence": "Tom and MissBaker, with several feet of twilight between them, strolled back into the library, as if to a vigil beside a perfectly tangible body, while,trying to look pleasantly interested and a little deaf, I followedDaisy around a chain of connecting verandas to the porch in front.",
        "Embedding": "[30.909313  8.552054  8.977975]"
    },
    "190": {
        "#": "190",
        "Sentence": "Inits deep gloom we sat down side by side on a wicker settee.",
        "Embedding": "[45.87276   5.379309 22.987652]"
    },
    "191": {
        "#": "191",
        "Sentence": "Daisy took her face in her hands as if feeling its lovely shape, andher eyes moved gradually out into the velvet dusk.",
        "Embedding": "[ 6.3679414  -0.96280557 25.45127   ]"
    },
    "192": {
        "#": "192",
        "Sentence": "I saw thatturbulent emotions possessed her, so I asked what I thought would besome sedative questions about her little girl.",
        "Embedding": "[-6.034049  1.495967 19.78957 ]"
    },
    "193": {
        "#": "193",
        "Sentence": "\u201cWe don\u2019t know each other very well, Nick,\u201d she said suddenly.",
        "Embedding": "[-22.21742   12.178631  11.13947 ]"
    },
    "194": {
        "#": "194",
        "Sentence": "\u201cEvenif we are cousins.",
        "Embedding": "[-41.5025     8.587593   9.750903]"
    },
    "195": {
        "#": "195",
        "Sentence": "You didn\u2019t come to my wedding.\u201d\u201cI wasn\u2019t back from the war.\u201d\u201cThat\u2019s true.\u201d She hesitated.",
        "Embedding": "[-13.906455   2.855619 -20.476963]"
    },
    "196": {
        "#": "196",
        "Sentence": "\u201cWell, I\u2019ve had a very bad time, Nick,and I\u2019m pretty cynical about everything.\u201dEvidently she had reason to be.",
        "Embedding": "[-10.975022  -8.234862  11.313317]"
    },
    "197": {
        "#": "197",
        "Sentence": "I waited but she didn\u2019t say any more,and after a moment I returned rather feebly to the subject of herdaughter.",
        "Embedding": "[  4.3337874 -13.912968   -8.3424225]"
    },
    "198": {
        "#": "198",
        "Sentence": "\u201cI suppose she talks, and\u2014eats, and everything.\u201d\u201cOh, yes.\u201d She looked at me absently.",
        "Embedding": "[-23.068863  -9.901258  19.231077]"
    },
    "199": {
        "#": "199",
        "Sentence": "\u201cListen, Nick; let me tell youwhat I said when she was born.",
        "Embedding": "[-25.482393  11.138587  11.725536]"
    },
    "200": {
        "#": "200",
        "Sentence": "Would you like to hear?\u201d\u201cVery much.\u201d\u201cIt\u2019ll show you how I\u2019ve gotten to feel about\u2014things.",
        "Embedding": "[-12.766764  12.342161 -18.458094]"
    },
    "201": {
        "#": "201",
        "Sentence": "Well, she wasless than an hour old and Tom was God knows where.",
        "Embedding": "[-13.319964   12.873311    2.6369853]"
    },
    "202": {
        "#": "202",
        "Sentence": "I woke up out ofthe ether with an utterly abandoned feeling, and asked the nurse rightaway if it was a boy or a girl.",
        "Embedding": "[-9.861521   5.592404  -1.0186797]"
    },
    "203": {
        "#": "203",
        "Sentence": "She told me it was a girl, and so Iturned my head away and wept.",
        "Embedding": "[-24.370844   -4.4147043  20.954542 ]"
    },
    "204": {
        "#": "204",
        "Sentence": "\u2018All right,\u2019 I said, \u2018I\u2019m glad it\u2019s agirl.",
        "Embedding": "[-30.786419  -5.122745  -4.818526]"
    },
    "205": {
        "#": "205",
        "Sentence": "And I hope she\u2019ll be a fool\u2014that\u2019s the best thing a girl can bein this world, a beautiful little fool.\u2019\u201cYou see I think everything\u2019s terrible anyhow,\u201d she went on in aconvinced way.",
        "Embedding": "[-4.167147  -3.6746373 19.742043 ]"
    },
    "206": {
        "#": "206",
        "Sentence": "\u201cEverybody thinks so\u2014the most advanced people.",
        "Embedding": "[-42.040718 -13.350161   9.412163]"
    },
    "207": {
        "#": "207",
        "Sentence": "And Iknow.",
        "Embedding": "[-51.615074   -8.6997175 -22.735104 ]"
    },
    "208": {
        "#": "208",
        "Sentence": "I\u2019ve been everywhere and seen everything and done everything.\u201dHer eyes flashed around her in a defiant way, rather like Tom\u2019s, andshe laughed with thrilling scorn.",
        "Embedding": "[ 2.0669172 -4.640231  12.117487 ]"
    },
    "209": {
        "#": "209",
        "Sentence": "\u201cSophisticated\u2014God, I\u2019msophisticated!\u201dThe instant her voice broke off, ceasing to compel my attention, mybelief, I felt the basic insincerity of what she had said.",
        "Embedding": "[ 9.588146 -8.010995 29.807293]"
    },
    "210": {
        "#": "210",
        "Sentence": "It made meuneasy, as though the whole evening had been a trick of some sort toexact a contributory emotion from me.",
        "Embedding": "[ 24.59519  -22.843557  -8.571018]"
    },
    "211": {
        "#": "211",
        "Sentence": "I waited, and sure enough, in amoment she looked at me with an absolute smirk on her lovely face, asif she had asserted her membership in a rather distinguished secretsociety to which she and Tom belonged.",
        "Embedding": "[ 1.1141925 -2.0094807 11.600969 ]"
    },
    "212": {
        "#": "212",
        "Sentence": "Inside, the crimson room bloomed with light.",
        "Embedding": "[  6.38865   38.068737 -18.213749]"
    },
    "213": {
        "#": "213",
        "Sentence": "Tom and Miss Baker sat ateither end of the long couch and she read aloud to him from the Saturday Evening Post\u2014the words, murmurous and uninflected, running together in a soothing tune.",
        "Embedding": "[ 7.939368 21.119083 19.14703 ]"
    },
    "214": {
        "#": "214",
        "Sentence": "The lamplight, bright on his boots anddull on the autumn-leaf yellow of her hair, glinted along the paper asshe turned a page with a flutter of slender muscles in her arms.",
        "Embedding": "[16.412172  2.436087 20.392324]"
    },
    "215": {
        "#": "215",
        "Sentence": "When we came in she held us silent for a moment with a lifted hand.",
        "Embedding": "[  8.562843  -38.481884    7.2124014]"
    },
    "216": {
        "#": "216",
        "Sentence": "\u201cTo be continued,\u201d she said, tossing the magazine on the table, \u201cinour very next issue.\u201dHer body asserted itself with a restless movement of her knee, and shestood up.",
        "Embedding": "[14.0411415 -6.2821455 21.510359 ]"
    },
    "217": {
        "#": "217",
        "Sentence": "\u201cTen o\u2019clock,\u201d she remarked, apparently finding the time on theceiling.",
        "Embedding": "[ 20.16724  -26.408127 -14.51322 ]"
    },
    "218": {
        "#": "218",
        "Sentence": "\u201cTime for this good girl to go to bed.\u201d\u201cJordan\u2019s going to play in the tournament tomorrow,\u201d explained Daisy,\u201cover at Westchester.\u201d\u201cOh\u2014you\u2019re Jordan Baker.\u201dI knew now why her face was familiar\u2014its pleasing contemptuousexpression had looked out at me from many rotogravure pictures of thesporting life at Asheville and Hot Springs and Palm Beach.",
        "Embedding": "[ 0.08297329 19.146427   21.040771  ]"
    },
    "219": {
        "#": "219",
        "Sentence": "I had heardsome story of her too, a critical, unpleasant story, but what it was Ihad forgotten long ago.",
        "Embedding": "[  0.6332209 -10.729989   18.538654 ]"
    },
    "220": {
        "#": "220",
        "Sentence": "\u201cGood night,\u201d she said softly.",
        "Embedding": "[-39.52149   19.100344 -10.416157]"
    },
    "221": {
        "#": "221",
        "Sentence": "\u201cWake me at eight, won\u2019t you.\u201d\u201cIf you\u2019ll get up.\u201d\u201cI will.",
        "Embedding": "[-25.903269    5.8459797 -12.251298 ]"
    },
    "222": {
        "#": "222",
        "Sentence": "Good night, Mr. Carraway.",
        "Embedding": "[-38.211246  18.47493  -11.939695]"
    },
    "223": {
        "#": "223",
        "Sentence": "See you anon.\u201d\u201cOf course you will,\u201d confirmed Daisy.",
        "Embedding": "[-20.56533   18.191448  23.991047]"
    },
    "224": {
        "#": "224",
        "Sentence": "\u201cIn fact I think I\u2019ll arrange amarriage.",
        "Embedding": "[-34.12821     5.8316083  -7.7590303]"
    },
    "225": {
        "#": "225",
        "Sentence": "Come over often, Nick, and I\u2019ll sort of\u2014oh\u2014fling youtogether.",
        "Embedding": "[-25.25729   12.182589  15.828189]"
    },
    "226": {
        "#": "226",
        "Sentence": "You know\u2014lock you up accidentally in linen closets and pushyou out to sea in a boat, and all that sort of thing\u2014\u201d\u201cGood night,\u201d called Miss Baker from the stairs.",
        "Embedding": "[22.334166  16.361609   0.7667687]"
    },
    "227": {
        "#": "227",
        "Sentence": "\u201cI haven\u2019t heard aword.\u201d\u201cShe\u2019s a nice girl,\u201d said Tom after a moment.",
        "Embedding": "[-17.788502   20.485779    1.2831728]"
    },
    "228": {
        "#": "228",
        "Sentence": "\u201cThey oughtn\u2019t to lether run around the country this way.\u201d\u201cWho oughtn\u2019t to?\u201d inquired Daisy coldly.",
        "Embedding": "[11.298012  -2.5138922 40.53038  ]"
    },
    "229": {
        "#": "229",
        "Sentence": "\u201cHer family.\u201d\u201cHer family is one aunt about a thousand years old.",
        "Embedding": "[-6.8356876 -7.940373  30.97224  ]"
    },
    "230": {
        "#": "230",
        "Sentence": "Besides, Nick\u2019sgoing to look after her, aren\u2019t you, Nick?",
        "Embedding": "[-28.515965  16.279238  13.095731]"
    },
    "231": {
        "#": "231",
        "Sentence": "She\u2019s going to spend lotsof weekends out here this summer.",
        "Embedding": "[-15.517123  26.804333 -20.234499]"
    },
    "232": {
        "#": "232",
        "Sentence": "I think the home influence will bevery good for her.\u201dDaisy and Tom looked at each other for a moment in silence.",
        "Embedding": "[ 20.234846  10.210645 -35.965202]"
    },
    "233": {
        "#": "233",
        "Sentence": "\u201cIs she from New York?\u201d I asked quickly.",
        "Embedding": "[ -3.248256  29.92319  -25.0924  ]"
    },
    "234": {
        "#": "234",
        "Sentence": "\u201cFrom Louisville.",
        "Embedding": "[-42.26676  -29.667778  -7.633984]"
    },
    "235": {
        "#": "235",
        "Sentence": "Our white girlhood was passed together there.",
        "Embedding": "[  8.685745   9.533126 -30.283613]"
    },
    "236": {
        "#": "236",
        "Sentence": "Ourbeautiful white\u2014\u201d\u201cDid you give Nick a little heart to heart talk on the veranda?\u201ddemanded Tom suddenly.",
        "Embedding": "[-20.16548   18.453901  11.995277]"
    },
    "237": {
        "#": "237",
        "Sentence": "\u201cDid I?\u201d She looked at me.",
        "Embedding": "[-29.281895  -8.145229   7.011439]"
    },
    "238": {
        "#": "238",
        "Sentence": "\u201cI can\u2019t seem to remember, but I think wetalked about the Nordic race.",
        "Embedding": "[ 13.688159    9.6933155 -25.969124 ]"
    },
    "239": {
        "#": "239",
        "Sentence": "Yes, I\u2019m sure we did.",
        "Embedding": "[-42.492493   -4.2926755  -3.3630705]"
    },
    "240": {
        "#": "240",
        "Sentence": "It sort of creptup on us and first thing you know\u2014\u201d\u201cDon\u2019t believe everything you hear, Nick,\u201d he advised me.",
        "Embedding": "[-19.989592  12.931848  13.287081]"
    },
    "241": {
        "#": "241",
        "Sentence": "I said lightly that I had heard nothing at all, and a few minuteslater I got up to go home.",
        "Embedding": "[ 12.604677 -22.44915  -10.655062]"
    },
    "242": {
        "#": "242",
        "Sentence": "They came to the door with me and stoodside by side in a cheerful square of light.",
        "Embedding": "[ 35.321117   -8.0045595 -13.2296   ]"
    },
    "243": {
        "#": "243",
        "Sentence": "As I started my motorDaisy peremptorily called: \u201cWait!\u201d\u201cI forgot to ask you something, and it\u2019s important.",
        "Embedding": "[-25.543278   8.204161   6.705576]"
    },
    "244": {
        "#": "244",
        "Sentence": "We heard you wereengaged to a girl out West.\u201d\u201cThat\u2019s right,\u201d corroborated Tom kindly.",
        "Embedding": "[-17.880507  17.465372   2.665414]"
    },
    "245": {
        "#": "245",
        "Sentence": "\u201cWe heard that you wereengaged.\u201d\u201cIt\u2019s a libel.",
        "Embedding": "[-29.981833  18.133514  23.05911 ]"
    },
    "246": {
        "#": "246",
        "Sentence": "I\u2019m too poor.\u201d\u201cBut we heard it,\u201d insisted Daisy, surprising me by opening up againin a flower-like way.",
        "Embedding": "[-10.442037  11.223211  22.306334]"
    },
    "247": {
        "#": "247",
        "Sentence": "\u201cWe heard it from three people, so it must betrue.\u201dOf course I knew what they were referring to, but I wasn\u2019t evenvaguely engaged.",
        "Embedding": "[-19.19064     -0.30253264  26.971636  ]"
    },
    "248": {
        "#": "248",
        "Sentence": "The fact that gossip had published the banns was oneof the reasons I had come East.",
        "Embedding": "[ -4.438091  21.627497 -20.010853]"
    },
    "249": {
        "#": "249",
        "Sentence": "You can\u2019t stop going with an oldfriend on account of rumours, and on the other hand I had no intentionof being rumoured into marriage.",
        "Embedding": "[-7.6822386   0.72408295  3.1641567 ]"
    },
    "250": {
        "#": "250",
        "Sentence": "Their interest rather touched me and made them less remotelyrich\u2014nevertheless, I was confused and a little disgusted as I droveaway.",
        "Embedding": "[ 10.920573 -32.737495  10.609832]"
    },
    "251": {
        "#": "251",
        "Sentence": "It seemed to me that the thing for Daisy to do was to rush outof the house, child in arms\u2014but apparently there were no suchintentions in her head.",
        "Embedding": "[-2.0018497  7.8089523 23.539066 ]"
    },
    "252": {
        "#": "252",
        "Sentence": "As for Tom, the fact that he \u201chad some womanin New York\u201d was really less surprising than that he had beendepressed by a book.",
        "Embedding": "[  0.32974306  23.487196   -15.202513  ]"
    },
    "253": {
        "#": "253",
        "Sentence": "Something was making him nibble at the edge ofstale ideas as if his sturdy physical egotism no longer nourished hisperemptory heart.",
        "Embedding": "[ 15.770651 -19.627655  17.071243]"
    },
    "254": {
        "#": "254",
        "Sentence": "Already it was deep summer on roadhouse roofs and in front of waysidegarages, where new red petrol-pumps sat out in pools of light, andwhen I reached my estate at West Egg I ran the car under its shed andsat for a while on an abandoned grass roller in the yard.",
        "Embedding": "[31.742514  19.04164    6.6361303]"
    },
    "255": {
        "#": "255",
        "Sentence": "The wind hadblown off, leaving a loud, bright night, with wings beating in thetrees and a persistent organ sound as the full bellows of the earthblew the frogs full of life.",
        "Embedding": "[39.305733   3.6661038 13.4988165]"
    },
    "256": {
        "#": "256",
        "Sentence": "The silhouette of a moving cat waveredacross the moonlight, and, turning my head to watch it, I saw that Iwas not alone\u2014fifty feet away a figure had emerged from the shadow ofmy neighbour\u2019s mansion and was standing with his hands in his pocketsregarding the silver pepper of the stars.",
        "Embedding": "[39.211765 11.384085 15.382988]"
    },
    "257": {
        "#": "257",
        "Sentence": "Something in his leisurelymovements and the secure position of his feet upon the lawn suggestedthat it was Mr. Gatsby himself, come out to determine what share washis of our local heavens.",
        "Embedding": "[15.007222 31.283077 -4.646938]"
    },
    "258": {
        "#": "258",
        "Sentence": "I decided to call to him.",
        "Embedding": "[-26.43858   -11.707765   -4.6956487]"
    },
    "259": {
        "#": "259",
        "Sentence": "Miss Baker had mentioned him at dinner, andthat would do for an introduction.",
        "Embedding": "[-2.694476  9.118609  7.874836]"
    },
    "260": {
        "#": "260",
        "Sentence": "But I didn\u2019t call to him, for hegave a sudden intimation that he was content to be alone\u2014he stretchedout his arms toward the dark water in a curious way, and, far as I wasfrom him, I could have sworn he was trembling.",
        "Embedding": "[-0.18725938 -8.87112    -0.0944649 ]"
    },
    "261": {
        "#": "261",
        "Sentence": "Involuntarily I glancedseaward\u2014and distinguished nothing except a single green light, minuteand far away, that might have been the end of a dock.",
        "Embedding": "[ 26.188204 -30.87597  -16.894154]"
    },
    "262": {
        "#": "262",
        "Sentence": "When I lookedonce more for Gatsby he had vanished, and I was alone again in theunquiet darkness.",
        "Embedding": "[ 7.8163977 34.84421   -3.873664 ]"
    },
    "263": {
        "#": "263",
        "Sentence": "IIAbout halfway between West Egg and New York the motor road hastilyjoins the railroad and runs beside it for a quarter of a mile, so asto shrink away from a certain desolate area of land.",
        "Embedding": "[35.216503 10.748352 -4.908746]"
    },
    "264": {
        "#": "264",
        "Sentence": "This is a valleyof ashes\u2014a fantastic farm where ashes grow like wheat into ridges andhills and grotesque gardens; where ashes take the forms of houses andchimneys and rising smoke and, finally, with a transcendent effort, ofash-grey men, who move dimly and already crumbling through the powderyair.",
        "Embedding": "[29.78832   13.0910225 13.320301 ]"
    },
    "265": {
        "#": "265",
        "Sentence": "Occasionally a line of grey cars crawls along an invisible track,gives out a ghastly creak, and comes to rest, and immediately theash-grey men swarm up with leaden spades and stir up an impenetrablecloud, which screens their obscure operations from your sight.",
        "Embedding": "[31.25865    2.4145188  7.9974732]"
    },
    "266": {
        "#": "266",
        "Sentence": "But above the grey land and the spasms of bleak dust which driftendlessly over it, you perceive, after a moment, the eyes of Doctor T.J. Eckleburg.",
        "Embedding": "[ 38.4408     8.447769 -12.034563]"
    },
    "267": {
        "#": "267",
        "Sentence": "The eyes of Doctor T. J. Eckleburg are blue andgigantic\u2014their retinas are one yard high.",
        "Embedding": "[ 41.067585   5.811912 -14.045389]"
    },
    "268": {
        "#": "268",
        "Sentence": "They look out of no face,but, instead, from a pair of enormous yellow spectacles which passover a nonexistent nose.",
        "Embedding": "[ 43.138847   5.583254 -10.884295]"
    },
    "269": {
        "#": "269",
        "Sentence": "Evidently some wild wag of an oculist setthem there to fatten his practice in the borough of Queens, and thensank down himself into eternal blindness, or forgot them and movedaway.",
        "Embedding": "[37.588814 10.848224 25.489819]"
    },
    "270": {
        "#": "270",
        "Sentence": "But his eyes, dimmed a little by many paintless days, under sunand rain, brood on over the solemn dumping ground.",
        "Embedding": "[35.887154  -3.6215172  7.5154967]"
    },
    "271": {
        "#": "271",
        "Sentence": "The valley of ashes is bounded on one side by a small foul river, and,when the drawbridge is up to let barges through, the passengers onwaiting trains can stare at the dismal scene for as long as half an hour.",
        "Embedding": "[28.530697 12.672707 -4.920803]"
    },
    "272": {
        "#": "272",
        "Sentence": "There is always a halt there of at least a minute, and it was because of this that I first met Tom Buchanan\u2019s mistress.",
        "Embedding": "[-16.235949   18.913977   -1.5893772]"
    },
    "273": {
        "#": "273",
        "Sentence": "The fact that he had one was insisted upon wherever he was known.",
        "Embedding": "[ -9.766649 -27.850822  21.04091 ]"
    },
    "274": {
        "#": "274",
        "Sentence": "His acquaintances resented the fact that he turned up in popular caf\u00e9swith her and, leaving her at a table, sauntered about, chatting withwhomsoever he knew.",
        "Embedding": "[  9.669217 -17.965801  11.178448]"
    },
    "275": {
        "#": "275",
        "Sentence": "Though I was curious to see her, I had no desire to meet her\u2014but I did.",
        "Embedding": "[-13.722587 -12.54059   21.479355]"
    },
    "276": {
        "#": "276",
        "Sentence": "I went up to New York with Tom on the train one afternoon, and when we stopped by the ash-heaps he jumped to his feetand, taking hold of my elbow, literally forced me from the car.",
        "Embedding": "[ 11.780494   -4.9971657 -15.79126  ]"
    },
    "277": {
        "#": "277",
        "Sentence": "\u201cWe\u2019re getting off,\u201d he insisted.",
        "Embedding": "[-21.07763   -14.177836    5.1366777]"
    },
    "278": {
        "#": "278",
        "Sentence": "\u201cI want you to meet my girl.\u201dI think he\u2019d tanked up a good deal at luncheon, and his determination to have my company bordered on violence.",
        "Embedding": "[  0.74144256  -3.1426346  -12.93652   ]"
    },
    "279": {
        "#": "279",
        "Sentence": "The supercilious assumption was that on Sunday afternoon I had nothing better to do.",
        "Embedding": "[ -6.364932   -6.7079988 -32.85153  ]"
    },
    "280": {
        "#": "280",
        "Sentence": "I followed him over a low whitewashed railroad fence, and we walkedback a hundred yards along the road under Doctor Eckleburg\u2019spersistent stare.",
        "Embedding": "[33.51746   13.481932  -4.2926936]"
    },
    "281": {
        "#": "281",
        "Sentence": "The only building in sight was a small block of yellow brick sitting on the edge of the waste land, a sort of compact Main Street ministering to it, and contiguous to absolutely nothing.",
        "Embedding": "[36.435333   6.4515524 -3.4567993]"
    },
    "282": {
        "#": "282",
        "Sentence": "One of the three shops it contained was for rent and another was an all-night restaurant, approached by a trail of ashes; the third was agarage\u2014Repairs.",
        "Embedding": "[45.42334   -0.8627566 -8.265527 ]"
    },
    "283": {
        "#": "283",
        "Sentence": "George B. Wilson.",
        "Embedding": "[-15.234321  25.476103  20.060675]"
    },
    "284": {
        "#": "284",
        "Sentence": "Cars bought and sold.\u2014and I followedTom inside.",
        "Embedding": "[ 13.863269 -14.523384 -32.163666]"
    },
    "285": {
        "#": "285",
        "Sentence": "The interior was unprosperous and bare; the only car visible was thedust-covered wreck of a Ford which crouched in a dim corner.",
        "Embedding": "[35.024677  3.807377 -2.598433]"
    },
    "286": {
        "#": "286",
        "Sentence": "It hadoccurred to me that this shadow of a garage must be a blind, and thatsumptuous and romantic apartments were concealed overhead, when theproprietor himself appeared in the door of an office, wiping his handson a piece of waste.",
        "Embedding": "[34.837868   0.3309926 -8.052992 ]"
    },
    "287": {
        "#": "287",
        "Sentence": "He was a blond, spiritless man, anaemic, andfaintly handsome.",
        "Embedding": "[ 10.304923 -25.510212 -29.07179 ]"
    },
    "288": {
        "#": "288",
        "Sentence": "When he saw us a damp gleam of hope sprang into hislight blue eyes.",
        "Embedding": "[ 34.414646  -20.256294    6.4189496]"
    },
    "289": {
        "#": "289",
        "Sentence": "\u201cHello, Wilson, old man,\u201d said Tom, slapping him jovially on theshoulder.",
        "Embedding": "[-14.927439  23.948668   9.60939 ]"
    },
    "290": {
        "#": "290",
        "Sentence": "\u201cHow\u2019s business?\u201d\u201cI can\u2019t complain,\u201d answered Wilson unconvincingly.",
        "Embedding": "[-8.125795 22.571703 16.550943]"
    },
    "291": {
        "#": "291",
        "Sentence": "\u201cWhen are yougoing to sell me that car?\u201d\u201cNext week; I\u2019ve got my man working on it now.\u201d\u201cWorks pretty slow, don\u2019t he?\u201d\u201cNo, he doesn\u2019t,\u201d said Tom coldly.",
        "Embedding": "[-17.638378   16.186102   -4.9864774]"
    },
    "292": {
        "#": "292",
        "Sentence": "\u201cAnd if you feel that way about it,maybe I\u2019d better sell it somewhere else after all.\u201d\u201cI don\u2019t mean that,\u201d explained Wilson quickly.",
        "Embedding": "[-11.939933  16.333124  14.067488]"
    },
    "293": {
        "#": "293",
        "Sentence": "\u201cI just meant\u2014\u201dHis voice faded off and Tom glanced impatiently around the garage.",
        "Embedding": "[ 18.754507   8.13798  -36.285954]"
    },
    "294": {
        "#": "294",
        "Sentence": "Then I heard footsteps on a stairs, and in a moment the thickishfigure of a woman blocked out the light from the office door.",
        "Embedding": "[35.164017  -7.1178484 -4.5981693]"
    },
    "295": {
        "#": "295",
        "Sentence": "She wasin the middle thirties, and faintly stout, but she carried her fleshsensuously as some women can.",
        "Embedding": "[  9.464734  -15.9206295  25.50839  ]"
    },
    "296": {
        "#": "296",
        "Sentence": "Her face, above a spotted dress of darkblue cr\u00eape-de-chine, contained no facet or gleam of beauty, but therewas an immediately perceptible vitality about her as if the nerves ofher body were continually smouldering.",
        "Embedding": "[ 7.353388  -1.4530514 18.782637 ]"
    },
    "297": {
        "#": "297",
        "Sentence": "She smiled slowly and, walking through her husband as if he were a ghost, shook hands with Tom,looking him flush in the eye.",
        "Embedding": "[ 15.603851 -17.04231   23.127766]"
    },
    "298": {
        "#": "298",
        "Sentence": "Then she wet her lips, and withoutturning around spoke to her husband in a soft, coarse voice:\u201cGet some chairs, why don\u2019t you, so somebody can sit down.\u201d\u201cOh, sure,\u201d agreed Wilson hurriedly, and went toward the littleoffice, mingling immediately with the cement colour of the walls.",
        "Embedding": "[-0.03232525 13.101288   10.434331  ]"
    },
    "299": {
        "#": "299",
        "Sentence": "Awhite ashen dust veiled his dark suit and his pale hair as it veiledeverything in the vicinity\u2014except his wife, who moved close to Tom.",
        "Embedding": "[12.0261965 25.055525  19.842539 ]"
    },
    "300": {
        "#": "300",
        "Sentence": "\u201cI want to see you,\u201d said Tom intently.",
        "Embedding": "[-21.931112   18.604242   -2.9680464]"
    },
    "301": {
        "#": "301",
        "Sentence": "\u201cGet on the next train.\u201d\u201cAll right.\u201d\u201cI\u2019ll meet you by the newsstand on the lower level.\u201dShe nodded and moved away from him just as George Wilson emerged withtwo chairs from his office door.",
        "Embedding": "[ 7.536882 10.833417  8.101756]"
    },
    "302": {
        "#": "302",
        "Sentence": "We waited for her down the road and out of sight.",
        "Embedding": "[ -5.646557 -44.8707     4.827472]"
    },
    "303": {
        "#": "303",
        "Sentence": "It was a few daysbefore the Fourth of July, and a grey, scrawny Italian child wassetting torpedoes in a row along the railroad track.",
        "Embedding": "[32.96374   18.154331  -4.5528407]"
    },
    "304": {
        "#": "304",
        "Sentence": "\u201cTerrible place, isn\u2019t it,\u201d said Tom, exchanging a frown with DoctorEckleburg.",
        "Embedding": "[-20.160519   23.777859    2.0821314]"
    },
    "305": {
        "#": "305",
        "Sentence": "\u201cAwful.\u201d\u201cIt does her good to get away.\u201d\u201cDoesn\u2019t her husband object?\u201d\u201cWilson?",
        "Embedding": "[-15.971056  -5.203593  34.74099 ]"
    },
    "306": {
        "#": "306",
        "Sentence": "He thinks she goes to see her sister in New York.",
        "Embedding": "[-11.694408 -14.040852  26.155764]"
    },
    "307": {
        "#": "307",
        "Sentence": "He\u2019s sodumb he doesn\u2019t know he\u2019s alive.\u201dSo Tom Buchanan and his girl and I went up together to New York\u2014or notquite together, for Mrs. Wilson sat discreetly in another car.",
        "Embedding": "[ 1.4126384 18.694876  13.596147 ]"
    },
    "308": {
        "#": "308",
        "Sentence": "Tomdeferred that much to the sensibilities of those East Eggers who mightbe on the train.",
        "Embedding": "[ 10.137956  -8.241237 -33.725506]"
    },
    "309": {
        "#": "309",
        "Sentence": "She had changed her dress to a brown figured muslin, which stretchedtight over her rather wide hips as Tom helped her to the platform inNew York.",
        "Embedding": "[11.4374695  9.34318   24.611813 ]"
    },
    "310": {
        "#": "310",
        "Sentence": "At the newsstand she bought a copy of Town Tattle and amoving-picture magazine, and in the station drugstore some cold creamand a small flask of perfume.",
        "Embedding": "[36.734947 20.535416 22.997808]"
    },
    "311": {
        "#": "311",
        "Sentence": "Upstairs, in the solemn echoing driveshe let four taxicabs drive away before she selected a new one,lavender-coloured with grey upholstery, and in this we slid out fromthe mass of the station into the glowing sunshine.",
        "Embedding": "[29.63126    6.2371993 12.611822 ]"
    },
    "312": {
        "#": "312",
        "Sentence": "But immediately sheturned sharply from the window and, leaning forward, tapped on thefront glass.",
        "Embedding": "[ 25.91636   -15.0162525  28.193155 ]"
    },
    "313": {
        "#": "313",
        "Sentence": "\u201cI want to get one of those dogs,\u201d she said earnestly.",
        "Embedding": "[-29.379404  24.762457 -12.607385]"
    },
    "314": {
        "#": "314",
        "Sentence": "\u201cI want to getone for the apartment.",
        "Embedding": "[-39.877106   9.367721  -8.825276]"
    },
    "315": {
        "#": "315",
        "Sentence": "They\u2019re nice to have\u2014a dog.\u201dWe backed up to a grey old man who bore an absurd resemblance to JohnD. Rockefeller.",
        "Embedding": "[ 16.475208  21.447588 -28.120245]"
    },
    "316": {
        "#": "316",
        "Sentence": "In a basket swung from his neck cowered a dozen veryrecent puppies of an indeterminate breed.",
        "Embedding": "[ 30.016815    6.1430464 -30.925692 ]"
    },
    "317": {
        "#": "317",
        "Sentence": "\u201cWhat kind are they?\u201d asked Mrs. Wilson eagerly, as he came to thetaxi-window.",
        "Embedding": "[-10.26661   20.20435   16.216143]"
    },
    "318": {
        "#": "318",
        "Sentence": "\u201cAll kinds.",
        "Embedding": "[-46.5392    -6.584907  -9.930602]"
    },
    "319": {
        "#": "319",
        "Sentence": "What kind do you want, lady?\u201d\u201cI\u2019d like to get one of those police dogs; I don\u2019t suppose you gotthat kind?\u201dThe man peered doubtfully into the basket, plunged in his hand anddrew one up, wriggling, by the back of the neck.",
        "Embedding": "[ 28.810223   4.564423 -31.669392]"
    },
    "320": {
        "#": "320",
        "Sentence": "\u201cThat\u2019s no police dog,\u201d said Tom.",
        "Embedding": "[-25.960318   26.632116   -7.7413697]"
    },
    "321": {
        "#": "321",
        "Sentence": "\u201cNo, it\u2019s not exactly a police dog,\u201d said the man with disappointmentin his voice.",
        "Embedding": "[-25.918146  28.712587  -8.650486]"
    },
    "322": {
        "#": "322",
        "Sentence": "\u201cIt\u2019s more of an Airedale.\u201d He passed his hand over thebrown washrag of a back.",
        "Embedding": "[  1.7637454 -34.123905  -17.51115  ]"
    },
    "323": {
        "#": "323",
        "Sentence": "\u201cLook at that coat.",
        "Embedding": "[-44.881317   -4.2602267 -26.761803 ]"
    },
    "324": {
        "#": "324",
        "Sentence": "Some coat.",
        "Embedding": "[-44.73       -5.5726647 -24.78845  ]"
    },
    "325": {
        "#": "325",
        "Sentence": "That\u2019s a dogthat\u2019ll never bother you with catching cold.\u201d\u201cI think it\u2019s cute,\u201d said Mrs. Wilson enthusiastically.",
        "Embedding": "[-8.949438 17.069302 16.031775]"
    },
    "326": {
        "#": "326",
        "Sentence": "\u201cHow much isit?\u201d\u201cThat dog?\u201d He looked at it admiringly.",
        "Embedding": "[-30.566883  26.39851  -12.505485]"
    },
    "327": {
        "#": "327",
        "Sentence": "\u201cThat dog will cost you tendollars.\u201dThe Airedale\u2014undoubtedly there was an Airedale concerned in itsomewhere, though its feet were startlingly white\u2014changed hands andsettled down into Mrs. Wilson\u2019s lap, where she fondled theweatherproof coat with rapture.",
        "Embedding": "[-10.551776  34.68328   12.134154]"
    },
    "328": {
        "#": "328",
        "Sentence": "\u201cIs it a boy or a girl?\u201d she asked delicately.",
        "Embedding": "[-11.7403      5.0290112  -2.0153956]"
    },
    "329": {
        "#": "329",
        "Sentence": "\u201cThat dog?",
        "Embedding": "[-40.307667 -20.366755  -8.034865]"
    },
    "330": {
        "#": "330",
        "Sentence": "That dog\u2019s a boy.\u201d\u201cIt\u2019s a bitch,\u201d said Tom decisively.",
        "Embedding": "[-26.889944   24.559967   -7.8358703]"
    },
    "331": {
        "#": "331",
        "Sentence": "\u201cHere\u2019s your money.",
        "Embedding": "[-23.08722   10.801929 -17.718302]"
    },
    "332": {
        "#": "332",
        "Sentence": "Go and buyten more dogs with it.\u201dWe drove over to Fifth Avenue, warm and soft, almost pastoral, on thesummer Sunday afternoon.",
        "Embedding": "[28.332375  25.571115   0.4361796]"
    },
    "333": {
        "#": "333",
        "Sentence": "I wouldn\u2019t have been surprised to see a greatflock of white sheep turn the corner.",
        "Embedding": "[  8.8569145   8.079084  -24.523628 ]"
    },
    "334": {
        "#": "334",
        "Sentence": "\u201cHold on,\u201d I said, \u201cI have to leave you here.\u201d\u201cNo you don\u2019t,\u201d interposed Tom quickly.",
        "Embedding": "[-21.23967   14.466448  -5.068667]"
    },
    "335": {
        "#": "335",
        "Sentence": "\u201cMyrtle\u2019ll be hurt if youdon\u2019t come up to the apartment.",
        "Embedding": "[-41.20403   11.345453  -8.118058]"
    },
    "336": {
        "#": "336",
        "Sentence": "Won\u2019t you, Myrtle?\u201d\u201cCome on,\u201d she urged.",
        "Embedding": "[-21.957224 -10.296393   9.341047]"
    },
    "337": {
        "#": "337",
        "Sentence": "\u201cI\u2019ll telephone my sister Catherine.",
        "Embedding": "[-36.125492    5.6928134  21.69078  ]"
    },
    "338": {
        "#": "338",
        "Sentence": "She\u2019s saidto be very beautiful by people who ought to know.\u201d\u201cWell, I\u2019d like to, but\u2014\u201dWe went on, cutting back again over the Park toward the West Hundreds.",
        "Embedding": "[-3.4643462 14.71585   20.730995 ]"
    },
    "339": {
        "#": "339",
        "Sentence": "At 158th Street the cab stopped at one slice in a long white cake ofapartment-houses.",
        "Embedding": "[36.285877  22.870169  -7.8060246]"
    },
    "340": {
        "#": "340",
        "Sentence": "Throwing a regal homecoming glance around theneighbourhood, Mrs. Wilson gathered up her dog and her otherpurchases, and went haughtily in.",
        "Embedding": "[ 9.020543 13.802076 21.34604 ]"
    },
    "341": {
        "#": "341",
        "Sentence": "\u201cI\u2019m going to have the McKees come up,\u201d she announced as we rose inthe elevator.",
        "Embedding": "[ -3.439184 -24.503468  34.752052]"
    },
    "342": {
        "#": "342",
        "Sentence": "\u201cAnd, of course, I got to call up my sister, too.\u201dThe apartment was on the top floor\u2014a small living-room, a smalldining-room, a small bedroom, and a bath.",
        "Embedding": "[ 14.390626  13.971093 -13.086358]"
    },
    "343": {
        "#": "343",
        "Sentence": "The living-room was crowdedto the doors with a set of tapestried furniture entirely too large forit, so that to move about was to stumble continually over scenes ofladies swinging in the gardens of Versailles.",
        "Embedding": "[18.486103 17.057638 21.67021 ]"
    },
    "344": {
        "#": "344",
        "Sentence": "The only picture was anover-enlarged photograph, apparently a hen sitting on a blurred rock.",
        "Embedding": "[ 39.597786  11.578599 -20.241163]"
    },
    "345": {
        "#": "345",
        "Sentence": "Looked at from a distance, however, the hen resolved itself into abonnet, and the countenance of a stout old lady beamed down into theroom.",
        "Embedding": "[36.571335   11.711566    0.15827204]"
    },
    "346": {
        "#": "346",
        "Sentence": "Several old copies of Town Tattle lay on the table together witha copy of Simon Called Peter, and some of the small scandal magazinesof Broadway.",
        "Embedding": "[39.26826  21.493248 22.252619]"
    },
    "347": {
        "#": "347",
        "Sentence": "Mrs. Wilson was first concerned with the dog.",
        "Embedding": "[-11.981811  20.148655  19.02837 ]"
    },
    "348": {
        "#": "348",
        "Sentence": "A reluctantelevator boy went for a box full of straw and some milk, to which headded on his own initiative a tin of large, hard dog biscuits\u2014one ofwhich decomposed apathetically in the saucer of milk allafternoon.",
        "Embedding": "[42.00505   16.180555  -3.0258913]"
    },
    "349": {
        "#": "349",
        "Sentence": "Meanwhile Tom brought out a bottle of whisky from a lockedbureau door.",
        "Embedding": "[-33.329784   20.746037   -3.0665207]"
    },
    "350": {
        "#": "350",
        "Sentence": "I have been drunk just twice in my life, and the second time was thatafternoon; so everything that happened has a dim, hazy cast over it,although until after eight o\u2019clock the apartment was full of cheerfulsun.",
        "Embedding": "[ 30.604633   -3.5675762 -19.160448 ]"
    },
    "351": {
        "#": "351",
        "Sentence": "Sitting on Tom\u2019s lap Mrs. Wilson called up several people on thetelephone; then there were no cigarettes, and I went out to buy someat the drugstore on the corner.",
        "Embedding": "[ 0.3692936 20.3446    12.708345 ]"
    },
    "352": {
        "#": "352",
        "Sentence": "When I came back they had bothdisappeared, so I sat down discreetly in the living-room and read achapter of Simon Called Peter\u2014either it was terrible stuff or thewhisky distorted things, because it didn\u2019t make any sense to me.",
        "Embedding": "[  9.052404    4.7443037 -11.093626 ]"
    },
    "353": {
        "#": "353",
        "Sentence": "Just as Tom and Myrtle (after the first drink Mrs. Wilson and I calledeach other by our first names) reappeared, company commenced to arriveat the apartment door.",
        "Embedding": "[ 4.76071  17.100294 15.265062]"
    },
    "354": {
        "#": "354",
        "Sentence": "The sister, Catherine, was a slender, worldly girl of about thirty,with a solid, sticky bob of red hair, and a complexion powdered milkywhite.",
        "Embedding": "[14.216501 25.240517 21.738712]"
    },
    "355": {
        "#": "355",
        "Sentence": "Her eyebrows had been plucked and then drawn on again at a morerakish angle, but the efforts of nature toward the restoration of theold alignment gave a blurred air to her face.",
        "Embedding": "[11.849964  -2.0032303 23.922438 ]"
    },
    "356": {
        "#": "356",
        "Sentence": "When she moved aboutthere was an incessant clicking as innumerable pottery braceletsjingled up and down upon her arms.",
        "Embedding": "[  5.3629475 -12.67268    27.65472  ]"
    },
    "357": {
        "#": "357",
        "Sentence": "She came in with such a proprietaryhaste, and looked around so possessively at the furniture that Iwondered if she lived here.",
        "Embedding": "[  5.074084 -12.333837  22.159773]"
    },
    "358": {
        "#": "358",
        "Sentence": "But when I asked her she laughedimmoderately, repeated my question aloud, and told me she lived with agirl friend at a hotel.",
        "Embedding": "[12.260371  12.5175905 -5.368949 ]"
    },
    "359": {
        "#": "359",
        "Sentence": "Mr. McKee was a pale, feminine man from the flat below.",
        "Embedding": "[  9.329187 -25.646626 -33.11198 ]"
    },
    "360": {
        "#": "360",
        "Sentence": "He had justshaved, for there was a white spot of lather on his cheekbone, and hewas most respectful in his greeting to everyone in the room.",
        "Embedding": "[17.677727  13.011513  -2.0243487]"
    },
    "361": {
        "#": "361",
        "Sentence": "Heinformed me that he was in the \u201cartistic game,\u201d and I gathered laterthat he was a photographer and had made the dim enlargement ofMrs. Wilson\u2019s mother which hovered like an ectoplasm on the wall.",
        "Embedding": "[10.259542 18.586058  4.192111]"
    },
    "362": {
        "#": "362",
        "Sentence": "Hiswife was shrill, languid, handsome, and horrible.",
        "Embedding": "[  8.633011 -27.682362 -27.082956]"
    },
    "363": {
        "#": "363",
        "Sentence": "She told me withpride that her husband had photographed her a hundred and twenty-seventimes since they had been married.",
        "Embedding": "[-14.943453   -5.0891886  30.97168  ]"
    },
    "364": {
        "#": "364",
        "Sentence": "Mrs. Wilson had changed her costume some time before, and was nowattired in an elaborate afternoon dress of cream-coloured chiffon,which gave out a continual rustle as she swept about the room.",
        "Embedding": "[11.1177025 13.0540085 22.129417 ]"
    },
    "365": {
        "#": "365",
        "Sentence": "Withthe influence of the dress her personality had also undergone achange.",
        "Embedding": "[-9.382182 -7.159276 41.387714]"
    },
    "366": {
        "#": "366",
        "Sentence": "The intense vitality that had been so remarkable in the garagewas converted into impressive hauteur.",
        "Embedding": "[ 9.36293    1.1952466 16.135672 ]"
    },
    "367": {
        "#": "367",
        "Sentence": "Her laughter, her gestures, herassertions became more violently affected moment by moment, and as sheexpanded the room grew smaller around her, until she seemed to berevolving on a noisy, creaking pivot through the smoky air.",
        "Embedding": "[10.479883  -7.1494064 25.045805 ]"
    },
    "368": {
        "#": "368",
        "Sentence": "\u201cMy dear,\u201d she told her sister in a high, mincing shout, \u201cmost ofthese fellas will cheat you every time.",
        "Embedding": "[-17.428806  11.248222   7.278114]"
    },
    "369": {
        "#": "369",
        "Sentence": "All they think of is money.",
        "Embedding": "[-25.20222   11.11139  -17.302912]"
    },
    "370": {
        "#": "370",
        "Sentence": "Ihad a woman up here last week to look at my feet, and when she gave methe bill you\u2019d of thought she had my appendicitis out.\u201d\u201cWhat was the name of the woman?\u201d asked Mrs. McKee.",
        "Embedding": "[-7.3576674  6.637542  -0.7101088]"
    },
    "371": {
        "#": "371",
        "Sentence": "\u201cMrs.",
        "Embedding": "[-42.674152 -16.58443  -19.86387 ]"
    },
    "372": {
        "#": "372",
        "Sentence": "Eberhardt.",
        "Embedding": "[-49.812576 -11.992743 -20.753542]"
    },
    "373": {
        "#": "373",
        "Sentence": "She goes around looking at people\u2019s feet in their ownhomes.\u201d\u201cI like your dress,\u201d remarked Mrs. McKee, \u201cI think it\u2019s adorable.\u201dMrs. Wilson rejected the compliment by raising her eyebrow in disdain.",
        "Embedding": "[-8.057215 14.662753 16.443989]"
    },
    "374": {
        "#": "374",
        "Sentence": "\u201cIt\u2019s just a crazy old thing,\u201d she said.",
        "Embedding": "[-29.904596 -18.308867   3.001377]"
    },
    "375": {
        "#": "375",
        "Sentence": "\u201cI just slip it on sometimeswhen I don\u2019t care what I look like.\u201d\u201cBut it looks wonderful on you, if you know what I mean,\u201d pursued Mrs.McKee.",
        "Embedding": "[-12.03938    1.994591  -9.184775]"
    },
    "376": {
        "#": "376",
        "Sentence": "\u201cIf Chester could only get you in that pose I think he couldmake something of it.\u201dWe all looked in silence at Mrs. Wilson, who removed a strand of hairfrom over her eyes and looked back at us with a brilliant smile.",
        "Embedding": "[ 0.24767162 14.171264    6.872855  ]"
    },
    "377": {
        "#": "377",
        "Sentence": "Mr.McKee regarded her intently with his head on one side, and then movedhis hand back and forth slowly in front of his face.",
        "Embedding": "[ 19.5115   -13.643296  24.084595]"
    },
    "378": {
        "#": "378",
        "Sentence": "\u201cI should change the light,\u201d he said after a moment.",
        "Embedding": "[ -4.5134935 -36.300568  -14.1033125]"
    },
    "379": {
        "#": "379",
        "Sentence": "\u201cI\u2019d like tobring out the modelling of the features.",
        "Embedding": "[-40.822956    7.8922215   2.093539 ]"
    },
    "380": {
        "#": "380",
        "Sentence": "And I\u2019d try to get hold ofall the back hair.\u201d\u201cI wouldn\u2019t think of changing the light,\u201d cried Mrs. McKee.",
        "Embedding": "[-2.7864408 -8.447592  10.914964 ]"
    },
    "381": {
        "#": "381",
        "Sentence": "\u201cI thinkit\u2019s\u2014\u201dHer husband said \u201cSh!\u201d and we all looked at the subject again,whereupon Tom Buchanan yawned audibly and got to his feet.",
        "Embedding": "[2.901766  9.897955  1.5993336]"
    },
    "382": {
        "#": "382",
        "Sentence": "\u201cYou McKees have something to drink,\u201d he said.",
        "Embedding": "[-13.65955  -18.956116  -7.075257]"
    },
    "383": {
        "#": "383",
        "Sentence": "\u201cGet some more ice andmineral water, Myrtle, before everybody goes to sleep.\u201d\u201cI told that boy about the ice.\u201d Myrtle raised her eyebrows in despairat the shiftlessness of the lower orders.",
        "Embedding": "[11.803818  5.055346 11.090668]"
    },
    "384": {
        "#": "384",
        "Sentence": "\u201cThese people!",
        "Embedding": "[-42.650753 -17.051569  -9.07284 ]"
    },
    "385": {
        "#": "385",
        "Sentence": "You have tokeep after them all the time.\u201dShe looked at me and laughed pointlessly.",
        "Embedding": "[  1.5698541 -27.566978   -9.522675 ]"
    },
    "386": {
        "#": "386",
        "Sentence": "Then she flounced over tothe dog, kissed it with ecstasy, and swept into the kitchen, implying that a dozen chefs awaited her orders there.",
        "Embedding": "[22.557842  4.753658 22.49543 ]"
    },
    "387": {
        "#": "387",
        "Sentence": "\u201cI\u2019ve done some nice things out on Long Island,\u201d asserted Mr. McKee.",
        "Embedding": "[  0.09451793  31.69947    -23.030975  ]"
    },
    "388": {
        "#": "388",
        "Sentence": "Tom looked at him blankly.",
        "Embedding": "[-26.96457   22.483555   2.685107]"
    },
    "389": {
        "#": "389",
        "Sentence": "\u201cTwo of them we have framed downstairs.\u201d\u201cTwo what?\u201d demanded Tom.",
        "Embedding": "[-26.718388  15.711021   3.877545]"
    },
    "390": {
        "#": "390",
        "Sentence": "\u201cTwo studies.",
        "Embedding": "[-44.49251   -9.30699  -22.585724]"
    },
    "391": {
        "#": "391",
        "Sentence": "One of them I call Montauk Point\u2014The Gulls, and theother I call Montauk Point\u2014The Sea.\u201dThe sister Catherine sat down beside me on the couch.",
        "Embedding": "[ 13.291528  12.836492 -16.715897]"
    },
    "392": {
        "#": "392",
        "Sentence": "\u201cDo you live down on Long Island, too?\u201d she inquired.",
        "Embedding": "[ -0.5842705  29.692532  -24.683498 ]"
    },
    "393": {
        "#": "393",
        "Sentence": "\u201cI live at West Egg.\u201d\u201cReally?",
        "Embedding": "[  2.1298723  16.774137  -31.682167 ]"
    },
    "394": {
        "#": "394",
        "Sentence": "I was down there at a party about a month ago.",
        "Embedding": "[-22.57401  -13.824839 -28.991804]"
    },
    "395": {
        "#": "395",
        "Sentence": "At a man namedGatsby\u2019s.",
        "Embedding": "[-37.318462 -15.169302 -25.932152]"
    },
    "396": {
        "#": "396",
        "Sentence": "Do you know him?\u201d\u201cI live next door to him.\u201d\u201cWell, they say he\u2019s a nephew or a cousin of Kaiser Wilhelm\u2019s.",
        "Embedding": "[-36.78958   13.648132  11.010888]"
    },
    "397": {
        "#": "397",
        "Sentence": "That\u2019swhere all his money comes from.\u201d\u201cReally?\u201dShe nodded.",
        "Embedding": "[-12.355988  -36.4927      4.5974336]"
    },
    "398": {
        "#": "398",
        "Sentence": "\u201cI\u2019m scared of him.",
        "Embedding": "[-36.32906    -7.3219275  -0.1710278]"
    },
    "399": {
        "#": "399",
        "Sentence": "I\u2019d hate to have him get anything on me.\u201dThis absorbing information about my neighbour was interrupted by Mrs.McKee\u2019s pointing suddenly at Catherine:\u201cChester, I think you could do something with her,\u201d she broke out, butMr. McKee only nodded in a bored way, and turned his attention to Tom.",
        "Embedding": "[ 3.3394234 14.410005   4.300165 ]"
    },
    "400": {
        "#": "400",
        "Sentence": "\u201cI\u2019d like to do more work on Long Island, if I could get the entry.",
        "Embedding": "[  0.7593782  32.512177  -20.740667 ]"
    },
    "401": {
        "#": "401",
        "Sentence": "All I ask is that they should give me a start.\u201d\u201cAsk Myrtle,\u201d said Tom, breaking into a short shout of laughter asMrs. Wilson entered with a tray.",
        "Embedding": "[-12.87077   22.81774   10.191663]"
    },
    "402": {
        "#": "402",
        "Sentence": "\u201cShe\u2019ll give you a letter ofintroduction, won\u2019t you, Myrtle?\u201d\u201cDo what?\u201d she asked, startled.",
        "Embedding": "[-21.176624  -8.251045  10.662917]"
    },
    "403": {
        "#": "403",
        "Sentence": "\u201cYou\u2019ll give McKee a letter of introduction to your husband, so he cando some studies of him.\u201d His lips moved silently for a moment as heinvented, \u201c\u200a\u2018George B. Wilson at the Gasoline Pump,\u2019 or something likethat.\u201dCatherine leaned close to me and whispered in my ear:\u201cNeither of them can stand the person they\u2019re married to.\u201d\u201cCan\u2019t they?\u201d\u201cCan\u2019t stand them.\u201d She looked at Myrtle and then at Tom.",
        "Embedding": "[ 0.51246554 16.35891    10.254548  ]"
    },
    "404": {
        "#": "404",
        "Sentence": "\u201cWhat I sayis, why go on living with them if they can\u2019t stand them?",
        "Embedding": "[-29.635557  10.575949 -15.547533]"
    },
    "405": {
        "#": "405",
        "Sentence": "If I was themI\u2019d get a divorce and get married to each other right away.\u201d\u201cDoesn\u2019t she like Wilson either?\u201dThe answer to this was unexpected.",
        "Embedding": "[-9.551767 13.764333  9.04562 ]"
    },
    "406": {
        "#": "406",
        "Sentence": "It came from Myrtle, who hadoverheard the question, and it was violent and obscene.",
        "Embedding": "[-27.184744   4.760926  28.668726]"
    },
    "407": {
        "#": "407",
        "Sentence": "\u201cYou see,\u201d cried Catherine triumphantly.",
        "Embedding": "[-32.162834   4.474992  21.288918]"
    },
    "408": {
        "#": "408",
        "Sentence": "She lowered her voice again.",
        "Embedding": "[-28.086477 -20.87048   17.925694]"
    },
    "409": {
        "#": "409",
        "Sentence": "\u201cIt\u2019s really his wife that\u2019s keeping them apart.",
        "Embedding": "[-19.714184  -8.172121  34.495365]"
    },
    "410": {
        "#": "410",
        "Sentence": "She\u2019s a Catholic, andthey don\u2019t believe in divorce.\u201dDaisy was not a Catholic, and I was a little shocked at theelaborateness of the lie.",
        "Embedding": "[-8.710121  -3.7129636  8.567791 ]"
    },
    "411": {
        "#": "411",
        "Sentence": "\u201cWhen they do get married,\u201d continued Catherine, \u201cthey\u2019re going Westto live for a while until it blows over.\u201d\u201cIt\u2019d be more discreet to go to Europe.\u201d\u201cOh, do you like Europe?\u201d she exclaimed surprisingly.",
        "Embedding": "[-14.051874  10.373862   9.079388]"
    },
    "412": {
        "#": "412",
        "Sentence": "\u201cI just got backfrom Monte Carlo.\u201d\u201cReally.\u201d\u201cJust last year.",
        "Embedding": "[  0.26658952  -4.617822   -33.31391   ]"
    },
    "413": {
        "#": "413",
        "Sentence": "I went over there with another girl.\u201d\u201cStay long?\u201d\u201cNo, we just went to Monte Carlo and back.",
        "Embedding": "[  1.2549658  -4.401317  -35.30088  ]"
    },
    "414": {
        "#": "414",
        "Sentence": "We went by way ofMarseilles.",
        "Embedding": "[-32.446007 -32.278397 -10.201451]"
    },
    "415": {
        "#": "415",
        "Sentence": "We had over twelve hundred dollars when we started, but wegot gyped out of it all in two days in the private rooms.",
        "Embedding": "[ 24.904734   4.508604 -21.632036]"
    },
    "416": {
        "#": "416",
        "Sentence": "We had an awful time getting back, I can tell you.",
        "Embedding": "[-26.171041 -17.072477 -18.35615 ]"
    },
    "417": {
        "#": "417",
        "Sentence": "God, how I hated that town!\u201dThe late afternoon sky bloomed in the window for a moment like theblue honey of the Mediterranean\u2014then the shrill voice of Mrs. McKeecalled me back into the room.",
        "Embedding": "[  7.0913925  12.20483   -12.552532 ]"
    },
    "418": {
        "#": "418",
        "Sentence": "\u201cI almost made a mistake, too,\u201d she declared vigorously.",
        "Embedding": "[-14.434548   -7.9286566   3.0987005]"
    },
    "419": {
        "#": "419",
        "Sentence": "\u201cI almostmarried a little kike who\u2019d been after me for years.",
        "Embedding": "[  3.0535386  -9.23135   -26.494062 ]"
    },
    "420": {
        "#": "420",
        "Sentence": "I knew he wasbelow me.",
        "Embedding": "[-31.914331   -9.486998   -1.6073942]"
    },
    "421": {
        "#": "421",
        "Sentence": "Everybody kept saying to me: \u2018Lucille, that man\u2019s way belowyou!\u2019 But if I hadn\u2019t met Chester, he\u2019d of got me sure.\u201d\u201cYes, but listen,\u201d said Myrtle Wilson, nodding her head up and down,\u201cat least you didn\u2019t marry him.\u201d\u201cI know I didn\u2019t.\u201d\u201cWell, I married him,\u201d said Myrtle, ambiguously.",
        "Embedding": "[-1.1734445 16.37394    7.1245613]"
    },
    "422": {
        "#": "422",
        "Sentence": "\u201cAnd that\u2019s thedifference between your case and mine.\u201d\u201cWhy did you, Myrtle?\u201d demanded Catherine.",
        "Embedding": "[-31.692566   7.568199  21.44814 ]"
    },
    "423": {
        "#": "423",
        "Sentence": "\u201cNobody forced you to.\u201dMyrtle considered.",
        "Embedding": "[-21.010675   -3.2336924 -27.173506 ]"
    },
    "424": {
        "#": "424",
        "Sentence": "\u201cI married him because I thought he was a gentleman,\u201d she saidfinally.",
        "Embedding": "[-18.15622    -6.1814947  26.017025 ]"
    },
    "425": {
        "#": "425",
        "Sentence": "\u201cI thought he knew something about breeding, but he wasn\u2019tfit to lick my shoe.\u201d\u201cYou were crazy about him for a while,\u201d said Catherine.",
        "Embedding": "[  1.9684218 -24.74798    10.331169 ]"
    },
    "426": {
        "#": "426",
        "Sentence": "\u201cCrazy about him!\u201d cried Myrtle incredulously.",
        "Embedding": "[-26.839718   4.545185  25.366236]"
    },
    "427": {
        "#": "427",
        "Sentence": "\u201cWho said I was crazyabout him?",
        "Embedding": "[-22.521267 -10.598043  -7.517651]"
    },
    "428": {
        "#": "428",
        "Sentence": "I never was any more crazy about him than I was about thatman there.\u201dShe pointed suddenly at me, and everyone looked at me accusingly.",
        "Embedding": "[  0.97228515 -19.299494    -7.1714463 ]"
    },
    "429": {
        "#": "429",
        "Sentence": "Itried to show by my expression that I expected no affection.",
        "Embedding": "[ 10.470153 -18.512133 -21.804667]"
    },
    "430": {
        "#": "430",
        "Sentence": "\u201cThe only crazy I was was when I married him.",
        "Embedding": "[-17.77235   -8.149615  26.519772]"
    },
    "431": {
        "#": "431",
        "Sentence": "I knew right away I madea mistake.",
        "Embedding": "[-13.907529    -8.808977     0.98735803]"
    },
    "432": {
        "#": "432",
        "Sentence": "He borrowed somebody\u2019s best suit to get married in, andnever even told me about it, and the man came after it one day when hewas out: \u2018Oh, is that your suit?\u2019 I said.",
        "Embedding": "[ 8.515125  -5.6857643 -2.2889447]"
    },
    "433": {
        "#": "433",
        "Sentence": "\u2018This is the first I everheard about it.\u2019 But I gave it to him and then I lay down and cried tobeat the band all afternoon.\u201d\u201cShe really ought to get away from him,\u201d resumed Catherine to me.",
        "Embedding": "[  3.843769  -10.519071    1.0699741]"
    },
    "434": {
        "#": "434",
        "Sentence": "\u201cThey\u2019ve been living over that garage for eleven years.",
        "Embedding": "[-20.56562    -3.3903828  35.96564  ]"
    },
    "435": {
        "#": "435",
        "Sentence": "And Tom\u2019s thefirst sweetie she ever had.\u201dThe bottle of whisky\u2014a second one\u2014was now in constant demand by allpresent, excepting Catherine, who \u201cfelt just as good on nothing atall.\u201d Tom rang for the janitor and sent him for some celebratedsandwiches, which were a complete supper in themselves.",
        "Embedding": "[11.597296 18.58206  17.620682]"
    },
    "436": {
        "#": "436",
        "Sentence": "I wanted toget out and walk eastward toward the park through the soft twilight,but each time I tried to go I became entangled in some wild, stridentargument which pulled me back, as if with ropes, into my chair.",
        "Embedding": "[ 26.1169    11.135841 -13.292644]"
    },
    "437": {
        "#": "437",
        "Sentence": "Yethigh over the city our line of yellow windows must have contributedtheir share of human secrecy to the casual watcher in the darkeningstreets, and I saw him too, looking up and wondering.",
        "Embedding": "[34.18872    2.7306492 -9.8556   ]"
    },
    "438": {
        "#": "438",
        "Sentence": "I was within andwithout, simultaneously enchanted and repelled by the inexhaustiblevariety of life.",
        "Embedding": "[  3.814915  -21.656239    3.8348808]"
    },
    "439": {
        "#": "439",
        "Sentence": "Myrtle pulled her chair close to mine, and suddenly her warm breathpoured over me the story of her first meeting with Tom.",
        "Embedding": "[ 7.4367313 15.232539  18.383928 ]"
    },
    "440": {
        "#": "440",
        "Sentence": "\u201cIt was on the two little seats facing each other that are always thelast ones left on the train.",
        "Embedding": "[29.121513    0.28440857 33.061543  ]"
    },
    "441": {
        "#": "441",
        "Sentence": "I was going up to New York to see mysister and spend the night.",
        "Embedding": "[ 16.714346   -7.9407897 -16.774876 ]"
    },
    "442": {
        "#": "442",
        "Sentence": "He had on a dress suit and patent leathershoes, and I couldn\u2019t keep my eyes off him, but every time he lookedat me I had to pretend to be looking at the advertisement over hishead.",
        "Embedding": "[ 6.3780355 -4.695917  -1.4325314]"
    },
    "443": {
        "#": "443",
        "Sentence": "When we came into the station he was next to me, and his whiteshirtfront pressed against my arm, and so I told him I\u2019d have to calla policeman, but he knew I lied.",
        "Embedding": "[ 10.302521   -6.4945445 -13.855606 ]"
    },
    "444": {
        "#": "444",
        "Sentence": "I was so excited that when I got intoa taxi with him I didn\u2019t hardly know I wasn\u2019t getting into a subwaytrain.",
        "Embedding": "[  6.491401   -1.5017701 -15.767815 ]"
    },
    "445": {
        "#": "445",
        "Sentence": "All I kept thinking about, over and over, was \u2018You can\u2019t liveforever; you can\u2019t live forever.\u2019\u200a\u201dShe turned to Mrs. McKee and the room rang full of her artificiallaughter.",
        "Embedding": "[-10.8287525   1.3544838  10.086197 ]"
    },
    "446": {
        "#": "446",
        "Sentence": "\u201cMy dear,\u201d she cried, \u201cI\u2019m going to give you this dress as soon as I\u2019mthrough with it.",
        "Embedding": "[-26.331343   -4.6545777  23.823565 ]"
    },
    "447": {
        "#": "447",
        "Sentence": "I\u2019ve got to get another one tomorrow.",
        "Embedding": "[ -3.659524  -7.127929 -29.94783 ]"
    },
    "448": {
        "#": "448",
        "Sentence": "I\u2019m going tomake a list of all the things I\u2019ve got to get.",
        "Embedding": "[-34.391056    7.217219   -2.2998037]"
    },
    "449": {
        "#": "449",
        "Sentence": "A massage and a wave,and a collar for the dog, and one of those cute little ashtrays whereyou touch a spring, and a wreath with a black silk bow for mother\u2019sgrave that\u2019ll last all summer.",
        "Embedding": "[22.574162 25.552885 11.174162]"
    },
    "450": {
        "#": "450",
        "Sentence": "I got to write down a list so I won\u2019tforget all the things I got to do.\u201dIt was nine o\u2019clock\u2014almost immediately afterward I looked at my watchand found it was ten.",
        "Embedding": "[-32.172554    7.829559   -2.2296627]"
    },
    "451": {
        "#": "451",
        "Sentence": "Mr. McKee was asleep on a chair with his fistsclenched in his lap, like a photograph of a man of action.",
        "Embedding": "[45.29445  13.846003 -9.740587]"
    },
    "452": {
        "#": "452",
        "Sentence": "Taking outmy handkerchief I wiped from his cheek the spot of dried lather thathad worried me all the afternoon.",
        "Embedding": "[15.157133  -1.4212223 13.061144 ]"
    },
    "453": {
        "#": "453",
        "Sentence": "The little dog was sitting on the table looking with blind eyesthrough the smoke, and from time to time groaning faintly.",
        "Embedding": "[27.592407   1.9343851 17.976753 ]"
    },
    "454": {
        "#": "454",
        "Sentence": "Peopledisappeared, reappeared, made plans to go somewhere, and then losteach other, searched for each other, found each other a few feetaway.",
        "Embedding": "[34.420734  -2.0721066 32.21479  ]"
    },
    "455": {
        "#": "455",
        "Sentence": "Some time toward midnight Tom Buchanan and Mrs. Wilson stoodface to face discussing, in impassioned voices, whether Mrs. Wilsonhad any right to mention Daisy\u2019s name.",
        "Embedding": "[ 3.9908524 19.848982  15.769571 ]"
    },
    "456": {
        "#": "456",
        "Sentence": "\u201cDaisy!",
        "Embedding": "[-17.236902  18.121164  26.896027]"
    },
    "457": {
        "#": "457",
        "Sentence": "Daisy!",
        "Embedding": "[-17.271553  16.769001  28.878578]"
    },
    "458": {
        "#": "458",
        "Sentence": "Daisy!\u201d shouted Mrs. Wilson.",
        "Embedding": "[-13.929296  22.731627  21.147703]"
    },
    "459": {
        "#": "459",
        "Sentence": "\u201cI\u2019ll say it whenever Iwant to!",
        "Embedding": "[-35.88602    -0.2285966   2.8760889]"
    },
    "460": {
        "#": "460",
        "Sentence": "Daisy!",
        "Embedding": "[-17.236902  18.121164  26.896027]"
    },
    "461": {
        "#": "461",
        "Sentence": "Dai\u2014\u201dMaking a short deft movement, Tom Buchanan broke her nose with hisopen hand.",
        "Embedding": "[12.466484 25.410662 11.032552]"
    },
    "462": {
        "#": "462",
        "Sentence": "Then there were bloody towels upon the bathroom floor, and women\u2019svoices scolding, and high over the confusion a long broken wail ofpain.",
        "Embedding": "[26.573679 10.201902 18.42908 ]"
    },
    "463": {
        "#": "463",
        "Sentence": "Mr. McKee awoke from his doze and started in a daze toward thedoor.",
        "Embedding": "[ 19.43838  -25.750147  13.129893]"
    },
    "464": {
        "#": "464",
        "Sentence": "When he had gone halfway he turned around and stared at thescene\u2014his wife and Catherine scolding and consoling as they stumbledhere and there among the crowded furniture with articles of aid, andthe despairing figure on the couch, bleeding fluently, and trying tospread a copy of Town Tattle over the tapestry scenes ofVersailles.",
        "Embedding": "[23.067413 12.23175  20.564438]"
    },
    "465": {
        "#": "465",
        "Sentence": "Then Mr. McKee turned and continued on out the door.",
        "Embedding": "[  2.4557092  -37.374405     0.48491573]"
    },
    "466": {
        "#": "466",
        "Sentence": "Taking my hat from the chandelier, I followed.",
        "Embedding": "[  6.6930094 -14.633188  -30.2302   ]"
    },
    "467": {
        "#": "467",
        "Sentence": "\u201cCome to lunch some day,\u201d he suggested, as we groaned down in theelevator.",
        "Embedding": "[ -2.9830244 -39.923702  -10.620241 ]"
    },
    "468": {
        "#": "468",
        "Sentence": "\u201cWhere?\u201d\u201cAnywhere.\u201d\u201cKeep your hands off the lever,\u201d snapped the elevator boy.",
        "Embedding": "[ -2.4214056 -27.111956   34.201183 ]"
    },
    "469": {
        "#": "469",
        "Sentence": "\u201cI beg your pardon,\u201d said Mr. McKee with dignity, \u201cI didn\u2019t know I wastouching it.\u201d\u201cAll right,\u201d I agreed, \u201cI\u2019ll be glad to.\u201d\u2026 I was standing beside his bed and he was sitting up between thesheets, clad in his underwear, with a great portfolio in his hands.",
        "Embedding": "[ 8.171768  -1.1783181  1.1035091]"
    },
    "470": {
        "#": "470",
        "Sentence": "\u201cBeauty and the Beast \u2026 Loneliness \u2026 Old Grocery Horse \u2026 Brook\u2019nBridge \u2026\u201dThen I was lying half asleep in the cold lower level of thePennsylvania Station, staring at the morning Tribune, and waiting forthe four o\u2019clock train.",
        "Embedding": "[29.325216  21.470057   1.5233438]"
    },
    "471": {
        "#": "471",
        "Sentence": "IIIThere was music from my neighbour\u2019s house through the summer nights.",
        "Embedding": "[ -2.7315357  41.6494    -16.657457 ]"
    },
    "472": {
        "#": "472",
        "Sentence": "In his blue gardens men and girls came and went like moths among thewhisperings and the champagne and the stars.",
        "Embedding": "[31.489277 14.341117 20.344402]"
    },
    "473": {
        "#": "473",
        "Sentence": "At high tide in theafternoon I watched his guests diving from the tower of his raft, ortaking the sun on the hot sand of his beach while his two motorboatsslit the waters of the Sound, drawing aquaplanes over cataracts offoam.",
        "Embedding": "[26.313295 30.081514  8.738437]"
    },
    "474": {
        "#": "474",
        "Sentence": "On weekends his Rolls-Royce became an omnibus, bearing partiesto and from the city between nine in the morning and long pastmidnight, while his station wagon scampered like a brisk yellow bug tomeet all trains.",
        "Embedding": "[32.759697  24.879372   5.9952164]"
    },
    "475": {
        "#": "475",
        "Sentence": "And on Mondays eight servants, including an extragardener, toiled all day with mops and scrubbing-brushes and hammersand garden-shears, repairing the ravages of the night before.",
        "Embedding": "[33.561253 27.657017  4.586311]"
    },
    "476": {
        "#": "476",
        "Sentence": "Every Friday five crates of oranges and lemons arrived from afruiterer in New York\u2014every Monday these same oranges and lemons lefthis back door in a pyramid of pulpless halves.",
        "Embedding": "[41.148457 20.560804 -2.572275]"
    },
    "477": {
        "#": "477",
        "Sentence": "There was a machine inthe kitchen which could extract the juice of two hundred oranges inhalf an hour if a little button was pressed two hundred times by abutler\u2019s thumb.",
        "Embedding": "[45.157883  22.269455  -2.2018526]"
    },
    "478": {
        "#": "478",
        "Sentence": "At least once a fortnight a corps of caterers came down with severalhundred feet of canvas and enough coloured lights to make a Christmastree of Gatsby\u2019s enormous garden.",
        "Embedding": "[29.742538 14.277627  8.21727 ]"
    },
    "479": {
        "#": "479",
        "Sentence": "On buffet tables, garnished withglistening hors-d\u2019oeuvre, spiced baked hams crowded against salads ofharlequin designs and pastry pigs and turkeys bewitched to a darkgold.",
        "Embedding": "[40.91831  24.019028  4.120813]"
    },
    "480": {
        "#": "480",
        "Sentence": "In the main hall a bar with a real brass rail was set up, andstocked with gins and liquors and with cordials so long forgotten thatmost of his female guests were too young to know one from another.",
        "Embedding": "[32.706406  9.125526 25.986074]"
    },
    "481": {
        "#": "481",
        "Sentence": "By seven o\u2019clock the orchestra has arrived, no thin five-piece affair,but a whole pitful of oboes and trombones and saxophones and viols andcornets and piccolos, and low and high drums.",
        "Embedding": "[28.601862 19.296297 19.584139]"
    },
    "482": {
        "#": "482",
        "Sentence": "The last swimmers havecome in from the beach now and are dressing upstairs; the cars fromNew York are parked five deep in the drive, and already the halls andsalons and verandas are gaudy with primary colours, and hair bobbed instrange new ways, and shawls beyond the dreams of Castile.",
        "Embedding": "[31.413322 19.64871  11.316956]"
    },
    "483": {
        "#": "483",
        "Sentence": "The bar isin full swing, and floating rounds of cocktails permeate the gardenoutside, until the air is alive with chatter and laughter, and casualinnuendo and introductions forgotten on the spot, and enthusiasticmeetings between women who never knew each other\u2019s names.",
        "Embedding": "[34.812836   8.0914955 24.698198 ]"
    },
    "484": {
        "#": "484",
        "Sentence": "The lights grow brighter as the earth lurches away from the sun, andnow the orchestra is playing yellow cocktail music, and the opera ofvoices pitches a key higher.",
        "Embedding": "[20.846487 25.722956 23.67977 ]"
    },
    "485": {
        "#": "485",
        "Sentence": "Laughter is easier minute by minute,spilled with prodigality, tipped out at a cheerful word.",
        "Embedding": "[ 7.8267593  3.485658  38.26748  ]"
    },
    "486": {
        "#": "486",
        "Sentence": "The groupschange more swiftly, swell with new arrivals, dissolve and form in the same breath; already there are wanderers, confident girls who weavehere and there among the stouter and more stable, become for a sharp,joyous moment the centre of a group, and then, excited with triumph,glide on through the sea-change of faces and voices and colour underthe constantly changing light.",
        "Embedding": "[35.853977  5.193296 23.969992]"
    },
    "487": {
        "#": "487",
        "Sentence": "Suddenly one of these gypsies, in trembling opal, seizes a cocktailout of the air, dumps it down for courage and, moving her hands likeFrisco, dances out alone on the canvas platform.",
        "Embedding": "[33.743908 -9.261122 13.422347]"
    },
    "488": {
        "#": "488",
        "Sentence": "A momentary hush; theorchestra leader varies his rhythm obligingly for her, and there is aburst of chatter as the erroneous news goes around that she is GildaGray\u2019s understudy from the Follies.",
        "Embedding": "[ 5.0094814  5.056268  13.619883 ]"
    },
    "489": {
        "#": "489",
        "Sentence": "The party has begun.",
        "Embedding": "[-23.448454 -13.67699  -34.65534 ]"
    },
    "490": {
        "#": "490",
        "Sentence": "I believe that on the first night I went to Gatsby\u2019s house I was oneof the few guests who had actually been invited.",
        "Embedding": "[-6.8915887e-03  2.4055896e+00 -2.2507307e+01]"
    },
    "491": {
        "#": "491",
        "Sentence": "People were notinvited\u2014they went there.",
        "Embedding": "[-31.129688 -30.612864 -16.592644]"
    },
    "492": {
        "#": "492",
        "Sentence": "They got into automobiles which bore them outto Long Island, and somehow they ended up at Gatsby\u2019s door.",
        "Embedding": "[  3.1949704  27.316     -17.805058 ]"
    },
    "493": {
        "#": "493",
        "Sentence": "Once therethey were introduced by somebody who knew Gatsby, and after that theyconducted themselves according to the rules of behaviour associatedwith an amusement park.",
        "Embedding": "[ 9.761581 30.447338  2.237867]"
    },
    "494": {
        "#": "494",
        "Sentence": "Sometimes they came and went without havingmet Gatsby at all, came for the party with a simplicity of heart thatwas its own ticket of admission.",
        "Embedding": "[ 2.55153  42.467957 14.098557]"
    },
    "495": {
        "#": "495",
        "Sentence": "I had been actually invited.",
        "Embedding": "[-17.66448   -9.337643 -32.428432]"
    },
    "496": {
        "#": "496",
        "Sentence": "A chauffeur in a uniform of robin\u2019s-eggblue crossed my lawn early that Saturday morning with a surprisinglyformal note from his employer: the honour would be entirely Gatsby\u2019s,it said, if I would attend his \u201clittle party\u201d that night.",
        "Embedding": "[  0.41930202  -1.8453623  -16.147543  ]"
    },
    "497": {
        "#": "497",
        "Sentence": "He had seenme several times, and had intended to call on me long before, but apeculiar combination of circumstances had prevented it\u2014signed JayGatsby, in a majestic hand.",
        "Embedding": "[ 16.238548  -20.83912     4.3880124]"
    },
    "498": {
        "#": "498",
        "Sentence": "Dressed up in white flannels I went over to his lawn a little afterseven, and wandered around rather ill at ease among swirls and eddiesof people I didn\u2019t know\u2014though here and there was a face I had noticedon the commuting train.",
        "Embedding": "[7.4309707 2.8376317 3.9509249]"
    },
    "499": {
        "#": "499",
        "Sentence": "I was immediately struck by the number ofyoung Englishmen dotted about; all well dressed, all looking a littlehungry, and all talking in low, earnest voices to solid and prosperousAmericans.",
        "Embedding": "[36.81875   -1.0909137 23.848814 ]"
    },
    "500": {
        "#": "500",
        "Sentence": "I was sure that they were selling something: bonds orinsurance or automobiles.",
        "Embedding": "[ 15.788662 -14.703121 -33.201576]"
    },
    "501": {
        "#": "501",
        "Sentence": "They were at least agonizingly aware of theeasy money in the vicinity and convinced that it was theirs for a fewwords in the right key.",
        "Embedding": "[ 29.527988 -12.277664 -22.34809 ]"
    },
    "502": {
        "#": "502",
        "Sentence": "As soon as I arrived I made an attempt to find my host, but the two orthree people of whom I asked his whereabouts stared at me in such an amazed way, and denied so vehemently any knowledge of his movements,that I slunk off in the direction of the cocktail table\u2014the only placein the garden where a single man could linger without lookingpurposeless and alone.",
        "Embedding": "[13.858673   5.3072762 -7.2928276]"
    },
    "503": {
        "#": "503",
        "Sentence": "I was on my way to get roaring drunk from sheer embarrassment whenJordan Baker came out of the house and stood at the head of the marblesteps, leaning a little backward and looking with contemptuousinterest down into the garden.",
        "Embedding": "[ 14.412218   8.533761 -11.078658]"
    },
    "504": {
        "#": "504",
        "Sentence": "Welcome or not, I found it necessary to attach myself to someonebefore I should begin to address cordial remarks to the passersby.",
        "Embedding": "[17.497955   6.3072762 -5.9555264]"
    },
    "505": {
        "#": "505",
        "Sentence": "\u201cHello!\u201d I roared, advancing toward her.",
        "Embedding": "[-30.470123 -14.245465  13.572374]"
    },
    "506": {
        "#": "506",
        "Sentence": "My voice seemed unnaturallyloud across the garden.",
        "Embedding": "[ 17.367996    5.5551643 -38.4625   ]"
    },
    "507": {
        "#": "507",
        "Sentence": "\u201cI thought you might be here,\u201d she responded absently as I came up.",
        "Embedding": "[-23.062424   -3.2506886   7.716545 ]"
    },
    "508": {
        "#": "508",
        "Sentence": "\u201cI remembered you lived next door to\u2014\u201dShe held my hand impersonally, as a promise that she\u2019d take care of mein a minute, and gave ear to two girls in twin yellow dresses, whostopped at the foot of the steps.",
        "Embedding": "[11.916877 18.031292 30.30201 ]"
    },
    "509": {
        "#": "509",
        "Sentence": "\u201cHello!\u201d they cried together.",
        "Embedding": "[-32.93231     0.6187497  19.67585  ]"
    },
    "510": {
        "#": "510",
        "Sentence": "\u201cSorry you didn\u2019t win.\u201dThat was for the golf tournament.",
        "Embedding": "[-12.432117  22.43033  -31.563124]"
    },
    "511": {
        "#": "511",
        "Sentence": "She had lost in the finals the weekbefore.",
        "Embedding": "[-14.791053 -21.621635  30.879412]"
    },
    "512": {
        "#": "512",
        "Sentence": "\u201cYou don\u2019t know who we are,\u201d said one of the girls in yellow, \u201cbut wemet you here about a month ago.\u201d\u201cYou\u2019ve dyed your hair since then,\u201d remarked Jordan, and I started,but the girls had moved casually on and her remark was addressed tothe premature moon, produced like the supper, no doubt, out of acaterer\u2019s basket.",
        "Embedding": "[11.937493 19.883417 28.406082]"
    },
    "513": {
        "#": "513",
        "Sentence": "With Jordan\u2019s slender golden arm resting in mine, wedescended the steps and sauntered about the garden.",
        "Embedding": "[12.966456 30.039099 28.363651]"
    },
    "514": {
        "#": "514",
        "Sentence": "A tray ofcocktails floated at us through the twilight, and we sat down at atable with the two girls in yellow and three men, each one introducedto us as Mr. Mumble.",
        "Embedding": "[19.039421 11.273309 32.249767]"
    },
    "515": {
        "#": "515",
        "Sentence": "\u201cDo you come to these parties often?\u201d inquired Jordan of the girlbeside her.",
        "Embedding": "[-10.544806  14.487233  -9.046392]"
    },
    "516": {
        "#": "516",
        "Sentence": "\u201cThe last one was the one I met you at,\u201d answered the girl, in an alert confident voice.",
        "Embedding": "[-23.143114    2.8353713   8.031304 ]"
    },
    "517": {
        "#": "517",
        "Sentence": "She turned to her companion: \u201cWasn\u2019t it foryou, Lucille?\u201dIt was for Lucille, too.",
        "Embedding": "[ -5.9782443 -10.202946   26.087984 ]"
    },
    "518": {
        "#": "518",
        "Sentence": "\u201cI like to come,\u201d Lucille said.",
        "Embedding": "[-41.43511     17.143332     0.10173253]"
    },
    "519": {
        "#": "519",
        "Sentence": "\u201cI never care what I do, so I alwayshave a good time.",
        "Embedding": "[-11.976131    1.2583551  -6.4216204]"
    },
    "520": {
        "#": "520",
        "Sentence": "When I was here last I tore my gown on a chair, andhe asked me my name and address\u2014inside of a week I got a package fromCroirier\u2019s with a new evening gown in it.\u201d\u201cDid you keep it?\u201d asked Jordan.",
        "Embedding": "[11.058117   -5.897633   -0.85387796]"
    },
    "521": {
        "#": "521",
        "Sentence": "\u201cSure I did.",
        "Embedding": "[-41.674606   -4.9561253  -5.960221 ]"
    },
    "522": {
        "#": "522",
        "Sentence": "I was going to wear it tonight, but it was too big in thebust and had to be altered.",
        "Embedding": "[-27.117664   -6.3331246  25.577024 ]"
    },
    "523": {
        "#": "523",
        "Sentence": "It was gas blue with lavender beads.",
        "Embedding": "[-20.825195 -28.588047 -13.376809]"
    },
    "524": {
        "#": "524",
        "Sentence": "Twohundred and sixty-five dollars.\u201d\u201cThere\u2019s something funny about a fellow that\u2019ll do a thing like that,\u201dsaid the other girl eagerly.",
        "Embedding": "[ 4.2975163  4.234253  35.93875  ]"
    },
    "525": {
        "#": "525",
        "Sentence": "\u201cHe doesn\u2019t want any trouble withanybody.\u201d\u201cWho doesn\u2019t?\u201d I inquired.",
        "Embedding": "[-12.59647   -22.299164    0.3283256]"
    },
    "526": {
        "#": "526",
        "Sentence": "\u201cGatsby.",
        "Embedding": "[-3.7872488 39.912743   1.2177821]"
    },
    "527": {
        "#": "527",
        "Sentence": "Somebody told me\u2014\u201dThe two girls and Jordan leaned together confidentially.",
        "Embedding": "[-9.506696  19.789282  -3.6597612]"
    },
    "528": {
        "#": "528",
        "Sentence": "\u201cSomebody told me they thought he killed a man once.\u201dA thrill passed over all of us.",
        "Embedding": "[ -3.262707 -10.181548 -12.959872]"
    },
    "529": {
        "#": "529",
        "Sentence": "The three Mr. Mumbles bent forward andlistened eagerly.",
        "Embedding": "[ -8.334265 -27.676044 -32.503845]"
    },
    "530": {
        "#": "530",
        "Sentence": "\u201cI don\u2019t think it\u2019s so much that,\u201d argued Lucille sceptically; \u201cIt\u2019smore that he was a German spy during the war.\u201dOne of the men nodded in confirmation.",
        "Embedding": "[ -4.2895546 -13.808782   30.189873 ]"
    },
    "531": {
        "#": "531",
        "Sentence": "\u201cI heard that from a man who knew all about him, grew up with him inGermany,\u201d he assured us positively.",
        "Embedding": "[ -6.760328  -13.133146    2.1401792]"
    },
    "532": {
        "#": "532",
        "Sentence": "\u201cOh, no,\u201d said the first girl, \u201cit couldn\u2019t be that, because he was inthe American army during the war.\u201d As our credulity switched back to her she leaned forward with enthusiasm.",
        "Embedding": "[ -3.4882545 -14.966779   32.34417  ]"
    },
    "533": {
        "#": "533",
        "Sentence": "\u201cYou look at him sometimeswhen he thinks nobody\u2019s looking at him.",
        "Embedding": "[-10.826951  -24.003841   -6.6551785]"
    },
    "534": {
        "#": "534",
        "Sentence": "I\u2019ll bet he killed a man.\u201dShe narrowed her eyes and shivered.",
        "Embedding": "[  5.1956043 -21.5159    -18.228235 ]"
    },
    "535": {
        "#": "535",
        "Sentence": "Lucille shivered.",
        "Embedding": "[-43.128956    17.996675     0.26549113]"
    },
    "536": {
        "#": "536",
        "Sentence": "We all turnedand looked around for Gatsby.",
        "Embedding": "[-8.079254  36.320343   1.5003059]"
    },
    "537": {
        "#": "537",
        "Sentence": "It was testimony to the romanticspeculation he inspired that there were whispers about him from thosewho had found little that it was necessary to whisper about in thisworld.",
        "Embedding": "[  4.590011 -17.943863  12.711468]"
    },
    "538": {
        "#": "538",
        "Sentence": "The first supper\u2014there would be another one after midnight\u2014was nowbeing served, and Jordan invited me to join her own party, who werespread around a table on the other side of the garden.",
        "Embedding": "[ 4.344062 14.484473 25.166481]"
    },
    "539": {
        "#": "539",
        "Sentence": "There werethree married couples and Jordan\u2019s escort, a persistent undergraduategiven to violent innuendo, and obviously under the impression thatsooner or later Jordan was going to yield him up her person to agreater or lesser degree.",
        "Embedding": "[ 2.3735285 13.338593  19.56516  ]"
    },
    "540": {
        "#": "540",
        "Sentence": "Instead of rambling, this party hadpreserved a dignified homogeneity, and assumed to itself the functionof representing the staid nobility of the countryside\u2014East Eggcondescending to West Egg and carefully on guard against itsspectroscopic gaiety.",
        "Embedding": "[29.49669  35.792633 -7.616094]"
    },
    "541": {
        "#": "541",
        "Sentence": "\u201cLet\u2019s get out,\u201d whispered Jordan, after a somehow wasteful andinappropriate half-hour; \u201cthis is much too polite for me.\u201dWe got up, and she explained that we were going to find the host: Ihad never met him, she said, and it was making me uneasy.",
        "Embedding": "[10.187328   5.4385257 -1.5715929]"
    },
    "542": {
        "#": "542",
        "Sentence": "Theundergraduate nodded in a cynical, melancholy way.",
        "Embedding": "[-13.128886 -11.31198    9.02317 ]"
    },
    "543": {
        "#": "543",
        "Sentence": "The bar, where we glanced first, was crowded, but Gatsby was notthere.",
        "Embedding": "[-1.3320161 46.2473    -0.1523619]"
    },
    "544": {
        "#": "544",
        "Sentence": "She couldn\u2019t find him from the top of the steps, and he wasn\u2019ton the veranda.",
        "Embedding": "[ 19.455515 -16.911694  28.711243]"
    },
    "545": {
        "#": "545",
        "Sentence": "On a chance we tried an important-looking door, andwalked into a high Gothic library, panelled with carved English oak,and probably transported complete from some ruin overseas.",
        "Embedding": "[40.832195  10.370285   2.9504192]"
    },
    "546": {
        "#": "546",
        "Sentence": "A stout, middle-aged man, with enormous owl-eyed spectacles, wassitting somewhat drunk on the edge of a great table, staring withunsteady concentration at the shelves of books.",
        "Embedding": "[43.216698 14.309022 -5.356656]"
    },
    "547": {
        "#": "547",
        "Sentence": "As we entered hewheeled excitedly around and examined Jordan from head to foot.",
        "Embedding": "[-2.6288147  9.02355   -4.257364 ]"
    },
    "548": {
        "#": "548",
        "Sentence": "\u201cWhat do you think?\u201d he demanded impetuously.",
        "Embedding": "[-17.545252  -13.5079975  -7.031477 ]"
    },
    "549": {
        "#": "549",
        "Sentence": "\u201cAbout what?\u201dHe waved his hand toward the bookshelves.",
        "Embedding": "[  2.956946 -39.59004    9.499748]"
    },
    "550": {
        "#": "550",
        "Sentence": "\u201cAbout that.",
        "Embedding": "[-39.654217 -13.693996 -12.099082]"
    },
    "551": {
        "#": "551",
        "Sentence": "As a matter of fact you needn\u2019t bother to ascertain.",
        "Embedding": "[-12.469985    1.4793208 -25.503582 ]"
    },
    "552": {
        "#": "552",
        "Sentence": "Iascertained.",
        "Embedding": "[-49.585346  -9.531991 -19.462217]"
    },
    "553": {
        "#": "553",
        "Sentence": "They\u2019re real.\u201d\u201cThe books?\u201dHe nodded.",
        "Embedding": "[-17.223629 -32.512894 -18.97529 ]"
    },
    "554": {
        "#": "554",
        "Sentence": "\u201cAbsolutely real\u2014have pages and everything.",
        "Embedding": "[-48.436913   -8.172263   -3.1644576]"
    },
    "555": {
        "#": "555",
        "Sentence": "I thought they\u2019d be a nicedurable cardboard.",
        "Embedding": "[-14.206394 -17.362974 -29.88771 ]"
    },
    "556": {
        "#": "556",
        "Sentence": "Matter of fact, they\u2019re absolutely real.",
        "Embedding": "[-46.475014  -13.879196   -5.5026894]"
    },
    "557": {
        "#": "557",
        "Sentence": "Page sand\u2014Here!",
        "Embedding": "[-46.62634  -11.095619 -19.424345]"
    },
    "558": {
        "#": "558",
        "Sentence": "Lemme show you.\u201dTaking our scepticism for granted, he rushed to the bookcases andreturned with Volume One of the Stoddard Lectures.",
        "Embedding": "[21.50003   -5.5951824  4.5986514]"
    },
    "559": {
        "#": "559",
        "Sentence": "\u201cSee!\u201d he cried triumphantly.",
        "Embedding": "[-30.075567    0.8484833  21.644146 ]"
    },
    "560": {
        "#": "560",
        "Sentence": "\u201cIt\u2019s a bona-fide piece of printedmatter.",
        "Embedding": "[-39.500763  -20.3795      3.9305847]"
    },
    "561": {
        "#": "561",
        "Sentence": "It fooled me.",
        "Embedding": "[-31.930477 -11.789403  -9.444368]"
    },
    "562": {
        "#": "562",
        "Sentence": "This fella\u2019s a regular Belasco.",
        "Embedding": "[-37.596638 -22.155596  -3.220934]"
    },
    "563": {
        "#": "563",
        "Sentence": "It\u2019s atriumph.",
        "Embedding": "[-37.132233  -24.327425    2.5980353]"
    },
    "564": {
        "#": "564",
        "Sentence": "What thoroughness!",
        "Embedding": "[-24.4431    -8.3482   -13.602148]"
    },
    "565": {
        "#": "565",
        "Sentence": "What realism!",
        "Embedding": "[-26.2634     -6.9886446 -13.817081 ]"
    },
    "566": {
        "#": "566",
        "Sentence": "Knew when to stop,too\u2014didn\u2019t cut the pages.",
        "Embedding": "[-50.043636   -7.824165   -1.7083514]"
    },
    "567": {
        "#": "567",
        "Sentence": "But what do you want?",
        "Embedding": "[-18.878199  -6.540961 -17.430609]"
    },
    "568": {
        "#": "568",
        "Sentence": "What do you expect?\u201dHe snatched the book from me and replaced it hastily on its shelf,muttering that if one brick was removed the whole library was liableto collapse.",
        "Embedding": "[  1.1684469 -12.3067      4.6111026]"
    },
    "569": {
        "#": "569",
        "Sentence": "\u201cWho brought you?\u201d he demanded.",
        "Embedding": "[-18.480467 -12.664476  -9.933543]"
    },
    "570": {
        "#": "570",
        "Sentence": "\u201cOr did you just come?",
        "Embedding": "[-18.064451  -6.445049 -19.628809]"
    },
    "571": {
        "#": "571",
        "Sentence": "I was brought.",
        "Embedding": "[-33.861298 -14.738603 -17.116468]"
    },
    "572": {
        "#": "572",
        "Sentence": "Most people were brought.\u201dJordan looked at him alertly, cheerfully, without answering.",
        "Embedding": "[-15.426993 -15.550478 -13.784217]"
    },
    "573": {
        "#": "573",
        "Sentence": "\u201cI was brought by a woman named Roosevelt,\u201d he continued.",
        "Embedding": "[-21.045639 -16.479403  32.27822 ]"
    },
    "574": {
        "#": "574",
        "Sentence": "\u201cMrs.",
        "Embedding": "[-43.83713  -17.412367 -18.586273]"
    },
    "575": {
        "#": "575",
        "Sentence": "ClaudRoosevelt.",
        "Embedding": "[-51.51882   -8.535189 -17.73381 ]"
    },
    "576": {
        "#": "576",
        "Sentence": "Do you know her?",
        "Embedding": "[-33.01429   -10.378902    2.8926823]"
    },
    "577": {
        "#": "577",
        "Sentence": "I met her somewhere last night.",
        "Embedding": "[-16.247904 -13.559041  24.735779]"
    },
    "578": {
        "#": "578",
        "Sentence": "I\u2019ve beendrunk for about a week now, and I thought it might sober me up to sitin a library.\u201d\u201cHas it?\u201d\u201cA little bit, I think.",
        "Embedding": "[ -2.9053552  -3.86391   -26.568565 ]"
    },
    "579": {
        "#": "579",
        "Sentence": "I can\u2019t tell yet.",
        "Embedding": "[-33.969837 -14.494298  -2.017117]"
    },
    "580": {
        "#": "580",
        "Sentence": "I\u2019ve only been here an hour.",
        "Embedding": "[-20.188538 -15.533029 -23.94064 ]"
    },
    "581": {
        "#": "581",
        "Sentence": "Did I tell you about the books?",
        "Embedding": "[-30.30448   -5.736933   4.831469]"
    },
    "582": {
        "#": "582",
        "Sentence": "They\u2019re real.",
        "Embedding": "[-45.852264  -15.580812   -6.1450334]"
    },
    "583": {
        "#": "583",
        "Sentence": "They\u2019re\u2014\u201d\u201cYou told us.\u201dWe shook hands with him gravely and went back outdoors.",
        "Embedding": "[22.294483 -8.907203 22.449522]"
    },
    "584": {
        "#": "584",
        "Sentence": "There was dancing now on the canvas in the garden; old men pushingyoung girls backward in eternal graceless circles, superior couplesholding each other tortuously, fashionably, and keeping in thecorners\u2014and a great number of single girls dancing individually orrelieving the orchestra for a moment of the burden of the banjo or thetraps.",
        "Embedding": "[25.172228 21.47655  19.87891 ]"
    },
    "585": {
        "#": "585",
        "Sentence": "By midnight the hilarity had increased.",
        "Embedding": "[ 18.558022 -31.455954 -15.709958]"
    },
    "586": {
        "#": "586",
        "Sentence": "A celebrated tenor hadsung in Italian, and a notorious contralto had sung in jazz, andbetween the numbers people were doing \u201cstunts\u201d all over the garden,while happy, vacuous bursts of laughter rose toward the summer sky.",
        "Embedding": "[21.145063 28.33226  21.027702]"
    },
    "587": {
        "#": "587",
        "Sentence": "Apair of stage twins, who turned out to be the girls in yellow, did ababy act in costume, and champagne was served in glasses bigger thanfinger-bowls.",
        "Embedding": "[12.662752 15.785903 25.196096]"
    },
    "588": {
        "#": "588",
        "Sentence": "The moon had risen higher, and floating in the Sound wasa triangle of silver scales, trembling a little to the stiff, tinnydrip of the banjoes on the lawn.",
        "Embedding": "[40.856586  9.567063 14.9714  ]"
    },
    "589": {
        "#": "589",
        "Sentence": "I was still with Jordan Baker.",
        "Embedding": "[-3.8268752  13.426707    0.17691207]"
    },
    "590": {
        "#": "590",
        "Sentence": "We were sitting at a table with a manof about my age and a rowdy little girl, who gave way upon theslightest provocation to uncontrollable laughter.",
        "Embedding": "[ 8.965381  5.718963 35.864845]"
    },
    "591": {
        "#": "591",
        "Sentence": "I was enjoyingmyself now.",
        "Embedding": "[-32.235268 -16.592505 -15.903368]"
    },
    "592": {
        "#": "592",
        "Sentence": "I had taken two finger-bowls of champagne, and the scene had changed before my eyes into something significant, elemental, andprofound.",
        "Embedding": "[ 28.367369  -24.36904    -4.5127997]"
    },
    "593": {
        "#": "593",
        "Sentence": "At a lull in the entertainment the man looked at me and smiled.",
        "Embedding": "[  5.4563313 -25.942518   -4.912567 ]"
    },
    "594": {
        "#": "594",
        "Sentence": "\u201cYour face is familiar,\u201d he said politely.",
        "Embedding": "[-10.821267 -21.824305  -6.002271]"
    },
    "595": {
        "#": "595",
        "Sentence": "\u201cWeren\u2019t you in the FirstDivision during the war?\u201d\u201cWhy yes.",
        "Embedding": "[-16.006424    2.8375309 -26.726023 ]"
    },
    "596": {
        "#": "596",
        "Sentence": "I was in the Twenty-eighth Infantry.\u201d\u201cI was in the Sixteenth until June nineteen-eighteen.",
        "Embedding": "[ -5.9762692  -3.8287842 -16.517078 ]"
    },
    "597": {
        "#": "597",
        "Sentence": "I knew I\u2019d seenyou somewhere before.\u201dWe talked for a moment about some wet, grey little villages in France.",
        "Embedding": "[ 18.636803  22.155495 -29.778494]"
    },
    "598": {
        "#": "598",
        "Sentence": "Evidently he lived in this vicinity, for he told me that he had justbought a hydroplane, and was going to try it out in the morning.",
        "Embedding": "[ -4.303484 -17.089062  10.644259]"
    },
    "599": {
        "#": "599",
        "Sentence": "\u201cWant to go with me, old sport?",
        "Embedding": "[-21.972992  23.651115 -20.158218]"
    },
    "600": {
        "#": "600",
        "Sentence": "Just near the shore along the Sound.\u201d\u201cWhat time?\u201d\u201cAny time that suits you best.\u201dIt was on the tip of my tongue to ask his name when Jordan lookedaround and smiled.",
        "Embedding": "[ 4.0168324 10.670826   7.9260025]"
    },
    "601": {
        "#": "601",
        "Sentence": "\u201cHaving a gay time now?\u201d she inquired.",
        "Embedding": "[-24.045206 -18.83162   24.402306]"
    },
    "602": {
        "#": "602",
        "Sentence": "\u201cMuch better.\u201d I turned again to my new acquaintance.",
        "Embedding": "[  3.984183   -6.8445435 -26.721773 ]"
    },
    "603": {
        "#": "603",
        "Sentence": "\u201cThis is anunusual party for me.",
        "Embedding": "[-22.77638  -11.376458 -33.122875]"
    },
    "604": {
        "#": "604",
        "Sentence": "I haven\u2019t even seen the host.",
        "Embedding": "[-17.950592 -10.641385 -29.284317]"
    },
    "605": {
        "#": "605",
        "Sentence": "I live overthere\u2014\u201d I waved my hand at the invisible hedge in the distance, \u201candthis man Gatsby sent over his chauffeur with an invitation.\u201dFor a moment he looked at me as if he failed to understand.",
        "Embedding": "[10.272673  23.93729   -7.3399343]"
    },
    "606": {
        "#": "606",
        "Sentence": "\u201cI\u2019m Gatsby,\u201d he said suddenly.",
        "Embedding": "[-3.1514816 36.16786   -1.8981825]"
    },
    "607": {
        "#": "607",
        "Sentence": "\u201cWhat!\u201d I exclaimed.",
        "Embedding": "[-28.969906  -6.89682   -8.665995]"
    },
    "608": {
        "#": "608",
        "Sentence": "\u201cOh, I beg your pardon.\u201d\u201cI thought you knew, old sport.",
        "Embedding": "[-15.812988  20.32136  -21.873938]"
    },
    "609": {
        "#": "609",
        "Sentence": "I\u2019m afraid I\u2019m not a very good host.\u201dHe smiled understandingly\u2014much more than understandingly.",
        "Embedding": "[  4.446315 -23.777452  -7.347963]"
    },
    "610": {
        "#": "610",
        "Sentence": "It was oneof those rare smiles with a quality of eternal reassurance in it, thatyou may come across four or five times in life.",
        "Embedding": "[-9.796793  3.657106 42.93462 ]"
    },
    "611": {
        "#": "611",
        "Sentence": "It faced\u2014or seemed toface\u2014the whole eternal world for an instant, and then concentrated onyou with an irresistible prejudice in your favour.",
        "Embedding": "[31.320238  -7.8409767  9.449522 ]"
    },
    "612": {
        "#": "612",
        "Sentence": "It understood youjust so far as you wanted to be understood, believed in you as youwould like to believe in yourself, and assured you that it hadprecisely the impression of you that, at your best, you hoped toconvey.",
        "Embedding": "[ -6.2180014 -11.849515    7.1935296]"
    },
    "613": {
        "#": "613",
        "Sentence": "Precisely at that point it vanished\u2014and I was looking at anelegant young roughneck, a year or two over thirty, whose elaborateformality of speech just missed being absurd.",
        "Embedding": "[ 20.056374    6.1819654 -23.486488 ]"
    },
    "614": {
        "#": "614",
        "Sentence": "Some time before heintroduced himself I\u2019d got a strong impression that he was picking hiswords with care.",
        "Embedding": "[ -3.3039577 -24.480972  -16.098808 ]"
    },
    "615": {
        "#": "615",
        "Sentence": "Almost at the moment when Mr. Gatsby identified himself a butlerhurried toward him with the information that Chicago was calling himon the wire.",
        "Embedding": "[ 4.0499525 41.78698   -0.8375968]"
    },
    "616": {
        "#": "616",
        "Sentence": "He excused himself with a small bow that included each ofus in turn.",
        "Embedding": "[ 20.035116 -19.212446   7.830988]"
    },
    "617": {
        "#": "617",
        "Sentence": "\u201cIf you want anything just ask for it, old sport,\u201d he urged me.",
        "Embedding": "[-21.70455  23.22421 -17.09741]"
    },
    "618": {
        "#": "618",
        "Sentence": "\u201cExcuse me.",
        "Embedding": "[-36.4347     -2.7203074 -13.116292 ]"
    },
    "619": {
        "#": "619",
        "Sentence": "I will rejoin you later.\u201dWhen he was gone I turned immediately to Jordan\u2014constrained to assureher of my surprise.",
        "Embedding": "[  6.4116516 -14.017269  -12.221535 ]"
    },
    "620": {
        "#": "620",
        "Sentence": "I had expected that Mr. Gatsby would be a floridand corpulent person in his middle years.",
        "Embedding": "[ 2.3514688 36.140503  -4.8903546]"
    },
    "621": {
        "#": "621",
        "Sentence": "\u201cWho is he?\u201d I demanded.",
        "Embedding": "[-20.689741 -11.22602   -9.07988 ]"
    },
    "622": {
        "#": "622",
        "Sentence": "\u201cDo you know?\u201d\u201cHe\u2019s just a man named Gatsby.\u201d\u201cWhere is he from, I mean?",
        "Embedding": "[-14.546557   -7.0957847 -11.263102 ]"
    },
    "623": {
        "#": "623",
        "Sentence": "And what does he do?\u201d\u201cNow you\u2019re started on the subject,\u201d she answered with a wan smile.",
        "Embedding": "[-18.427017   -1.5269679   7.639121 ]"
    },
    "624": {
        "#": "624",
        "Sentence": "\u201cWell, he told me once he was an Oxford man.\u201dA dim background started to take shape behind him, but at her nextremark it faded away.",
        "Embedding": "[  9.038532 -17.40012   17.589596]"
    },
    "625": {
        "#": "625",
        "Sentence": "\u201cHowever, I don\u2019t believe it.\u201d\u201cWhy not?\u201d\u201cI don\u2019t know,\u201d she insisted, \u201cI just don\u2019t think he went there.\u201dSomething in her tone reminded me of the other girl\u2019s \u201cI think hekilled a man,\u201d and had the effect of stimulating my curiosity.",
        "Embedding": "[-7.317004  -0.3903287 16.833021 ]"
    },
    "626": {
        "#": "626",
        "Sentence": "I wouldhave accepted without question the information that Gatsby sprang fromthe swamps of Louisiana or from the lower East Side of New York.",
        "Embedding": "[10.07252   46.162266  -1.0902499]"
    },
    "627": {
        "#": "627",
        "Sentence": "Thatwas comprehensible.",
        "Embedding": "[-32.776978  -9.966599 -28.94945 ]"
    },
    "628": {
        "#": "628",
        "Sentence": "But young men didn\u2019t\u2014at least in my provincialinexperience I believed they didn\u2019t\u2014drift coolly out of nowhere andbuy a palace on Long Island Sound.",
        "Embedding": "[ 19.55714    9.431081 -20.13923 ]"
    },
    "629": {
        "#": "629",
        "Sentence": "\u201cAnyhow, he gives large parties,\u201d said Jordan, changing the subjectwith an urban distaste for the concrete.",
        "Embedding": "[ 26.83165   -18.67567     1.5258598]"
    },
    "630": {
        "#": "630",
        "Sentence": "\u201cAnd I like large parties.",
        "Embedding": "[-25.787071 -11.336585 -31.168226]"
    },
    "631": {
        "#": "631",
        "Sentence": "They\u2019re so intimate.",
        "Embedding": "[-20.062254 -30.936115 -23.098253]"
    },
    "632": {
        "#": "632",
        "Sentence": "At small parties there isn\u2019t any privacy.\u201dThere was the boom of a bass drum, and the voice of the orchestraleader rang out suddenly above the echolalia of the garden.",
        "Embedding": "[45.774128 11.741261 16.575361]"
    },
    "633": {
        "#": "633",
        "Sentence": "\u201cLadies and gentlemen,\u201d he cried.",
        "Embedding": "[-31.535496    0.4382076  23.25132  ]"
    },
    "634": {
        "#": "634",
        "Sentence": "\u201cAt the request of Mr. Gatsby we aregoing to play for you Mr. Vladmir Tostoff\u2019s latest work, whichattracted so much attention at Carnegie Hall last May.",
        "Embedding": "[ -2.2928576  33.25887   -11.441253 ]"
    },
    "635": {
        "#": "635",
        "Sentence": "If you read thepapers you know there was a big sensation.\u201d He smiled with jovialcondescension, and added: \u201cSome sensation!\u201d Whereupon everybodylaughed.",
        "Embedding": "[ 11.499128  -25.721024   -2.1128645]"
    },
    "636": {
        "#": "636",
        "Sentence": "\u201cThe piece is known,\u201d he concluded lustily, \u201cas \u2018Vladmir Tostoff\u2019sJazz History of the World!\u2019\u200a\u201dThe nature of Mr. Tostoff\u2019s composition eluded me, because just as itbegan my eyes fell on Gatsby, standing alone on the marble steps andlooking from one group to another with approving eyes.",
        "Embedding": "[13.658263  32.952087   5.4688997]"
    },
    "637": {
        "#": "637",
        "Sentence": "His tanned skinwas drawn attractively tight on his face and his short hair looked asthough it were trimmed every day.",
        "Embedding": "[ 31.780264 -16.909     10.05273 ]"
    },
    "638": {
        "#": "638",
        "Sentence": "I could see nothing sinister abouthim.",
        "Embedding": "[-12.791376 -18.19008  -33.101204]"
    },
    "639": {
        "#": "639",
        "Sentence": "I wondered if the fact that he was not drinking helped to set himoff from his guests, for it seemed to me that he grew more correct asthe fraternal hilarity increased.",
        "Embedding": "[  2.535898    1.5855819 -22.131098 ]"
    },
    "640": {
        "#": "640",
        "Sentence": "When the \u201cJazz History of the World\u201dwas over, girls were putting their heads on men\u2019s shoulders in apuppyish, convivial way, girls were swooning backward playfully intomen\u2019s arms, even into groups, knowing that someone would arrest theirfalls\u2014but no one swooned backward on Gatsby, and no French bob touchedGatsby\u2019s shoulder, and no singing quartets were formed with Gatsby\u2019shead for one link.",
        "Embedding": "[24.835867 23.590689 20.44661 ]"
    },
    "641": {
        "#": "641",
        "Sentence": "\u201cI beg your pardon.\u201dGatsby\u2019s butler was suddenly standing beside us.",
        "Embedding": "[ -7.568927    6.7170644 -22.094954 ]"
    },
    "642": {
        "#": "642",
        "Sentence": "\u201cMiss Baker?\u201d he inquired.",
        "Embedding": "[-6.319411   9.47389    5.1556125]"
    },
    "643": {
        "#": "643",
        "Sentence": "\u201cI beg your pardon, but Mr. Gatsby wouldlike to speak to you alone.\u201d\u201cWith me?\u201d she exclaimed in surprise.",
        "Embedding": "[ 0.46084252 23.116732   -6.6919394 ]"
    },
    "644": {
        "#": "644",
        "Sentence": "\u201cYes, madame.\u201dShe got up slowly, raising her eyebrows at me in astonishment, andfollowed the butler toward the house.",
        "Embedding": "[8.280732  4.1877985 8.77003  ]"
    },
    "645": {
        "#": "645",
        "Sentence": "I noticed that she wore herevening-dress, all her dresses, like sports clothes\u2014there was ajauntiness about her movements as if she had first learned to walkupon golf courses on clean, crisp mornings.",
        "Embedding": "[11.518532   4.3025594 22.24088  ]"
    },
    "646": {
        "#": "646",
        "Sentence": "I was alone and it was almost two.",
        "Embedding": "[-21.520172 -22.690277 -30.048332]"
    },
    "647": {
        "#": "647",
        "Sentence": "For some time confused andintriguing sounds had issued from a long, many-windowed room whichoverhung the terrace.",
        "Embedding": "[44.173096   6.7407985  7.214073 ]"
    },
    "648": {
        "#": "648",
        "Sentence": "Eluding Jordan\u2019s undergraduate, who was nowengaged in an obstetrical conversation with two chorus girls, and whoimplored me to join him, I went inside.",
        "Embedding": "[ 5.6235194 16.873648  26.746841 ]"
    },
    "649": {
        "#": "649",
        "Sentence": "The large room was full of people.",
        "Embedding": "[-29.60278  -32.32322  -16.753601]"
    },
    "650": {
        "#": "650",
        "Sentence": "One of the girls in yellow wasplaying the piano, and beside her stood a tall, red-haired young ladyfrom a famous chorus, engaged in song.",
        "Embedding": "[19.165407 27.567457 22.833622]"
    },
    "651": {
        "#": "651",
        "Sentence": "She had drunk a quantity ofchampagne, and during the course of her song she had decided, ineptly,that everything was very, very sad\u2014she was not only singing, she wasweeping too.",
        "Embedding": "[  7.5532165 -14.575224   33.732327 ]"
    },
    "652": {
        "#": "652",
        "Sentence": "Whenever there was a pause in the song she filled it withgasping, broken sobs, and then took up the lyric again in a quaveringsoprano.",
        "Embedding": "[  5.9780574 -12.163484   31.95619  ]"
    },
    "653": {
        "#": "653",
        "Sentence": "The tears coursed down her cheeks\u2014not freely, however, forwhen they came into contact with her heavily beaded eyelashes theyassumed an inky colour, and pursued the rest of their way in slowblack rivulets.",
        "Embedding": "[ 9.537386  -1.1315899 25.86883  ]"
    },
    "654": {
        "#": "654",
        "Sentence": "A humorous suggestion was made that she sing the noteson her face, whereupon she threw up her hands, sank into a chair, andwent off into a deep vinous sleep.",
        "Embedding": "[18.155914  3.765215 25.859015]"
    },
    "655": {
        "#": "655",
        "Sentence": "\u201cShe had a fight with a man who says he\u2019s her husband,\u201d explained agirl at my elbow.",
        "Embedding": "[-15.227205   -2.1029608  30.435873 ]"
    },
    "656": {
        "#": "656",
        "Sentence": "I looked around.",
        "Embedding": "[-30.884504 -11.209958 -18.168705]"
    },
    "657": {
        "#": "657",
        "Sentence": "Most of the remaining women were now having fightswith men said to be their husbands.",
        "Embedding": "[ 24.629782  -38.589466   -5.6774964]"
    },
    "658": {
        "#": "658",
        "Sentence": "Even Jordan\u2019s party, the quartetfrom East Egg, were rent asunder by dissension.",
        "Embedding": "[  5.160507  20.030458 -20.16529 ]"
    },
    "659": {
        "#": "659",
        "Sentence": "One of the men wastalking with curious intensity to a young actress, and his wife, afterattempting to laugh at the situation in a dignified and indifferentway, broke down entirely and resorted to flank attacks\u2014at intervalsshe appeared suddenly at his side like an angry diamond, and hissed:\u201cYou promised!\u201d into his ear.",
        "Embedding": "[21.959316 12.214304 18.751793]"
    },
    "660": {
        "#": "660",
        "Sentence": "The reluctance to go home was not confined to wayward men.",
        "Embedding": "[ 15.925412 -19.947613 -21.08333 ]"
    },
    "661": {
        "#": "661",
        "Sentence": "The hallwas at present occupied by two deplorably sober men and their highlyindignant wives.",
        "Embedding": "[ 20.676325 -37.50427   -8.210882]"
    },
    "662": {
        "#": "662",
        "Sentence": "The wives were sympathizing with each other inslightly raised voices.",
        "Embedding": "[ 22.440674 -39.237907  -6.0735  ]"
    },
    "663": {
        "#": "663",
        "Sentence": "\u201cWhenever he sees I\u2019m having a good time he wants to go home.\u201d\u201cNever heard anything so selfish in my life.\u201d\u201cWe\u2019re always the first ones to leave.\u201d\u201cSo are we.\u201d\u201cWell, we\u2019re almost the last tonight,\u201d said one of the men sheepishly.",
        "Embedding": "[ -3.562757    1.5505233 -15.777533 ]"
    },
    "664": {
        "#": "664",
        "Sentence": "\u201cThe orchestra left half an hour ago.\u201dIn spite of the wives\u2019 agreement that such malevolence was beyondcredibility, the dispute ended in a short struggle, and both wiveswere lifted, kicking, into the night.",
        "Embedding": "[24.39581  17.60806  22.259071]"
    },
    "665": {
        "#": "665",
        "Sentence": "As I waited for my hat in the hall the door of the library opened andJordan Baker and Gatsby came out together.",
        "Embedding": "[ 6.4716334 25.446404  -1.1475476]"
    },
    "666": {
        "#": "666",
        "Sentence": "He was saying some lastword to her, but the eagerness in his manner tightened abruptly intoformality as several people approached him to say goodbye.",
        "Embedding": "[ 10.677936  -15.5449505  12.61426  ]"
    },
    "667": {
        "#": "667",
        "Sentence": "Jordan\u2019s party were calling impatiently to her from the porch, but shelingered for a moment to shake hands.",
        "Embedding": "[ 4.8042006 14.365549  22.455194 ]"
    },
    "668": {
        "#": "668",
        "Sentence": "\u201cI\u2019ve just heard the most amazing thing,\u201d she whispered.",
        "Embedding": "[-28.10377    -6.2039576  13.789782 ]"
    },
    "669": {
        "#": "669",
        "Sentence": "\u201cHow longwere we in there?\u201d\u201cWhy, about an hour.\u201d\u201cIt was \u2026 simply amazing,\u201d she repeated abstractedly.",
        "Embedding": "[-1.2120558  7.647149   0.5104206]"
    },
    "670": {
        "#": "670",
        "Sentence": "\u201cBut I swore Iwouldn\u2019t tell it and here I am tantalizing you.\u201d She yawned gracefullyin my face.",
        "Embedding": "[-23.720346 -12.144828  21.766743]"
    },
    "671": {
        "#": "671",
        "Sentence": "\u201cPlease come and see me \u2026 Phone book \u2026 Under the name ofMrs. Sigourney Howard \u2026 My aunt \u2026\u201d She was hurrying off as shetalked\u2014her brown hand waved a jaunty salute as she melted into herparty at the door.",
        "Embedding": "[9.188095 7.881255 7.445457]"
    },
    "672": {
        "#": "672",
        "Sentence": "Rather ashamed that on my first appearance I had stayed so late, Ijoined the last of Gatsby\u2019s guests, who were clustered around him.",
        "Embedding": "[ -1.3392519   3.631912  -24.361504 ]"
    },
    "673": {
        "#": "673",
        "Sentence": "Iwanted to explain that I\u2019d hunted for him early in the evening and toapologize for not having known him in the garden.",
        "Embedding": "[13.914723   1.9333146 -7.973067 ]"
    },
    "674": {
        "#": "674",
        "Sentence": "\u201cDon\u2019t mention it,\u201d he enjoined me eagerly.",
        "Embedding": "[-10.603408  -24.425056   -0.7616824]"
    },
    "675": {
        "#": "675",
        "Sentence": "\u201cDon\u2019t give it anotherthought, old sport.\u201d The familiar expression held no more familiaritythan the hand which reassuringly brushed my shoulder.",
        "Embedding": "[ -7.8719215  26.217142  -14.024174 ]"
    },
    "676": {
        "#": "676",
        "Sentence": "\u201cAnd don\u2019tforget we\u2019re going up in the hydroplane tomorrow morning, at nineo\u2019clock.\u201dThen the butler, behind his shoulder:\u201cPhiladelphia wants you on the phone, sir.\u201d\u201cAll right, in a minute.",
        "Embedding": "[  1.312795   9.660429 -23.126608]"
    },
    "677": {
        "#": "677",
        "Sentence": "Tell them I\u2019ll be right there \u2026 Good night.\u201d\u201cGood night.\u201d\u201cGood night.\u201d He smiled\u2014and suddenly there seemed to be a pleasantsignificance in having been among the last to go, as if he had desiredit all the time.",
        "Embedding": "[ -2.2438145   0.5656638 -16.774172 ]"
    },
    "678": {
        "#": "678",
        "Sentence": "\u201cGood night, old sport \u2026 Good night.\u201dBut as I walked down the steps I saw that the evening was not quiteover.",
        "Embedding": "[-16.593817  23.283644 -25.354115]"
    },
    "679": {
        "#": "679",
        "Sentence": "Fifty feet from the door a dozen headlights illuminated abizarre and tumultuous scene.",
        "Embedding": "[35.469063   7.282546   7.3225217]"
    },
    "680": {
        "#": "680",
        "Sentence": "In the ditch beside the road, right sideup, but violently shorn of one wheel, rested a new coup\u00e9 which hadleft Gatsby\u2019s drive not two minutes before.",
        "Embedding": "[29.440813    1.6709986   0.96856815]"
    },
    "681": {
        "#": "681",
        "Sentence": "The sharp jut of a wallaccounted for the detachment of the wheel, which was now gettingconsiderable attention from half a dozen curious chauffeurs.",
        "Embedding": "[ 3.1000330e+01 -2.7103205e+00 -2.1863511e-02]"
    },
    "682": {
        "#": "682",
        "Sentence": "However,as they had left their cars blocking the road, a harsh, discordant dinfrom those in the rear had been audible for some time, and added tothe already violent confusion of the scene.",
        "Embedding": "[26.298784   -0.08311179  1.7353003 ]"
    },
    "683": {
        "#": "683",
        "Sentence": "A man in a long duster had dismounted from the wreck and now stood inthe middle of the road, looking from the car to the tyre and from thetyre to the observers in a pleasant, puzzled way.",
        "Embedding": "[ 2.9178623e+01 -2.0832226e-02 -1.6902158e+00]"
    },
    "684": {
        "#": "684",
        "Sentence": "\u201cSee!\u201d he explained.",
        "Embedding": "[-27.469673 -17.559738  -4.792274]"
    },
    "685": {
        "#": "685",
        "Sentence": "\u201cIt went in the ditch.\u201dThe fact was infinitely astonishing to him, and I recognized first theunusual quality of wonder, and then the man\u2014it was the late patron ofGatsby\u2019s library.",
        "Embedding": "[ 14.345232 -21.591278  -5.000943]"
    },
    "686": {
        "#": "686",
        "Sentence": "\u201cHow\u2019d it happen?\u201dHe shrugged his shoulders.",
        "Embedding": "[-18.694098 -19.364252 -12.10222 ]"
    },
    "687": {
        "#": "687",
        "Sentence": "\u201cI know nothing whatever about mechanics,\u201d he said decisively.",
        "Embedding": "[ -9.978736   -17.157063    -0.21087648]"
    },
    "688": {
        "#": "688",
        "Sentence": "\u201cBut how did it happen?",
        "Embedding": "[-16.857746  -8.788666 -18.397902]"
    },
    "689": {
        "#": "689",
        "Sentence": "Did you run into the wall?\u201d\u201cDon\u2019t ask me,\u201d said Owl Eyes, washing his hands of the wholematter.",
        "Embedding": "[ -9.357597  -8.896326 -13.849357]"
    },
    "690": {
        "#": "690",
        "Sentence": "\u201cI know very little about driving\u2014next to nothing.",
        "Embedding": "[ -9.341657  -16.55848    -1.9188439]"
    },
    "691": {
        "#": "691",
        "Sentence": "Ithappened, and that\u2019s all I know.\u201d\u201cWell, if you\u2019re a poor driver you oughtn\u2019t to try driving at night.\u201d\u201cBut I wasn\u2019t even trying,\u201d he explained indignantly, \u201cI wasn\u2019t eventrying.\u201dAn awed hush fell upon the bystanders.",
        "Embedding": "[  7.3804207    0.39464104 -30.708904  ]"
    },
    "692": {
        "#": "692",
        "Sentence": "\u201cDo you want to commit suicide?\u201d\u201cYou\u2019re lucky it was just a wheel!",
        "Embedding": "[-11.7904625    0.38784024 -30.962772  ]"
    },
    "693": {
        "#": "693",
        "Sentence": "A bad driver and not even trying!\u201d\u201cYou don\u2019t understand,\u201d explained the criminal.",
        "Embedding": "[  8.847065   -2.1954918 -28.818533 ]"
    },
    "694": {
        "#": "694",
        "Sentence": "\u201cI wasn\u2019t driving.",
        "Embedding": "[-34.777634 -18.686512 -20.23778 ]"
    },
    "695": {
        "#": "695",
        "Sentence": "There\u2019s another man in the car.\u201dThe shock that followed this declaration found voice in a sustained\u201cAh-h-h!\u201d as the door of the coup\u00e9 swung slowly open.",
        "Embedding": "[37.827797  -7.7471733 19.293417 ]"
    },
    "696": {
        "#": "696",
        "Sentence": "The crowd\u2014it wasnow a crowd\u2014stepped back involuntarily, and when the door had openedwide there was a ghostly pause.",
        "Embedding": "[31.301252 -9.449943 -8.33978 ]"
    },
    "697": {
        "#": "697",
        "Sentence": "Then, very gradually, part by part, apale, dangling individual stepped out of the wreck, pawing tentativelyat the ground with a large uncertain dancing shoe.",
        "Embedding": "[32.459824  -7.0127263 14.11298  ]"
    },
    "698": {
        "#": "698",
        "Sentence": "Blinded by the glare of the headlights and confused by the incessantgroaning of the horns, the apparition stood swaying for a momentbefore he perceived the man in the duster.",
        "Embedding": "[29.707254   -0.09096599  9.171681  ]"
    },
    "699": {
        "#": "699",
        "Sentence": "\u201cWha\u2019s matter?\u201d he inquired calmly.",
        "Embedding": "[-16.440989 -19.591913 -14.120335]"
    },
    "700": {
        "#": "700",
        "Sentence": "\u201cDid we run outa gas?\u201d\u201cLook!\u201dHalf a dozen fingers pointed at the amputated wheel\u2014he stared at itfor a moment, and then looked upward as though he suspected that ithad dropped from the sky.",
        "Embedding": "[21.814924  -4.5245743 11.163535 ]"
    },
    "701": {
        "#": "701",
        "Sentence": "\u201cIt came off,\u201d someone explained.",
        "Embedding": "[-27.353033  -19.957947   -4.5285044]"
    },
    "702": {
        "#": "702",
        "Sentence": "He nodded.",
        "Embedding": "[-23.579933  -31.224705   -1.4921495]"
    },
    "703": {
        "#": "703",
        "Sentence": "\u201cAt first I din\u2019 notice we\u2019d stopped.\u201dA pause.",
        "Embedding": "[ -8.4031925 -13.152993  -36.992317 ]"
    },
    "704": {
        "#": "704",
        "Sentence": "Then, taking a long breath and straightening his shoulders,he remarked in a determined voice:\u201cWonder\u2019ff tell me where there\u2019s a gas\u2019line station?\u201dAt least a dozen men, some of them a little better off than he was,explained to him that wheel and car were no longer joined by anyphysical bond.",
        "Embedding": "[23.720558 -6.823909 10.346226]"
    },
    "705": {
        "#": "705",
        "Sentence": "\u201cBack out,\u201d he suggested after a moment.",
        "Embedding": "[ -1.959289 -38.09933  -12.793148]"
    },
    "706": {
        "#": "706",
        "Sentence": "\u201cPut her in reverse.\u201d\u201cBut the wheel\u2019s off!\u201dHe hesitated.",
        "Embedding": "[-23.17371  -18.072838  16.272602]"
    },
    "707": {
        "#": "707",
        "Sentence": "\u201cNo harm in trying,\u201d he said.",
        "Embedding": "[-19.748823   -20.236147     0.22010183]"
    },
    "708": {
        "#": "708",
        "Sentence": "The caterwauling horns had reached a crescendo and I turned away andcut across the lawn toward home.",
        "Embedding": "[43.915863 10.623735 14.588573]"
    },
    "709": {
        "#": "709",
        "Sentence": "I glanced back once.",
        "Embedding": "[-29.074812 -12.665461 -16.670784]"
    },
    "710": {
        "#": "710",
        "Sentence": "A wafer of amoon was shining over Gatsby\u2019s house, making the night fine as before,and surviving the laughter and the sound of his still glowing garden.",
        "Embedding": "[25.036156 18.97206   6.852271]"
    },
    "711": {
        "#": "711",
        "Sentence": "A sudden emptiness seemed to flow now from the windows and the greatdoors, endowing with complete isolation the figure of the host, whostood on the porch, his hand up in a formal gesture of farewell.",
        "Embedding": "[23.282738   1.6385541 11.772123 ]"
    },
    "712": {
        "#": "712",
        "Sentence": "Reading over what I have written so far, I see I have given theimpression that the events of three nights several weeks apart wereall that absorbed me.",
        "Embedding": "[  5.8782277   6.0535617 -13.445638 ]"
    },
    "713": {
        "#": "713",
        "Sentence": "On the contrary, they were merely casual eventsin a crowded summer, and, until much later, they absorbed meinfinitely less than my personal affairs.",
        "Embedding": "[19.8949    -8.100966  -7.3592367]"
    },
    "714": {
        "#": "714",
        "Sentence": "Most of the time I worked.",
        "Embedding": "[-22.269848 -14.576794 -22.363739]"
    },
    "715": {
        "#": "715",
        "Sentence": "In the early morning the sun threw myshadow westward as I hurried down the white chasms of lower New Yorkto the Probity Trust.",
        "Embedding": "[37.462265 17.714905  8.263728]"
    },
    "716": {
        "#": "716",
        "Sentence": "I knew the other clerks and young bond-salesmenby their first names, and lunched with them in dark, crowdedrestaurants on little pig sausages and mashed potatoes and coffee.",
        "Embedding": "[42.39511  25.668705  4.335797]"
    },
    "717": {
        "#": "717",
        "Sentence": "Ieven had a short affair with a girl who lived in Jersey City andworked in the accounting department, but her brother began throwingmean looks in my direction, so when she went on her vacation in July Ilet it blow quietly away.",
        "Embedding": "[16.754171 20.834745 14.997669]"
    },
    "718": {
        "#": "718",
        "Sentence": "I took dinner usually at the Yale Club\u2014for some reason it was thegloomiest event of my day\u2014and then I went upstairs to the library andstudied investments and securities for a conscientious hour.",
        "Embedding": "[ 15.996046   8.889847 -13.756272]"
    },
    "719": {
        "#": "719",
        "Sentence": "Therewere generally a few rioters around, but they never came into thelibrary, so it was a good place to work.",
        "Embedding": "[ -7.007619  18.518156 -26.344872]"
    },
    "720": {
        "#": "720",
        "Sentence": "After that, if the night wasmellow, I strolled down Madison Avenue past the old Murray Hill Hotel,and over 33rd Street to the Pennsylvania Station.",
        "Embedding": "[ 36.383057  24.245626 -10.606887]"
    },
    "721": {
        "#": "721",
        "Sentence": "I began to like New York, the racy, adventurous feel of it at night,and the satisfaction that the constant flicker of men and women andmachines gives to the restless eye.",
        "Embedding": "[  2.8924472 -10.981608   10.723707 ]"
    },
    "722": {
        "#": "722",
        "Sentence": "I liked to walk up Fifth Avenueand pick out romantic women from the crowd and imagine that in a fewminutes I was going to enter into their lives, and no one would everknow or disapprove.",
        "Embedding": "[-12.720641    1.9311054   3.7149928]"
    },
    "723": {
        "#": "723",
        "Sentence": "Sometimes, in my mind, I followed them to theirapartments on the corners of hidden streets, and they turned andsmiled back at me before they faded through a door into warmdarkness.",
        "Embedding": "[ 24.545752    7.0554667 -11.987054 ]"
    },
    "724": {
        "#": "724",
        "Sentence": "At the enchanted metropolitan twilight I felt a hauntingloneliness sometimes, and felt it in others\u2014poor young clerks wholoitered in front of windows waiting until it was time for a solitaryrestaurant dinner\u2014young clerks in the dusk, wasting the most poignantmoments of night and life.",
        "Embedding": "[ 36.0228    -4.101842 -19.341595]"
    },
    "725": {
        "#": "725",
        "Sentence": "Again at eight o\u2019clock, when the dark lanes of the Forties were linedfive deep with throbbing taxicabs, bound for the theatre district, Ifelt a sinking in my heart.",
        "Embedding": "[25.439194  -3.0093336 23.728777 ]"
    },
    "726": {
        "#": "726",
        "Sentence": "Forms leaned together in the taxis as theywaited, and voices sang, and there was laughter from unheard jokes,and lighted cigarettes made unintelligible circles inside.",
        "Embedding": "[34.583916   3.5552475 20.626303 ]"
    },
    "727": {
        "#": "727",
        "Sentence": "Imagining that I, too, was hurrying towards gaiety and sharing their intimateexcitement, I wished them well.",
        "Embedding": "[ -1.7166225 -25.189625    5.665195 ]"
    },
    "728": {
        "#": "728",
        "Sentence": "For a while I lost sight of Jordan Baker, and then in midsummer Ifound her again.",
        "Embedding": "[-2.8848546 12.097157   2.005396 ]"
    },
    "729": {
        "#": "729",
        "Sentence": "At first I was flattered to go places with her,because she was a golf champion, and everyone knew her name.",
        "Embedding": "[-9.4377575 -2.4155397 22.260555 ]"
    },
    "730": {
        "#": "730",
        "Sentence": "Then it was something more.",
        "Embedding": "[-23.160385 -38.39404  -11.361537]"
    },
    "731": {
        "#": "731",
        "Sentence": "I wasn\u2019t actually in love, but I felt a sort oftender curiosity.",
        "Embedding": "[-11.972177  -7.0417    14.71239 ]"
    },
    "732": {
        "#": "732",
        "Sentence": "The bored haughty face that she turned to the worldconcealed something\u2014most affectations conceal something eventually,even though they don\u2019t in the beginning\u2014and one day I found what it was.",
        "Embedding": "[ 4.8198843 -3.5625331 16.26158  ]"
    },
    "733": {
        "#": "733",
        "Sentence": "When we were on a house-party together up in Warwick, she left aborrowed car out in the rain with the top down, and then lied aboutit\u2014and suddenly I remembered the story about her that had eluded methat night at Daisy\u2019s.",
        "Embedding": "[18.886538 13.903571  4.600459]"
    },
    "734": {
        "#": "734",
        "Sentence": "At her first big golf tournament there was arow that nearly reached the newspapers\u2014a suggestion that she had movedher ball from a bad lie in the semifinal round.",
        "Embedding": "[-11.52155   23.40794  -33.158157]"
    },
    "735": {
        "#": "735",
        "Sentence": "The thing approachedthe proportions of a scandal\u2014then died away.",
        "Embedding": "[  0.5755405 -31.328833  -23.915749 ]"
    },
    "736": {
        "#": "736",
        "Sentence": "A caddy retracted hisstatement, and the only other witness admitted that he might have beenmistaken.",
        "Embedding": "[ 21.01401    -1.2772117 -28.143255 ]"
    },
    "737": {
        "#": "737",
        "Sentence": "The incident and the name had remained together in my mind.",
        "Embedding": "[ 10.469476  -44.052284   -0.9819722]"
    },
    "738": {
        "#": "738",
        "Sentence": "Jordan Baker instinctively avoided clever, shrewd men, and now I sawthat this was because she felt safer on a plane where any divergencefrom a code would be thought impossible.",
        "Embedding": "[ 0.65244794 10.873139   17.143143  ]"
    },
    "739": {
        "#": "739",
        "Sentence": "She was incurably dishonest.",
        "Embedding": "[-22.32281  -26.99425   12.763517]"
    },
    "740": {
        "#": "740",
        "Sentence": "She wasn\u2019t able to endure being at a disadvantage and, given thisunwillingness, I suppose she had begun dealing in subterfuges when shewas very young in order to keep that cool, insolent smile turned tothe world and yet satisfy the demands of her hard, jaunty body.",
        "Embedding": "[ 7.5653715 -3.8710043 19.450472 ]"
    },
    "741": {
        "#": "741",
        "Sentence": "It made no difference to me.",
        "Embedding": "[-23.676212 -33.287476  -8.992639]"
    },
    "742": {
        "#": "742",
        "Sentence": "Dishonesty in a woman is a thing younever blame deeply\u2014I was casually sorry, and then I forgot.",
        "Embedding": "[-3.0765753 -2.4792225  6.6113806]"
    },
    "743": {
        "#": "743",
        "Sentence": "It was onthat same house-party that we had a curious conversation about drivinga car.",
        "Embedding": "[  2.8433113  -7.9756594 -17.941248 ]"
    },
    "744": {
        "#": "744",
        "Sentence": "It started because she passed so close to some workmen that ourfender flicked a button on one man\u2019s coat.",
        "Embedding": "[23.446398    0.33953923 34.258335  ]"
    },
    "745": {
        "#": "745",
        "Sentence": "\u201cYou\u2019re a rotten driver,\u201d I protested.",
        "Embedding": "[  7.42093   -2.362792 -23.893723]"
    },
    "746": {
        "#": "746",
        "Sentence": "\u201cEither you ought to be morecareful, or you oughtn\u2019t to drive at all.\u201d\u201cI am careful.\u201d\u201cNo, you\u2019re not.\u201d\u201cWell, other people are,\u201d she said lightly.",
        "Embedding": "[  4.75525    2.50709  -30.325426]"
    },
    "747": {
        "#": "747",
        "Sentence": "\u201cWhat\u2019s that got to do with it?\u201d\u201cThey\u2019ll keep out of my way,\u201d she insisted.",
        "Embedding": "[-18.034897 -13.26222   14.284855]"
    },
    "748": {
        "#": "748",
        "Sentence": "\u201cIt takes two to make an accident.\u201d\u201cSuppose you met somebody just as careless as yourself.\u201d\u201cI hope I never will,\u201d she answered.",
        "Embedding": "[ -7.6065946 -10.304434   11.2938175]"
    },
    "749": {
        "#": "749",
        "Sentence": "\u201cI hate careless people.",
        "Embedding": "[-40.64987    6.02936  -13.130032]"
    },
    "750": {
        "#": "750",
        "Sentence": "That\u2019swhy I like you.\u201dHer grey, sun-strained eyes stared straight ahead, but she haddeliberately shifted our relations, and for a moment I thought I lovedher.",
        "Embedding": "[ 28.579815   -26.32999     -0.91625226]"
    },
    "751": {
        "#": "751",
        "Sentence": "But I am slow-thinking and full of interior rules that act asbrakes on my desires, and I knew that first I had to get myselfdefinitely out of that tangle back home.",
        "Embedding": "[  0.5138582 -32.799866   14.964218 ]"
    },
    "752": {
        "#": "752",
        "Sentence": "I\u2019d been writing letters oncea week and signing them: \u201cLove, Nick,\u201d and all I could think of washow, when that certain girl played tennis, a faint moustache ofperspiration appeared on her upper lip.",
        "Embedding": "[-1.501008 26.902689 24.489458]"
    },
    "753": {
        "#": "753",
        "Sentence": "Nevertheless there was a vagueunderstanding that had to be tactfully broken off before I was free.",
        "Embedding": "[  2.3465946  -8.016408  -11.725275 ]"
    },
    "754": {
        "#": "754",
        "Sentence": "Everyone suspects himself of at least one of the cardinal virtues, andthis is mine: I am one of the few honest people that I have everknown.",
        "Embedding": "[-10.487311   -3.7854526  -2.7200425]"
    },
    "755": {
        "#": "755",
        "Sentence": "IVOn Sunday morning while church bells rang in the villages alongshore,the world and its mistress returned to Gatsby\u2019s house and twinkledhilariously on his lawn.",
        "Embedding": "[25.429089  21.823147   5.9990926]"
    },
    "756": {
        "#": "756",
        "Sentence": "\u201cHe\u2019s a bootlegger,\u201d said the young ladies, moving somewhere betweenhis cocktails and his flowers.",
        "Embedding": "[17.457386  3.872956 40.078987]"
    },
    "757": {
        "#": "757",
        "Sentence": "\u201cOne time he killed a man who had foundout that he was nephew to Von Hindenburg and second cousin to thedevil.",
        "Embedding": "[-39.385624  12.601211  11.564525]"
    },
    "758": {
        "#": "758",
        "Sentence": "Reach me a rose, honey, and pour me a last drop into that therecrystal glass.\u201dOnce I wrote down on the empty spaces of a timetable the names ofthose who came to Gatsby\u2019s house that summer.",
        "Embedding": "[ 6.715565  20.005625  -1.2976123]"
    },
    "759": {
        "#": "759",
        "Sentence": "It is an old timetablenow, disintegrating at its folds, and headed \u201cThis schedule in effectJuly 5th, 1922.\u201d But I can still read the grey names, and they willgive you a better impression than my generalities of those whoaccepted Gatsby\u2019s hospitality and paid him the subtle tribute ofknowing nothing whatever about him.",
        "Embedding": "[ 14.826185  20.6969   -26.908564]"
    },
    "760": {
        "#": "760",
        "Sentence": "From East Egg, then, came the Chester Beckers and the Leeches, and aman named Bunsen, whom I knew at Yale, and Doctor Webster Civet, whowas drowned last summer up in Maine.",
        "Embedding": "[32.919544 25.346487 22.621483]"
    },
    "761": {
        "#": "761",
        "Sentence": "And the Hornbeams and the WillieVoltaires, and a whole clan named Blackbuck, who always gathered in acorner and flipped up their noses like goats at whosoever camenear.",
        "Embedding": "[27.124523 15.248879 28.407837]"
    },
    "762": {
        "#": "762",
        "Sentence": "And the Ismays and the Chrysties (or rather Hubert Auerbach andMr. Chrystie\u2019s wife), and Edgar Beaver, whose hair, they say, turnedcotton-white one winter afternoon for no good reason at all.",
        "Embedding": "[24.727753 23.730137 28.285137]"
    },
    "763": {
        "#": "763",
        "Sentence": "Clarence Endive was from East Egg, as I remember.",
        "Embedding": "[  2.92688   16.967472 -22.912699]"
    },
    "764": {
        "#": "764",
        "Sentence": "He came only once,in white knickerbockers, and had a fight with a bum named Etty in thegarden.",
        "Embedding": "[20.038984  11.460665  -2.1925175]"
    },
    "765": {
        "#": "765",
        "Sentence": "From farther out on the Island came the Cheadles and the O.R. P. Schraeders, and the Stonewall Jackson Abrams of Georgia, and theFishguards and the Ripley Snells.",
        "Embedding": "[29.562752 20.804546 25.170149]"
    },
    "766": {
        "#": "766",
        "Sentence": "Snell was there three days before hewent to the penitentiary, so drunk out on the gravel drive thatMrs. Ulysses Swett\u2019s automobile ran over his right hand.",
        "Embedding": "[29.815016   3.2360437 -0.9586887]"
    },
    "767": {
        "#": "767",
        "Sentence": "The Danciescame, too, and S. B. Whitebait, who was well over sixty, and MauriceA. Flink, and the Hammerheads, and Beluga the tobacco importer, andBeluga\u2019s girls.",
        "Embedding": "[32.609814 17.040747 24.563894]"
    },
    "768": {
        "#": "768",
        "Sentence": "From West Egg came the Poles and the Mulreadys and Cecil Roebuck andCecil Schoen and Gulick the State senator and Newton Orchid, whocontrolled Films Par Excellence, and Eckhaust and Clyde Cohen and DonS. Schwartz (the son) and Arthur McCarty, all connected with themovies in one way or another.",
        "Embedding": "[31.680693 22.213655 24.720722]"
    },
    "769": {
        "#": "769",
        "Sentence": "And the Catlips and the Bembergs and G.Earl Muldoon, brother to that Muldoon who afterward strangled hiswife.",
        "Embedding": "[29.284363 16.045753 27.57791 ]"
    },
    "770": {
        "#": "770",
        "Sentence": "Da Fontano the promoter came there, and Ed Legros and James B.",
        "Embedding": "[33.414127 16.978079 27.741173]"
    },
    "771": {
        "#": "771",
        "Sentence": "(\u201cRot-Gut\u201d) Ferret and the De Jongs and Ernest Lilly\u2014they came togamble, and when Ferret wandered into the garden it meant he wascleaned out and Associated Traction would have to fluctuate profitablynext day.",
        "Embedding": "[ 6.161991 24.717102 22.704124]"
    },
    "772": {
        "#": "772",
        "Sentence": "A man named Klipspringer was there so often that he became known as\u201cthe boarder\u201d\u2014I doubt if he had any other home.",
        "Embedding": "[ 23.716074   -4.4861007 -14.991904 ]"
    },
    "773": {
        "#": "773",
        "Sentence": "Of theatrical peoplethere were Gus Waize and Horace O\u2019Donavan and Lester Myer and GeorgeDuckweed and Francis Bull.",
        "Embedding": "[32.745403 21.36859  27.23216 ]"
    },
    "774": {
        "#": "774",
        "Sentence": "Also from New York were the Chromes and theBackhyssons and the Dennickers and Russel Betty and the Corrigans andthe Kellehers and the Dewars and the Scullys and S. W. Belcher and theSmirkes and the young Quinns, divorced now, and Henry L. Palmetto, whokilled himself by jumping in front of a subway train in Times Square.",
        "Embedding": "[33.15607  20.429821 24.171343]"
    },
    "775": {
        "#": "775",
        "Sentence": "Benny McClenahan arrived always with four girls.",
        "Embedding": "[-15.212229    -0.49217173  -0.10223165]"
    },
    "776": {
        "#": "776",
        "Sentence": "They were never quitethe same ones in physical person, but they were so identical one withanother that it inevitably seemed they had been there before.",
        "Embedding": "[ 27.73851  -26.85617   -8.835731]"
    },
    "777": {
        "#": "777",
        "Sentence": "I haveforgotten their names\u2014Jaqueline, I think, or else Consuela, or Gloriaor Judy or June, and their last names were either the melodious namesof flowers and months or the sterner ones of the great Americancapitalists whose cousins, if pressed, they would confess themselvesto be.",
        "Embedding": "[28.016325 25.395063 29.092009]"
    },
    "778": {
        "#": "778",
        "Sentence": "In addition to all these I can remember that Faustina O\u2019Brien camethere at least once and the Baedeker girls and young Brewer, who hadhis nose shot off in the war, and Mr. Albrucksburger and Miss Haag,his fianc\u00e9e, and Ardita Fitz-Peters and Mr. P. Jewett, once head ofthe American Legion, and Miss Claudia Hip, with a man reputed to beher chauffeur, and a prince of something, whom we called Duke, andwhose name, if I ever knew it, I have forgotten.",
        "Embedding": "[29.124022 26.497238 25.326712]"
    },
    "779": {
        "#": "779",
        "Sentence": "All these people came to Gatsby\u2019s house in the summer.",
        "Embedding": "[ -3.7162402  40.805183  -14.390517 ]"
    },
    "780": {
        "#": "780",
        "Sentence": "At nine o\u2019clock, one morning late in July, Gatsby\u2019s gorgeous carlurched up the rocky drive to my door and gave out a burst of melodyfrom its three-noted horn.",
        "Embedding": "[44.425953   3.5653641  1.4981848]"
    },
    "781": {
        "#": "781",
        "Sentence": "It was the first time he had called on me, though I had gone to two ofhis parties, mounted in his hydroplane, and, at his urgent invitation,made frequent use of his beach.",
        "Embedding": "[ 13.648173 -21.084517   2.469496]"
    },
    "782": {
        "#": "782",
        "Sentence": "\u201cGood morning, old sport.",
        "Embedding": "[-20.937151  24.541643 -22.39068 ]"
    },
    "783": {
        "#": "783",
        "Sentence": "You\u2019re having lunch with me today and Ithought we\u2019d ride up together.\u201dHe was balancing himself on the dashboard of his car with thatresourcefulness of movement that is so peculiarly American\u2014that comes,I suppose, with the absence of lifting work in youth and, even more,with the formless grace of our nervous, sporadic games.",
        "Embedding": "[15.227166   7.440862   6.2082653]"
    },
    "784": {
        "#": "784",
        "Sentence": "This qualitywas continually breaking through his punctilious manner in the shapeof restlessness.",
        "Embedding": "[ 24.03231   -16.451061    4.3064365]"
    },
    "785": {
        "#": "785",
        "Sentence": "He was never quite still; there was always a tappingfoot somewhere or the impatient opening and closing of a hand.",
        "Embedding": "[ 19.1708   -17.312534  -5.970142]"
    },
    "786": {
        "#": "786",
        "Sentence": "He saw me looking with admiration at his car.",
        "Embedding": "[  0.32462916 -28.201696    -1.2583787 ]"
    },
    "787": {
        "#": "787",
        "Sentence": "\u201cIt\u2019s pretty, isn\u2019t it, old sport?\u201d He jumped off to give me a betterview.",
        "Embedding": "[-18.695105  20.718697 -16.288727]"
    },
    "788": {
        "#": "788",
        "Sentence": "\u201cHaven\u2019t you ever seen it before?\u201dI\u2019d seen it.",
        "Embedding": "[-37.221043 -11.582107   7.085704]"
    },
    "789": {
        "#": "789",
        "Sentence": "Everybody had seen it.",
        "Embedding": "[-39.467434 -12.814211   7.138165]"
    },
    "790": {
        "#": "790",
        "Sentence": "It was a rich cream colour, brightwith nickel, swollen here and there in its monstrous length withtriumphant hatboxes and supper-boxes and toolboxes, and terraced witha labyrinth of windshields that mirrored a dozen suns.",
        "Embedding": "[33.039616 18.868542 16.563953]"
    },
    "791": {
        "#": "791",
        "Sentence": "Sitting downbehind many layers of glass in a sort of green leather conservatory,we started to town.",
        "Embedding": "[44.30053    2.3839462 24.976881 ]"
    },
    "792": {
        "#": "792",
        "Sentence": "I had talked with him perhaps half a dozen times in the past month andfound, to my disappointment, that he had little to say.",
        "Embedding": "[ -2.89484   -17.22812   -11.7557335]"
    },
    "793": {
        "#": "793",
        "Sentence": "So my firstimpression, that he was a person of some undefined consequence, hadgradually faded and he had become simply the proprietor of anelaborate roadhouse next door.",
        "Embedding": "[ 18.89459     2.6237159 -10.935005 ]"
    },
    "794": {
        "#": "794",
        "Sentence": "And then came that disconcerting ride.",
        "Embedding": "[ -0.86221564 -37.044437     2.2382631 ]"
    },
    "795": {
        "#": "795",
        "Sentence": "We hadn\u2019t reached West Eggvillage before Gatsby began leaving his elegant sentences unfinishedand slapping himself indecisively on the knee of his caramel-colouredsuit.",
        "Embedding": "[ 5.710795  37.492065   5.2490325]"
    },
    "796": {
        "#": "796",
        "Sentence": "\u201cLook here, old sport,\u201d he broke out surprisingly, \u201cwhat\u2019s youropinion of me, anyhow?\u201dA little overwhelmed, I began the generalized evasions which thatquestion deserves.",
        "Embedding": "[ -6.2130837  22.515942  -12.088099 ]"
    },
    "797": {
        "#": "797",
        "Sentence": "\u201cWell, I\u2019m going to tell you something about my life,\u201d he interrupted.",
        "Embedding": "[ -6.946598  -8.751339 -20.649132]"
    },
    "798": {
        "#": "798",
        "Sentence": "\u201cI don\u2019t want you to get a wrong idea of me from all these stories youhear.\u201dSo he was aware of the bizarre accusations that flavoured conversationin his halls.",
        "Embedding": "[-6.379853  -5.9644766  3.3828642]"
    },
    "799": {
        "#": "799",
        "Sentence": "\u201cI\u2019ll tell you God\u2019s truth.\u201d His right hand suddenly ordered divineretribution to stand by.",
        "Embedding": "[-21.732164  13.84892  -10.651248]"
    },
    "800": {
        "#": "800",
        "Sentence": "\u201cI am the son of some wealthy people in theMiddle West\u2014all dead now.",
        "Embedding": "[-11.7713785  35.92776   -16.69544  ]"
    },
    "801": {
        "#": "801",
        "Sentence": "I was brought up in America but educated atOxford, because all my ancestors have been educated there for manyyears.",
        "Embedding": "[ 13.975245  13.579708 -25.205658]"
    },
    "802": {
        "#": "802",
        "Sentence": "It is a family tradition.\u201dHe looked at me sideways\u2014and I knew why Jordan Baker had believed hewas lying.",
        "Embedding": "[-1.4298869 13.528533  -1.508303 ]"
    },
    "803": {
        "#": "803",
        "Sentence": "He hurried the phrase \u201ceducated at Oxford,\u201d or swallowedit, or choked on it, as though it had bothered him before.",
        "Embedding": "[ 10.113708 -19.750069  17.678352]"
    },
    "804": {
        "#": "804",
        "Sentence": "And withthis doubt, his whole statement fell to pieces, and I wondered ifthere wasn\u2019t something a little sinister about him, after all.",
        "Embedding": "[-3.2160625 -9.662418   1.1712618]"
    },
    "805": {
        "#": "805",
        "Sentence": "\u201cWhat part of the Middle West?\u201d I inquired casually.",
        "Embedding": "[  2.7911143  14.9485235 -30.400263 ]"
    },
    "806": {
        "#": "806",
        "Sentence": "\u201cSan Francisco.\u201d\u201cI see.\u201d\u201cMy family all died and I came into a good deal of money.\u201dHis voice was solemn, as if the memory of that sudden extinction of aclan still haunted him.",
        "Embedding": "[ 30.833807 -15.249115 -10.439013]"
    },
    "807": {
        "#": "807",
        "Sentence": "For a moment I suspected that he was pullingmy leg, but a glance at him convinced me otherwise.",
        "Embedding": "[ -3.745538  -23.197527   -4.7667155]"
    },
    "808": {
        "#": "808",
        "Sentence": "\u201cAfter that I lived like a young rajah in all the capitals ofEurope\u2014Paris, Venice, Rome\u2014collecting jewels, chiefly rubies, huntingbig game, painting a little, things for myself only, and trying toforget something very sad that had happened to me long ago.\u201dWith an effort I managed to restrain my incredulous laughter.",
        "Embedding": "[ 7.215212  -3.5582027 12.152262 ]"
    },
    "809": {
        "#": "809",
        "Sentence": "The veryphrases were worn so threadbare that they evoked no image except thatof a turbaned \u201ccharacter\u201d leaking sawdust at every pore as he pursueda tiger through the Bois de Boulogne.",
        "Embedding": "[25.53543  34.110237 15.883482]"
    },
    "810": {
        "#": "810",
        "Sentence": "\u201cThen came the war, old sport.",
        "Embedding": "[-11.534853  22.700703 -18.894903]"
    },
    "811": {
        "#": "811",
        "Sentence": "It was a great relief, and I tried veryhard to die, but I seemed to bear an enchanted life.",
        "Embedding": "[  3.4930959 -19.73951     2.5233757]"
    },
    "812": {
        "#": "812",
        "Sentence": "I accepted acommission as first lieutenant when it began.",
        "Embedding": "[  2.3275769 -15.02147   -38.58198  ]"
    },
    "813": {
        "#": "813",
        "Sentence": "In the Argonne Forest Itook the remains of my machine-gun battalion so far forward that therewas a half mile gap on either side of us where the infantry couldn\u2019tadvance.",
        "Embedding": "[ 35.559814  14.936072 -11.474552]"
    },
    "814": {
        "#": "814",
        "Sentence": "We stayed there two days and two nights, a hundred and thirtymen with sixteen Lewis guns, and when the infantry came up at lastthey found the insignia of three German divisions among the piles ofdead.",
        "Embedding": "[ 36.49096   16.259655 -12.832844]"
    },
    "815": {
        "#": "815",
        "Sentence": "I was promoted to be a major, and every Allied government gaveme a decoration\u2014even Montenegro, little Montenegro down on theAdriatic Sea!\u201dLittle Montenegro!",
        "Embedding": "[ 19.198277  14.680581 -22.970383]"
    },
    "816": {
        "#": "816",
        "Sentence": "He lifted up the words and nodded at them\u2014with hissmile.",
        "Embedding": "[ -8.008348  -36.669724    4.6372094]"
    },
    "817": {
        "#": "817",
        "Sentence": "The smile comprehended Montenegro\u2019s troubled history andsympathized with the brave struggles of the Montenegrin people.",
        "Embedding": "[ 19.295237 -13.704503  11.080653]"
    },
    "818": {
        "#": "818",
        "Sentence": "Itappreciated fully the chain of national circumstances which hadelicited this tribute from Montenegro\u2019s warm little heart.",
        "Embedding": "[24.552906 -5.048188 29.803257]"
    },
    "819": {
        "#": "819",
        "Sentence": "Myincredulity was submerged in fascination now; it was like skimminghastily through a dozen magazines.",
        "Embedding": "[ 32.009224 -16.533293 -20.13875 ]"
    },
    "820": {
        "#": "820",
        "Sentence": "He reached in his pocket, and a piece of metal, slung on a ribbon,fell into my palm.",
        "Embedding": "[  7.7688594 -31.716236   -4.221687 ]"
    },
    "821": {
        "#": "821",
        "Sentence": "\u201cThat\u2019s the one from Montenegro.\u201dTo my astonishment, the thing had an authentic look.",
        "Embedding": "[-17.28548   13.407262 -10.728724]"
    },
    "822": {
        "#": "822",
        "Sentence": "\u201cOrderi diDanilo,\u201d ran the circular legend, \u201cMontenegro, Nicolas Rex.\u201d\u201cTurn it.\u201d\u201cMajor Jay Gatsby,\u201d I read, \u201cFor Valour Extraordinary.\u201d\u201cHere\u2019s another thing I always carry.",
        "Embedding": "[ 4.3319297 45.109634  -4.015058 ]"
    },
    "823": {
        "#": "823",
        "Sentence": "A souvenir of Oxford days.",
        "Embedding": "[ -5.974025  16.43971  -14.682606]"
    },
    "824": {
        "#": "824",
        "Sentence": "it was taken in Trinity Quad\u2014the man on my left is now the Earl ofDoncaster.\u201dIt was a photograph of half a dozen young men in blazers loafing in an archway through which were visible a host of spires.",
        "Embedding": "[23.980854 19.880257 16.603607]"
    },
    "825": {
        "#": "825",
        "Sentence": "There was Gatsby,looking a little, not much, younger\u2014with a cricket bat in his hand.",
        "Embedding": "[  9.7395    -29.21187     3.5033336]"
    },
    "826": {
        "#": "826",
        "Sentence": "Then it was all true.",
        "Embedding": "[-39.668037 -20.953176 -13.705394]"
    },
    "827": {
        "#": "827",
        "Sentence": "I saw the skins of tigers flaming in his palaceon the Grand Canal; I saw him opening a chest of rubies to ease, withtheir crimson-lighted depths, the gnawings of his broken heart.",
        "Embedding": "[28.138235 32.601433 14.211279]"
    },
    "828": {
        "#": "828",
        "Sentence": "\u201cI\u2019m going to make a big request of you today,\u201d he said, pocketing hissouvenirs with satisfaction, \u201cso I thought you ought to know somethingabout me.",
        "Embedding": "[-27.147993  11.795496  -9.058802]"
    },
    "829": {
        "#": "829",
        "Sentence": "I didn\u2019t want you to think I was just some nobody.",
        "Embedding": "[-19.763405    -0.36867493 -24.174973  ]"
    },
    "830": {
        "#": "830",
        "Sentence": "You see,I usually find myself among strangers because I drift here and theretrying to forget the sad things that happened to me.\u201d He hesitated.",
        "Embedding": "[  2.1072338 -12.976755   -2.4968438]"
    },
    "831": {
        "#": "831",
        "Sentence": "\u201cYou\u2019ll hear about it this afternoon.\u201d\u201cAt lunch?\u201d\u201cNo, this afternoon.",
        "Embedding": "[-22.011524 -23.081478 -19.635628]"
    },
    "832": {
        "#": "832",
        "Sentence": "I happened to find out that you\u2019re taking MissBaker to tea.\u201d\u201cDo you mean you\u2019re in love with Miss Baker?\u201d\u201cNo, old sport, I\u2019m not.",
        "Embedding": "[-16.093878  17.570053 -20.223965]"
    },
    "833": {
        "#": "833",
        "Sentence": "But Miss Baker has kindly consented to speakto you about this matter.\u201dI hadn\u2019t the faintest idea what \u201cthis matter\u201d was, but I was moreannoyed than interested.",
        "Embedding": "[-4.557709   3.2649484  8.309014 ]"
    },
    "834": {
        "#": "834",
        "Sentence": "I hadn\u2019t asked Jordan to tea in order todiscuss Mr. Jay Gatsby.",
        "Embedding": "[-0.30390278 41.169044   -6.609074  ]"
    },
    "835": {
        "#": "835",
        "Sentence": "I was sure the request would be somethingutterly fantastic, and for a moment I was sorry I\u2019d ever set foot uponhis overpopulated lawn.",
        "Embedding": "[-16.413942    7.708264   -0.7844583]"
    },
    "836": {
        "#": "836",
        "Sentence": "He wouldn\u2019t say another word.",
        "Embedding": "[-23.134369 -34.430016   6.204276]"
    },
    "837": {
        "#": "837",
        "Sentence": "His correctness grew on him as we nearedthe city.",
        "Embedding": "[ -6.0817842 -28.764772    2.7700827]"
    },
    "838": {
        "#": "838",
        "Sentence": "We passed Port Roosevelt, where there was a glimpse ofred-belted oceangoing ships, and sped along a cobbled slum lined withthe dark, undeserted saloons of the faded-gilt nineteen-hundreds.",
        "Embedding": "[29.000332 12.836756 -2.089363]"
    },
    "839": {
        "#": "839",
        "Sentence": "Then the valley of ashes opened out on both sides of us, and I had aglimpse of Mrs. Wilson straining at the garage pump with pantingvitality as we went by.",
        "Embedding": "[ 6.9303813 13.015527  13.11908  ]"
    },
    "840": {
        "#": "840",
        "Sentence": "With fenders spread like wings we scattered light through halfAstoria\u2014only half, for as we twisted among the pillars of the elevatedI heard the familiar \u201cjug-jug-spat!\u201d of a motorcycle, and a franticpoliceman rode alongside.",
        "Embedding": "[30.139143   7.4185257  4.009635 ]"
    },
    "841": {
        "#": "841",
        "Sentence": "\u201cAll right, old sport,\u201d called Gatsby.",
        "Embedding": "[-8.985519 33.862885 -7.897361]"
    },
    "842": {
        "#": "842",
        "Sentence": "We slowed down.",
        "Embedding": "[-31.335848 -31.604103  -8.353094]"
    },
    "843": {
        "#": "843",
        "Sentence": "Taking a whitecard from his wallet, he waved it before the man\u2019s eyes.",
        "Embedding": "[ 24.1552   -25.770945  19.015427]"
    },
    "844": {
        "#": "844",
        "Sentence": "\u201cRight you are,\u201d agreed the policeman, tipping his cap.",
        "Embedding": "[ 19.502739   -2.8242643 -33.14351  ]"
    },
    "845": {
        "#": "845",
        "Sentence": "\u201cKnow you nexttime, Mr. Gatsby.",
        "Embedding": "[-4.277547  39.32693   -2.1182642]"
    },
    "846": {
        "#": "846",
        "Sentence": "Excuse me!\u201d\u201cWhat was that?\u201d I inquired.",
        "Embedding": "[-26.355398   -5.1826997  -8.063175 ]"
    },
    "847": {
        "#": "847",
        "Sentence": "\u201cThe picture of Oxford?\u201d\u201cI was able to do the commissioner a favour once, and he sends me aChristmas card every year.\u201dOver the great bridge, with the sunlight through the girders making aconstant flicker upon the moving cars, with the city rising up acrossthe river in white heaps and sugar lumps all built with a wish out ofnonolfactory money.",
        "Embedding": "[33.905926 24.921087  9.592913]"
    },
    "848": {
        "#": "848",
        "Sentence": "The city seen from the Queensboro Bridge is alwaysthe city seen for the first time, in its first wild promise of all themystery and the beauty in the world.",
        "Embedding": "[35.094265 26.41945  11.570601]"
    },
    "849": {
        "#": "849",
        "Sentence": "A dead man passed us in a hearse heaped with blooms, followed by twocarriages with drawn blinds, and by more cheerful carriages forfriends.",
        "Embedding": "[33.03032    2.6306648  6.5190873]"
    },
    "850": {
        "#": "850",
        "Sentence": "The friends looked out at us with the tragic eyes and shortupper lips of southeastern Europe, and I was glad that the sight ofGatsby\u2019s splendid car was included in their sombre holiday.",
        "Embedding": "[ 32.934315    5.4996905 -10.016631 ]"
    },
    "851": {
        "#": "851",
        "Sentence": "As wecrossed Blackwell\u2019s Island a limousine passed us, driven by a whitechauffeur, in which sat three modish negroes, two bucks and a girl.",
        "Embedding": "[20.944872  10.3358345 31.454073 ]"
    },
    "852": {
        "#": "852",
        "Sentence": "Ilaughed aloud as the yolks of their eyeballs rolled toward us inhaughty rivalry.",
        "Embedding": "[ 33.02885   -19.007923   -1.9780349]"
    },
    "853": {
        "#": "853",
        "Sentence": "\u201cAnything can happen now that we\u2019ve slid over this bridge,\u201d I thought;\u201canything at all \u2026\u201dEven Gatsby could happen, without any particular wonder.",
        "Embedding": "[ 1.4364097 28.146196   3.7991745]"
    },
    "854": {
        "#": "854",
        "Sentence": "Roaring noon.",
        "Embedding": "[-27.519037 -24.881966 -17.020376]"
    },
    "855": {
        "#": "855",
        "Sentence": "In a well-fanned Forty-second Street cellar I met Gatsbyfor lunch.",
        "Embedding": "[ 32.522102  25.595877 -11.573094]"
    },
    "856": {
        "#": "856",
        "Sentence": "Blinking away the brightness of the street outside, my eyespicked him out obscurely in the anteroom, talking to another man.",
        "Embedding": "[ 42.159546 -11.718016 -15.607703]"
    },
    "857": {
        "#": "857",
        "Sentence": "\u201cMr.",
        "Embedding": "[-42.632507 -12.855596 -16.221254]"
    },
    "858": {
        "#": "858",
        "Sentence": "Carraway, this is my friend Mr. Wolfshiem.\u201dA small, flat-nosed Jew raised his large head and regarded me with twofine growths of hair which luxuriated in either nostril.",
        "Embedding": "[ 4.6768584 34.2867    20.90607  ]"
    },
    "859": {
        "#": "859",
        "Sentence": "After amoment I discovered his tiny eyes in the half-darkness.",
        "Embedding": "[ 35.670395 -18.827469   2.869646]"
    },
    "860": {
        "#": "860",
        "Sentence": "\u201c\u2014So I took one look at him,\u201d said Mr. Wolfshiem, shaking my handearnestly, \u201cand what do you think I did?\u201d\u201cWhat?\u201d I inquired politely.",
        "Embedding": "[ 3.208111   3.7133584 -3.0910785]"
    },
    "861": {
        "#": "861",
        "Sentence": "But evidently he was not addressing me, for he dropped my hand andcovered Gatsby with his expressive nose.",
        "Embedding": "[ 6.7139173 27.593384  -8.585649 ]"
    },
    "862": {
        "#": "862",
        "Sentence": "\u201cI handed the money to Katspaugh and I said: \u2018All right, Katspaugh,don\u2019t pay him a penny till he shuts his mouth.\u2019 He shut it then andthere.\u201dGatsby took an arm of each of us and moved forward into therestaurant, whereupon Mr. Wolfshiem swallowed a new sentence he wasstarting and lapsed into a somnambulatory abstraction.",
        "Embedding": "[11.130334  -1.034714   1.7137144]"
    },
    "863": {
        "#": "863",
        "Sentence": "\u201cHighballs?\u201d asked the head waiter.",
        "Embedding": "[ 16.82732    -4.6514263 -35.377754 ]"
    },
    "864": {
        "#": "864",
        "Sentence": "\u201cThis is a nice restaurant here,\u201d said Mr. Wolfshiem, looking at thepresbyterian nymphs on the ceiling.",
        "Embedding": "[ 3.5086231  8.046201  -2.8649616]"
    },
    "865": {
        "#": "865",
        "Sentence": "\u201cBut I like across the streetbetter!\u201d\u201cYes, highballs,\u201d agreed Gatsby, and then to Mr. Wolfshiem: \u201cIt\u2019s toohot over there.\u201d\u201cHot and small\u2014yes,\u201d said Mr. Wolfshiem, \u201cbut full of memories.\u201d\u201cWhat place is that?\u201d I asked.",
        "Embedding": "[ 2.8285334 30.608036  -9.968966 ]"
    },
    "866": {
        "#": "866",
        "Sentence": "\u201cThe old Metropole.\u201d\u201cThe old Metropole,\u201d brooded Mr. Wolfshiem gloomily.",
        "Embedding": "[-15.39258   27.463438  11.316805]"
    },
    "867": {
        "#": "867",
        "Sentence": "\u201cFilled withfaces dead and gone.",
        "Embedding": "[ -2.2668016 -35.358395  -24.314829 ]"
    },
    "868": {
        "#": "868",
        "Sentence": "Filled with friends gone now forever.",
        "Embedding": "[ -3.7263734 -36.89263   -25.448494 ]"
    },
    "869": {
        "#": "869",
        "Sentence": "I can\u2019tforget so long as I live the night they shot Rosy Rosenthal there.",
        "Embedding": "[-16.379679  10.39257   17.308447]"
    },
    "870": {
        "#": "870",
        "Sentence": "it was six of us at the table, and Rosy had eat and drunk a lot allevening.",
        "Embedding": "[ 17.925892 -39.775776 -12.112254]"
    },
    "871": {
        "#": "871",
        "Sentence": "When it was almost morning the waiter came up to him with afunny look and says somebody wants to speak to him outside.",
        "Embedding": "[  9.810721 -20.651588   8.387716]"
    },
    "872": {
        "#": "872",
        "Sentence": "\u2018Allright,\u2019 says Rosy, and begins to get up, and I pulled him down in hischair.",
        "Embedding": "[ 18.02206  -28.417097   8.246949]"
    },
    "873": {
        "#": "873",
        "Sentence": "\u201c\u200a\u2018Let the bastards come in here if they want you, Rosy, but don\u2019tyou, so help me, move outside this room.\u2019\u201cIt was four o\u2019clock in the morning then, and if we\u2019d of raised theblinds we\u2019d of seen daylight.\u201d\u201cDid he go?\u201d I asked innocently.",
        "Embedding": "[ 4.732918  20.349869  -5.3912077]"
    },
    "874": {
        "#": "874",
        "Sentence": "\u201cSure he went.\u201d Mr. Wolfshiem\u2019s nose flashed at me indignantly.",
        "Embedding": "[ -2.0614822 -28.520374   -5.7110243]"
    },
    "875": {
        "#": "875",
        "Sentence": "\u201cHeturned around in the door and says: \u2018Don\u2019t let that waiter take awaymy coffee!\u2019 Then he went out on the sidewalk, and they shot him threetimes in his full belly and drove away.\u201d\u201cFour of them were electrocuted,\u201d I said, remembering.",
        "Embedding": "[14.95051    6.5115013  0.4180079]"
    },
    "876": {
        "#": "876",
        "Sentence": "\u201cFive, with Becker.\u201d His nostrils turned to me in an interested way.",
        "Embedding": "[ -1.8711467  10.638973  -36.757072 ]"
    },
    "877": {
        "#": "877",
        "Sentence": "\u201cI understand you\u2019re looking for a business gonnegtion.\u201dThe juxtaposition of these two remarks was startling.",
        "Embedding": "[ -1.8951474 -31.341503  -11.103759 ]"
    },
    "878": {
        "#": "878",
        "Sentence": "Gatsby answeredfor me:\u201cOh, no,\u201d he exclaimed, \u201cthis isn\u2019t the man.\u201d\u201cNo?\u201d Mr. Wolfshiem seemed disappointed.",
        "Embedding": "[ 2.6990187 30.259298  -3.5916142]"
    },
    "879": {
        "#": "879",
        "Sentence": "\u201cThis is just a friend.",
        "Embedding": "[-40.0178   -21.584936  -3.098562]"
    },
    "880": {
        "#": "880",
        "Sentence": "I told you we\u2019d talk about that some othertime.\u201d\u201cI beg your pardon,\u201d said Mr. Wolfshiem, \u201cI had a wrong man.\u201dA succulent hash arrived, and Mr. Wolfshiem, forgetting the moresentimental atmosphere of the old Metropole, began to eat withferocious delicacy.",
        "Embedding": "[ 0.66713834 20.582674   -8.240834  ]"
    },
    "881": {
        "#": "881",
        "Sentence": "His eyes, meanwhile, roved very slowly all aroundthe room\u2014he completed the arc by turning to inspect the peopledirectly behind.",
        "Embedding": "[28.120539 -3.549349 11.925199]"
    },
    "882": {
        "#": "882",
        "Sentence": "I think that, except for my presence, he would havetaken one short glance beneath our own table.",
        "Embedding": "[ -0.26689324 -24.032928    -2.8469486 ]"
    },
    "883": {
        "#": "883",
        "Sentence": "\u201cLook here, old sport,\u201d said Gatsby, leaning toward me, \u201cI\u2019m afraid Imade you a little angry this morning in the car.\u201dThere was the smile again, but this time I held out against it.",
        "Embedding": "[ -5.814371  25.806852 -11.734255]"
    },
    "884": {
        "#": "884",
        "Sentence": "\u201cI don\u2019t like mysteries,\u201d I answered, \u201cand I don\u2019t understand why youwon\u2019t come out frankly and tell me what you want.",
        "Embedding": "[-20.151596    3.4753802   1.5732044]"
    },
    "885": {
        "#": "885",
        "Sentence": "Why has it all gotto come through Miss Baker?\u201d\u201cOh, it\u2019s nothing underhand,\u201d he assured me.",
        "Embedding": "[-0.2153785  0.9064225 22.185099 ]"
    },
    "886": {
        "#": "886",
        "Sentence": "\u201cMiss Baker\u2019s a greatsportswoman, you know, and she\u2019d never do anything that wasn\u2019t allright.\u201dSuddenly he looked at his watch, jumped up, and hurried from the room,leaving me with Mr. Wolfshiem at the table.",
        "Embedding": "[3.9299505 4.280784  6.395469 ]"
    },
    "887": {
        "#": "887",
        "Sentence": "\u201cHe has to telephone,\u201d said Mr. Wolfshiem, following him with hiseyes.",
        "Embedding": "[-10.584464  -26.270515    6.0611405]"
    },
    "888": {
        "#": "888",
        "Sentence": "\u201cFine fellow, isn\u2019t he?",
        "Embedding": "[-37.929596 -12.742289  -4.287109]"
    },
    "889": {
        "#": "889",
        "Sentence": "Handsome to look at and a perfectgentleman.\u201d\u201cYes.\u201d\u201cHe\u2019s an Oggsford man.\u201d\u201cOh!\u201d\u201cHe went to Oggsford College in England.",
        "Embedding": "[ 17.062876  36.296665 -20.6457  ]"
    },
    "890": {
        "#": "890",
        "Sentence": "You know Oggsford College?\u201d\u201cI\u2019ve heard of it.\u201d\u201cIt\u2019s one of the most famous colleges in the world.\u201d\u201cHave you known Gatsby for a long time?\u201d I inquired.",
        "Embedding": "[-6.578973  27.748917  -2.7117841]"
    },
    "891": {
        "#": "891",
        "Sentence": "\u201cSeveral years,\u201d he answered in a gratified way.",
        "Embedding": "[-10.143966  -36.387768   -4.7759676]"
    },
    "892": {
        "#": "892",
        "Sentence": "\u201cI made the pleasureof his acquaintance just after the war.",
        "Embedding": "[  1.3868074 -12.498087  -37.505093 ]"
    },
    "893": {
        "#": "893",
        "Sentence": "But I knew I had discovered aman of fine breeding after I talked with him an hour.",
        "Embedding": "[  3.600809 -26.991108  10.867072]"
    },
    "894": {
        "#": "894",
        "Sentence": "I said tomyself: \u2018There\u2019s the kind of man you\u2019d like to take home and introduceto your mother and sister.\u2019\u200a\u201d He paused.",
        "Embedding": "[-10.245     13.579636 -33.601536]"
    },
    "895": {
        "#": "895",
        "Sentence": "\u201cI see you\u2019re looking at mycuff buttons.\u201dI hadn\u2019t been looking at them, but I did now.",
        "Embedding": "[-11.6924305  -3.0680661 -14.408213 ]"
    },
    "896": {
        "#": "896",
        "Sentence": "They were composed ofoddly familiar pieces of ivory.",
        "Embedding": "[-14.807492 -29.257397 -20.014845]"
    },
    "897": {
        "#": "897",
        "Sentence": "\u201cFinest specimens of human molars,\u201d he informed me.",
        "Embedding": "[  0.988862 -20.787027 -25.164827]"
    },
    "898": {
        "#": "898",
        "Sentence": "\u201cWell!\u201d I inspected them.",
        "Embedding": "[-28.1406    -8.114661 -20.074274]"
    },
    "899": {
        "#": "899",
        "Sentence": "\u201cThat\u2019s a very interesting idea.\u201d\u201cYeah.\u201d He flipped his sleeves up under his coat.",
        "Embedding": "[-10.761403 -31.813456 -14.808887]"
    },
    "900": {
        "#": "900",
        "Sentence": "\u201cYeah, Gatsby\u2019s verycareful about women.",
        "Embedding": "[-5.2692714 40.231834   9.586053 ]"
    },
    "901": {
        "#": "901",
        "Sentence": "He would never so much as look at a friend\u2019swife.\u201dWhen the subject of this instinctive trust returned to the table andsat down Mr. Wolfshiem drank his coffee with a jerk and got to hisfeet.",
        "Embedding": "[12.774546   4.359906  -2.0997708]"
    },
    "902": {
        "#": "902",
        "Sentence": "\u201cI have enjoyed my lunch,\u201d he said, \u201cand I\u2019m going to run off from youtwo young men before I outstay my welcome.\u201d\u201cDon\u2019t hurry Meyer,\u201d said Gatsby, without enthusiasm.",
        "Embedding": "[-3.283824 25.537733 -8.200043]"
    },
    "903": {
        "#": "903",
        "Sentence": "Mr. Wolfshiemraised his hand in a sort of benediction.",
        "Embedding": "[  5.3282027 -38.768566  -16.87852  ]"
    },
    "904": {
        "#": "904",
        "Sentence": "\u201cYou\u2019re very polite, but I belong to another generation,\u201d he announcedsolemnly.",
        "Embedding": "[ -8.482602  14.050016 -31.10248 ]"
    },
    "905": {
        "#": "905",
        "Sentence": "\u201cYou sit here and discuss your sports and your young ladie sand your\u2014\u201d He supplied an imaginary noun with another wave of hishand.",
        "Embedding": "[ 19.557444   6.174251 -28.640959]"
    },
    "906": {
        "#": "906",
        "Sentence": "\u201cAs for me, I am fifty years old, and I won\u2019t impose myself onyou any longer.\u201dAs he shook hands and turned away his tragic nose was trembling.",
        "Embedding": "[  9.860131 -31.102495  -9.427999]"
    },
    "907": {
        "#": "907",
        "Sentence": "Iwondered if I had said anything to offend him.",
        "Embedding": "[-23.90812    -13.690837     0.35230872]"
    },
    "908": {
        "#": "908",
        "Sentence": "\u201cHe becomes very sentimental sometimes,\u201d explained Gatsby.",
        "Embedding": "[-4.909288  43.946793   5.2360334]"
    },
    "909": {
        "#": "909",
        "Sentence": "\u201cThis isone of his sentimental days.",
        "Embedding": "[ -8.240029 -30.200567 -25.167665]"
    },
    "910": {
        "#": "910",
        "Sentence": "He\u2019s quite a character around New York\u2014adenizen of Broadway.\u201d\u201cWho is he, anyhow, an actor?\u201d\u201cNo.\u201d\u201cA dentist?\u201d\u201cMeyer Wolfshiem?",
        "Embedding": "[-23.275259  17.688622 -16.398697]"
    },
    "911": {
        "#": "911",
        "Sentence": "No, he\u2019s a gambler.\u201d Gatsby hesitated, then added,coolly: \u201cHe\u2019s the man who fixed the World\u2019s Series back in 1919.\u201d\u201cFixed the World\u2019s Series?\u201d I repeated.",
        "Embedding": "[ 7.2486935 41.83827   -3.8019736]"
    },
    "912": {
        "#": "912",
        "Sentence": "The idea staggered me.",
        "Embedding": "[-31.302475  -7.421602 -12.510635]"
    },
    "913": {
        "#": "913",
        "Sentence": "I remembered, of course, that the World\u2019sSeries had been fixed in 1919, but if I had thought of it at all Iwould have thought of it as a thing that merely happened, the end ofsome inevitable chain.",
        "Embedding": "[ -0.95172113 -15.006103     3.824     ]"
    },
    "914": {
        "#": "914",
        "Sentence": "It never occurred to me that one man couldstart to play with the faith of fifty million people\u2014with thesingle-mindedness of a burglar blowing a safe.",
        "Embedding": "[ 31.9987     4.154723 -18.7183  ]"
    },
    "915": {
        "#": "915",
        "Sentence": "\u201cHow did he happen to do that?\u201d I asked after a minute.",
        "Embedding": "[-14.987023 -10.66243  -18.523378]"
    },
    "916": {
        "#": "916",
        "Sentence": "\u201cHe just saw the opportunity.\u201d\u201cWhy isn\u2019t he in jail?\u201d\u201cThey can\u2019t get him, old sport.",
        "Embedding": "[-20.200275  18.983519 -16.562014]"
    },
    "917": {
        "#": "917",
        "Sentence": "He\u2019s a smart man.\u201dI insisted on paying the check.",
        "Embedding": "[-16.264812  -25.485523    4.1646743]"
    },
    "918": {
        "#": "918",
        "Sentence": "As the waiter brought my change Icaught sight of Tom Buchanan across the crowded room.",
        "Embedding": "[15.253737  27.648859   7.9604883]"
    },
    "919": {
        "#": "919",
        "Sentence": "\u201cCome along with me for a minute,\u201d I said; \u201cI\u2019ve got to say hello tosomeone.\u201dWhen he saw us Tom jumped up and took half a dozen steps in ourdirection.",
        "Embedding": "[3.5346696 1.5784825 1.6062679]"
    },
    "920": {
        "#": "920",
        "Sentence": "\u201cWhere\u2019ve you been?\u201d he demanded eagerly.",
        "Embedding": "[-16.70755  -14.645613 -10.983237]"
    },
    "921": {
        "#": "921",
        "Sentence": "\u201cDaisy\u2019s furious because youhaven\u2019t called up.\u201d\u201cThis is Mr. Gatsby, Mr. Buchanan.\u201dThey shook hands briefly, and a strained, unfamiliar look ofembarrassment came over Gatsby\u2019s face.",
        "Embedding": "[ 8.857701 34.90172   8.659154]"
    },
    "922": {
        "#": "922",
        "Sentence": "\u201cHow\u2019ve you been, anyhow?\u201d demanded Tom of me.",
        "Embedding": "[-27.379675  14.683837  -1.562751]"
    },
    "923": {
        "#": "923",
        "Sentence": "\u201cHow\u2019d you happen tocome up this far to eat?\u201d\u201cI\u2019ve been having lunch with Mr. Gatsby.\u201dI turned toward Mr. Gatsby, but he was no longer there.",
        "Embedding": "[ 2.4070413 33.64674   -6.952458 ]"
    },
    "924": {
        "#": "924",
        "Sentence": "One October day in nineteen-seventeen\u2014(said Jordan Baker that afternoon, sitting up very straight on astraight chair in the tea-garden at the Plaza Hotel)\u2014I was walking along from one place to another, half on the sidewalksand half on the lawns.",
        "Embedding": "[13.775475  13.109112   4.0239697]"
    },
    "925": {
        "#": "925",
        "Sentence": "I was happier on the lawns because I had onshoes from England with rubber knobs on the soles that bit into thesoft ground.",
        "Embedding": "[ 11.823029  20.62897  -14.182379]"
    },
    "926": {
        "#": "926",
        "Sentence": "I had on a new plaid skirt also that blew a little in thewind, and whenever this happened the red, white, and blue banners infront of all the houses stretched out stiff and said tut-tut-tut-tut,in a disapproving way.",
        "Embedding": "[20.846243 16.88236  -8.872054]"
    },
    "927": {
        "#": "927",
        "Sentence": "The largest of the banners and the largest of the lawns belonged toDaisy Fay\u2019s house.",
        "Embedding": "[28.761688 23.1847   11.308284]"
    },
    "928": {
        "#": "928",
        "Sentence": "She was just eighteen, two years older than me, andby far the most popular of all the young girls in Louisville.",
        "Embedding": "[-8.091105  -3.0513885 35.995674 ]"
    },
    "929": {
        "#": "929",
        "Sentence": "Shedressed in white, and had a little white roadster, and all day longthe telephone rang in her house and excited young officers from CampTaylor demanded the privilege of monopolizing her thatnight.",
        "Embedding": "[13.504345 17.670383 -1.573676]"
    },
    "930": {
        "#": "930",
        "Sentence": "\u201cAnyways, for an hour!\u201dWhen I came opposite her house that morning her white roadster wasbeside the kerb, and she was sitting in it with a lieutenant I hadnever seen before.",
        "Embedding": "[11.911227  17.31771   -2.8152795]"
    },
    "931": {
        "#": "931",
        "Sentence": "They were so engrossed in each other that shedidn\u2019t see me until I was five feet away.",
        "Embedding": "[ 23.40092   -28.912388   -2.8416915]"
    },
    "932": {
        "#": "932",
        "Sentence": "\u201cHello, Jordan,\u201d she called unexpectedly.",
        "Embedding": "[-10.364442  14.797324  -5.556187]"
    },
    "933": {
        "#": "933",
        "Sentence": "\u201cPlease come here.\u201dI was flattered that she wanted to speak to me, because of all theolder girls I admired her most.",
        "Embedding": "[-10.812464   -4.1335015  19.886654 ]"
    },
    "934": {
        "#": "934",
        "Sentence": "She asked me if I was going to the RedCross to make bandages.",
        "Embedding": "[-25.778128 -12.792159  16.590687]"
    },
    "935": {
        "#": "935",
        "Sentence": "I was.",
        "Embedding": "[-35.06207  -15.036929 -15.282014]"
    },
    "936": {
        "#": "936",
        "Sentence": "Well, then, would I tell them that shecouldn\u2019t come that day?",
        "Embedding": "[-26.418547   -6.6369643  -0.7625021]"
    },
    "937": {
        "#": "937",
        "Sentence": "The officer looked at Daisy while she wasspeaking, in a way that every young girl wants to be looked atsometime, and because it seemed romantic to me I have remembered theincident ever since.",
        "Embedding": "[-3.567676   9.3951645 26.275978 ]"
    },
    "938": {
        "#": "938",
        "Sentence": "His name was Jay Gatsby, and I didn\u2019t lay eyes onhim again for over four years\u2014even after I\u2019d met him on Long Island Ididn\u2019t realize it was the same man.",
        "Embedding": "[ 8.348348   40.6711     -0.26621288]"
    },
    "939": {
        "#": "939",
        "Sentence": "That was nineteen-seventeen.",
        "Embedding": "[-33.713326  -20.523132   -9.4868355]"
    },
    "940": {
        "#": "940",
        "Sentence": "By the next year I had a few beauxmyself, and I began to play in tournaments, so I didn\u2019t see Daisy veryoften.",
        "Embedding": "[-5.2984967 20.379835  25.426825 ]"
    },
    "941": {
        "#": "941",
        "Sentence": "She went with a slightly older crowd\u2014when she went with anyoneat all.",
        "Embedding": "[-5.474532  -5.2681203 37.12543  ]"
    },
    "942": {
        "#": "942",
        "Sentence": "Wild rumours were circulating about her\u2014how her mother hadfound her packing her bag one winter night to go to New York and saygoodbye to a soldier who was going overseas.",
        "Embedding": "[17.232727 21.666595 17.36614 ]"
    },
    "943": {
        "#": "943",
        "Sentence": "She was effectuallyprevented, but she wasn\u2019t on speaking terms with her family forseveral weeks.",
        "Embedding": "[-7.5033627 -7.780424  28.799356 ]"
    },
    "944": {
        "#": "944",
        "Sentence": "After that she didn\u2019t play around with the soldiers anymore, but only with a few flat-footed, shortsighted young men in town,who couldn\u2019t get into the army at all.",
        "Embedding": "[ -3.314063 -15.868188  34.42    ]"
    },
    "945": {
        "#": "945",
        "Sentence": "By the next autumn she was gay again, gay as ever.",
        "Embedding": "[-24.55998  -18.998001  26.286285]"
    },
    "946": {
        "#": "946",
        "Sentence": "She had a d\u00e9butafter the armistice, and in February she was presumably engaged to aman from New Orleans.",
        "Embedding": "[-11.645199  -6.450149  30.431662]"
    },
    "947": {
        "#": "947",
        "Sentence": "In June she married Tom Buchanan of Chicago,with more pomp and circumstance than Louisville ever knew before.",
        "Embedding": "[-18.625912   34.661003    7.4318304]"
    },
    "948": {
        "#": "948",
        "Sentence": "Hecame down with a hundred people in four private cars, and hired awhole floor of the Muhlbach Hotel, and the day before the wedding hegave her a string of pearls valued at three hundred and fifty thousanddollars.",
        "Embedding": "[21.988836  7.216528 30.290493]"
    },
    "949": {
        "#": "949",
        "Sentence": "I was a bridesmaid.",
        "Embedding": "[-16.832659  -6.533025 -33.658356]"
    },
    "950": {
        "#": "950",
        "Sentence": "I came into her room half an hour before thebridal dinner, and found her lying on her bed as lovely as the Junenight in her flowered dress\u2014and as drunk as a monkey.",
        "Embedding": "[26.688284   7.4834824 24.38781  ]"
    },
    "951": {
        "#": "951",
        "Sentence": "She had a bottleof Sauterne in one hand and a letter in the other.",
        "Embedding": "[-3.9558222 -8.652072  37.294937 ]"
    },
    "952": {
        "#": "952",
        "Sentence": "\u201c\u200a\u2019Gratulate me,\u201d she muttered.",
        "Embedding": "[-27.724392 -11.715996  12.188631]"
    },
    "953": {
        "#": "953",
        "Sentence": "\u201cNever had a drink before, but oh howI do enjoy it.\u201d\u201cWhat\u2019s the matter, Daisy?\u201dI was scared, I can tell you; I\u2019d never seen a girl like that before.",
        "Embedding": "[-6.5807586 -3.8356512 14.507073 ]"
    },
    "954": {
        "#": "954",
        "Sentence": "\u201cHere, dearies.\u201d She groped around in a wastebasket she had with heron the bed and pulled out the string of pearls.",
        "Embedding": "[22.093174  4.724273 29.235548]"
    },
    "955": {
        "#": "955",
        "Sentence": "\u201cTake \u2019em downstairsand give \u2019em back to whoever they belong to.",
        "Embedding": "[-2.8656996e+01 -1.6190866e-02  3.6282353e+00]"
    },
    "956": {
        "#": "956",
        "Sentence": "Tell \u2019em all Daisy\u2019schange\u2019 her mine.",
        "Embedding": "[-27.480293   -1.2720237   1.8253864]"
    },
    "957": {
        "#": "957",
        "Sentence": "Say: \u2018Daisy\u2019s change\u2019 her mine!\u2019\u200a\u201dShe began to cry\u2014she cried and cried.",
        "Embedding": "[-23.76918    7.342424  24.137936]"
    },
    "958": {
        "#": "958",
        "Sentence": "I rushed out and found hermother\u2019s maid, and we locked the door and got her into a cold bath.",
        "Embedding": "[ 12.054598  14.662254 -10.467487]"
    },
    "959": {
        "#": "959",
        "Sentence": "She wouldn\u2019t let go of the letter.",
        "Embedding": "[-21.208567 -22.205345  15.210362]"
    },
    "960": {
        "#": "960",
        "Sentence": "She took it into the tub with herand squeezed it up in a wet ball, and only let me leave it in thesoap-dish when she saw that it was coming to pieces like snow.",
        "Embedding": "[16.84015   -1.0080231 24.370188 ]"
    },
    "961": {
        "#": "961",
        "Sentence": "But she didn\u2019t say another word.",
        "Embedding": "[-24.151428 -36.236824   6.067492]"
    },
    "962": {
        "#": "962",
        "Sentence": "We gave her spirits of ammonia andput ice on her forehead and hooked her back into her dress, and halfan hour later, when we walked out of the room, the pearls were aroundher neck and the incident was over.",
        "Embedding": "[22.696358   2.3780928 28.452372 ]"
    },
    "963": {
        "#": "963",
        "Sentence": "Next day at five o\u2019clock shemarried Tom Buchanan without so much as a shiver, and started off on athree months\u2019 trip to the South Seas.",
        "Embedding": "[15.378145 23.728186  5.590656]"
    },
    "964": {
        "#": "964",
        "Sentence": "I saw them in Santa Barbara when they came back, and I thought I\u2019dnever seen a girl so mad about her husband.",
        "Embedding": "[ 26.994682  21.35192  -17.268888]"
    },
    "965": {
        "#": "965",
        "Sentence": "If he left the room for aminute she\u2019d look around uneasily, and say: \u201cWhere\u2019s Tom gone?\u201d andwear the most abstracted expression until she saw him coming in thedoor.",
        "Embedding": "[ 6.955125 21.213665 22.253593]"
    },
    "966": {
        "#": "966",
        "Sentence": "She used to sit on the sand with his head in her lap by thehour, rubbing her fingers over his eyes and looking at him withunfathomable delight.",
        "Embedding": "[ 18.13461  -13.699293  21.486704]"
    },
    "967": {
        "#": "967",
        "Sentence": "It was touching to see them together\u2014it made youlaugh in a hushed, fascinated way.",
        "Embedding": "[ 30.886314 -14.883559 -20.924881]"
    },
    "968": {
        "#": "968",
        "Sentence": "That was in August.",
        "Embedding": "[-34.07661  -22.006744 -11.860746]"
    },
    "969": {
        "#": "969",
        "Sentence": "A week after Ileft Santa Barbara Tom ran into a wagon on the Ventura road one night,and ripped a front wheel off his car.",
        "Embedding": "[ 24.93357   20.16012  -20.184618]"
    },
    "970": {
        "#": "970",
        "Sentence": "The girl who was with him gotinto the papers, too, because her arm was broken\u2014she was one of thechambermaids in the Santa Barbara Hotel.",
        "Embedding": "[ 27.03942   21.339752 -20.256016]"
    },
    "971": {
        "#": "971",
        "Sentence": "The next April Daisy had her little girl, and they went to France fora year.",
        "Embedding": "[-12.15943   18.769672  32.71232 ]"
    },
    "972": {
        "#": "972",
        "Sentence": "I saw them one spring in Cannes, and later in Deauville, andthen they came back to Chicago to settle down.",
        "Embedding": "[ 28.344296  20.371763 -11.153134]"
    },
    "973": {
        "#": "973",
        "Sentence": "Daisy was popular inChicago, as you know.",
        "Embedding": "[-15.163162  12.859277  29.358267]"
    },
    "974": {
        "#": "974",
        "Sentence": "They moved with a fast crowd, all of them youngand rich and wild, but she came out with an absolutely perfectreputation.",
        "Embedding": "[-3.4040847 -1.5588365 38.25278  ]"
    },
    "975": {
        "#": "975",
        "Sentence": "Perhaps because she doesn\u2019t drink.",
        "Embedding": "[-15.969608 -17.321991   8.428242]"
    },
    "976": {
        "#": "976",
        "Sentence": "It\u2019s a great advantagenot to drink among hard-drinking people.",
        "Embedding": "[ -1.815589 -15.437354 -27.428215]"
    },
    "977": {
        "#": "977",
        "Sentence": "You can hold your tongue and,moreover, you can time any little irregularity of your own so thateverybody else is so blind that they don\u2019t see or care.",
        "Embedding": "[ -6.621931  -1.722886 -25.24723 ]"
    },
    "978": {
        "#": "978",
        "Sentence": "Perhaps Daisynever went in for amour at all\u2014and yet there\u2019s something in that voiceof hers \u2026Well, about six weeks ago, she heard the name Gatsby for the firsttime in years.",
        "Embedding": "[-2.7816565 29.915941  10.466544 ]"
    },
    "979": {
        "#": "979",
        "Sentence": "It was when I asked you\u2014do you remember?\u2014if you knewGatsby in West Egg.",
        "Embedding": "[  1.7037191  16.53184   -25.89703  ]"
    },
    "980": {
        "#": "980",
        "Sentence": "After you had gone home she came into my room andwoke me up, and said: \u201cWhat Gatsby?\u201d and when I described him\u2014I washalf asleep\u2014she said in the strangest voice that it must be the manshe used to know.",
        "Embedding": "[ 8.911663  12.110946  -6.1596527]"
    },
    "981": {
        "#": "981",
        "Sentence": "It wasn\u2019t until then that I connected this Gatsbywith the officer in her white car.",
        "Embedding": "[ 16.22926  -11.472267 -25.694965]"
    },
    "982": {
        "#": "982",
        "Sentence": "When Jordan Baker had finished telling all this we had left the Plazafor half an hour and were driving in a victoria through Central Park.",
        "Embedding": "[15.204693  14.788442   3.5719757]"
    },
    "983": {
        "#": "983",
        "Sentence": "The sun had gone down behind the tall apartments of the movie stars inthe West Fifties, and the clear voices of children, already gatheredlike crickets on the grass, rose through the hot twilight: \u201cI\u2019m the Sheik of Araby.",
        "Embedding": "[27.126118 25.30924  14.535395]"
    },
    "984": {
        "#": "984",
        "Sentence": "Your love belongs to me.",
        "Embedding": "[-25.48395     2.5688457  13.57475  ]"
    },
    "985": {
        "#": "985",
        "Sentence": "At night when you\u2019re asleep Into your tent I\u2019ll creep\u2014\u201d\n\u201cIt was a strange coincidence,\u201d I said.",
        "Embedding": "[  9.367561 -38.473732  17.978117]"
    },
    "986": {
        "#": "986",
        "Sentence": "\u201cBut it wasn\u2019t a coincidence at all.\u201d\u201cWhy not?\u201d\u201cGatsby bought that house so that Daisy would be just across the bay.\u201dThen it had not been merely the stars to which he had aspired on thatJune night.",
        "Embedding": "[-2.2107155 -1.2357363 28.685265 ]"
    },
    "987": {
        "#": "987",
        "Sentence": "He came alive to me, delivered suddenly from the womb ofhis purposeless splendour.",
        "Embedding": "[ 20.514944 -19.038363  -8.788509]"
    },
    "988": {
        "#": "988",
        "Sentence": "\u201cHe wants to know,\u201d continued Jordan, \u201cif you\u2019ll invite Daisy to yourhouse some afternoon and then let him come over.\u201dThe modesty of the demand shook me.",
        "Embedding": "[-0.09700436 14.0310955  25.181595  ]"
    },
    "989": {
        "#": "989",
        "Sentence": "He had waited five years andbought a mansion where he dispensed starlight to casual moths\u2014so thathe could \u201ccome over\u201d some afternoon to a stranger\u2019s garden.",
        "Embedding": "[22.000463 19.33057   6.594545]"
    },
    "990": {
        "#": "990",
        "Sentence": "\u201cDid I have to know all this before he could ask such a little thing?\u201d\u201cHe\u2019s afraid, he\u2019s waited so long.",
        "Embedding": "[ -7.213662 -17.198828 -16.830296]"
    },
    "991": {
        "#": "991",
        "Sentence": "He thought you might beoffended.",
        "Embedding": "[-17.563454 -22.990156  -3.524489]"
    },
    "992": {
        "#": "992",
        "Sentence": "You see, he\u2019s regular tough underneath it all.\u201dSomething worried me.",
        "Embedding": "[ -8.513187 -14.548927 -12.75741 ]"
    },
    "993": {
        "#": "993",
        "Sentence": "\u201cWhy didn\u2019t he ask you to arrange a meeting?\u201d\u201cHe wants her to see his house,\u201d she explained.",
        "Embedding": "[-14.900426   5.725313  12.523103]"
    },
    "994": {
        "#": "994",
        "Sentence": "\u201cAnd your house isright next door.\u201d\u201cOh!\u201d\u201cI think he half expected her to wander into one of his parties, somenight,\u201d went on Jordan, \u201cbut she never did.",
        "Embedding": "[ 2.8852177  9.630716  27.029184 ]"
    },
    "995": {
        "#": "995",
        "Sentence": "Then he began askingpeople casually if they knew her, and I was the first one he found.",
        "Embedding": "[ -5.345055 -26.133339  19.131693]"
    },
    "996": {
        "#": "996",
        "Sentence": "it was that night he sent for me at his dance, and you should have heardthe elaborate way he worked up to it.",
        "Embedding": "[  7.752567  -10.333595    1.0883453]"
    },
    "997": {
        "#": "997",
        "Sentence": "Of course, I immediatelysuggested a luncheon in New York\u2014and I thought he\u2019d go mad:\u201c\u200a\u2018I don\u2019t want to do anything out of the way!\u2019 he kept saying.",
        "Embedding": "[-2.6713593 -3.2586453 -8.76127  ]"
    },
    "998": {
        "#": "998",
        "Sentence": "\u2018Iwant to see her right next door.\u2019\u201cWhen I said you were a particular friend of Tom\u2019s, he started toabandon the whole idea.",
        "Embedding": "[-17.595886   14.002508    1.1372324]"
    },
    "999": {
        "#": "999",
        "Sentence": "He doesn\u2019t know very much about Tom, though he says he\u2019s read a Chicago paper for years just on the chance ofcatching a glimpse of Daisy\u2019s name.\u201dIt was dark now, and as we dipped under a little bridge I put my armaround Jordan\u2019s golden shoulder and drew her toward me and asked herto dinner.",
        "Embedding": "[ 2.1313787 21.38973    2.926446 ]"
    },
    "1000": {
        "#": "1000",
        "Sentence": "Suddenly I wasn\u2019t thinking of Daisy and Gatsby any more,but of this clean, hard, limited person, who dealt in universalscepticism, and who leaned back jauntily just within the circle of myarm.",
        "Embedding": "[ 6.773858  30.22931    5.1003985]"
    },
    "1001": {
        "#": "1001",
        "Sentence": "A phrase began to beat in my ears with a sort of headyexcitement: \u201cThere are only the pursued, the pursuing, the busy, andthe tired.\u201d\u201cAnd Daisy ought to have something in her life,\u201d murmured Jordan tome.",
        "Embedding": "[-3.9209356 11.820625  21.472332 ]"
    },
    "1002": {
        "#": "1002",
        "Sentence": "\u201cDoes she want to see Gatsby?\u201d\u201cShe\u2019s not to know about it.",
        "Embedding": "[-24.49826   -9.907007   5.863214]"
    },
    "1003": {
        "#": "1003",
        "Sentence": "Gatsby doesn\u2019t want her to know.",
        "Embedding": "[-3.519278  37.22846    3.9410074]"
    },
    "1004": {
        "#": "1004",
        "Sentence": "You\u2019rejust supposed to invite her to tea.\u201dWe passed a barrier of dark trees, and then the fa\u00e7ade of Fifty-NinthStreet, a block of delicate pale light, beamed down into the park.",
        "Embedding": "[28.649982   6.9550586  8.69467  ]"
    },
    "1005": {
        "#": "1005",
        "Sentence": "Unlike Gatsby and Tom Buchanan, I had no girl whose disembodied facefloated along the dark cornices and blinding signs, and so I drew upthe girl beside me, tightening my arms.",
        "Embedding": "[ 8.482977 34.0855   13.889885]"
    },
    "1006": {
        "#": "1006",
        "Sentence": "Her wan, scornful mouthsmiled, and so I drew her up again closer, this time to my face.",
        "Embedding": "[-22.18304  -10.058494  22.196585]"
    },
    "1007": {
        "#": "1007",
        "Sentence": "VWhen I came home to West Egg that night I was afraid for a moment thatmy house was on fire.",
        "Embedding": "[ 31.606283     0.38298535 -22.18576   ]"
    },
    "1008": {
        "#": "1008",
        "Sentence": "Two o\u2019clock and the whole corner of thepeninsula was blazing with light, which fell unreal on the shrubberyand made thin elongating glints upon the roadside wires.",
        "Embedding": "[32.11212    8.051826   1.9014478]"
    },
    "1009": {
        "#": "1009",
        "Sentence": "Turning acorner, I saw that it was Gatsby\u2019s house, lit from tower to cellar.",
        "Embedding": "[ 32.222977  27.84715  -12.525662]"
    },
    "1010": {
        "#": "1010",
        "Sentence": "At first I thought it was another party, a wild rout that had resolveditself into \u201chide-and-go-seek\u201d or \u201csardines-in-the-box\u201d with all thehouse thrown open to the game.",
        "Embedding": "[ 8.539009 27.798035  6.094166]"
    },
    "1011": {
        "#": "1011",
        "Sentence": "But there wasn\u2019t a sound.",
        "Embedding": "[-23.110119   -39.734234     0.72269565]"
    },
    "1012": {
        "#": "1012",
        "Sentence": "Only wind inthe trees, which blew the wires and made the lights go off and onagain as if the house had winked into the darkness.",
        "Embedding": "[33.191097  0.527909 15.653988]"
    },
    "1013": {
        "#": "1013",
        "Sentence": "As my taxi groanedaway I saw Gatsby walking toward me across his lawn.",
        "Embedding": "[12.794867 25.250109 -9.059687]"
    },
    "1014": {
        "#": "1014",
        "Sentence": "\u201cYour place looks like the World\u2019s Fair,\u201d I said.",
        "Embedding": "[-21.559113  12.586069 -25.409674]"
    },
    "1015": {
        "#": "1015",
        "Sentence": "\u201cDoes it?\u201d He turned his eyes toward it absently.",
        "Embedding": "[ -9.016234 -25.408955  -8.530739]"
    },
    "1016": {
        "#": "1016",
        "Sentence": "\u201cI have beenglancing into some of the rooms.",
        "Embedding": "[-25.86642   -9.716999 -24.46603 ]"
    },
    "1017": {
        "#": "1017",
        "Sentence": "Let\u2019s go to Coney Island, oldsport.",
        "Embedding": "[ -4.7430134  29.587687  -20.965622 ]"
    },
    "1018": {
        "#": "1018",
        "Sentence": "In my car.\u201d\u201cIt\u2019s too late.\u201d\u201cWell, suppose we take a plunge in the swimming pool?",
        "Embedding": "[ 19.065477  22.113365 -12.775105]"
    },
    "1019": {
        "#": "1019",
        "Sentence": "I haven\u2019t madeuse of it all summer.\u201d\u201cI\u2019ve got to go to bed.\u201d\u201cAll right.\u201dHe waited, looking at me with suppressed eagerness.",
        "Embedding": "[  2.3583605 -16.556852   -7.68287  ]"
    },
    "1020": {
        "#": "1020",
        "Sentence": "\u201cI talked with Miss Baker,\u201d I said after a moment.",
        "Embedding": "[-3.2241263  5.410572   5.805214 ]"
    },
    "1021": {
        "#": "1021",
        "Sentence": "\u201cI\u2019m going to callup Daisy tomorrow and invite her over here to tea.\u201d\u201cOh, that\u2019s all right,\u201d he said carelessly.",
        "Embedding": "[-13.786602   9.668817  22.455387]"
    },
    "1022": {
        "#": "1022",
        "Sentence": "\u201cI don\u2019t want to put youto any trouble.\u201d\u201cWhat day would suit you?\u201d\u201cWhat day would suit you?\u201d he corrected me quickly.",
        "Embedding": "[-17.160387   7.730105 -15.477424]"
    },
    "1023": {
        "#": "1023",
        "Sentence": "\u201cI don\u2019t want toput you to any trouble, you see.\u201d\u201cHow about the day after tomorrow?\u201dHe considered for a moment.",
        "Embedding": "[-15.444866    6.2713733 -16.961386 ]"
    },
    "1024": {
        "#": "1024",
        "Sentence": "Then, with reluctance: \u201cI want to get thegrass cut,\u201d he said.",
        "Embedding": "[ -9.856894  -22.34043     6.6584277]"
    },
    "1025": {
        "#": "1025",
        "Sentence": "We both looked down at the grass\u2014there was a sharp line where myragged lawn ended and the darker, well-kept expanse of his began.",
        "Embedding": "[30.328901   10.870909    0.21457843]"
    },
    "1026": {
        "#": "1026",
        "Sentence": "Isuspected that he meant my grass.",
        "Embedding": "[ 12.938908  24.221973 -18.40088 ]"
    },
    "1027": {
        "#": "1027",
        "Sentence": "\u201cThere\u2019s another little thing,\u201d he said uncertainly, and hesitated.",
        "Embedding": "[-15.508534 -23.128687  -9.834517]"
    },
    "1028": {
        "#": "1028",
        "Sentence": "\u201cWould you rather put it off for a few days?\u201d I asked.",
        "Embedding": "[-12.653053  10.592031 -16.323675]"
    },
    "1029": {
        "#": "1029",
        "Sentence": "\u201cOh, it isn\u2019t about that.",
        "Embedding": "[-35.548214 -14.899412  -6.424529]"
    },
    "1030": {
        "#": "1030",
        "Sentence": "At least\u2014\u201d He fumbled with a series ofbeginnings.",
        "Embedding": "[-12.793016 -35.143623  -9.842121]"
    },
    "1031": {
        "#": "1031",
        "Sentence": "\u201cWhy, I thought\u2014why, look here, old sport, you don\u2019t makemuch money, do you?\u201d\u201cNot very much.\u201dThis seemed to reassure him and he continued more confidently.",
        "Embedding": "[-5.7254877  4.1151533 -7.092394 ]"
    },
    "1032": {
        "#": "1032",
        "Sentence": "\u201cI thought you didn\u2019t, if you\u2019ll pardon my\u2014you see, I carry on alittle business on the side, a sort of side line, you understand.",
        "Embedding": "[-10.057743    3.8760726 -17.17413  ]"
    },
    "1033": {
        "#": "1033",
        "Sentence": "AndI thought that if you don\u2019t make very much\u2014You\u2019re selling bonds,aren\u2019t you, old sport?\u201d\u201cTrying to.\u201d\u201cWell, this would interest you.",
        "Embedding": "[-16.841686  13.436772 -19.35028 ]"
    },
    "1034": {
        "#": "1034",
        "Sentence": "It wouldn\u2019t take up much of your timeand you might pick up a nice bit of money.",
        "Embedding": "[-19.52413   10.395719 -18.086237]"
    },
    "1035": {
        "#": "1035",
        "Sentence": "It happens to be a ratherconfidential sort of thing.\u201dI realize now that under different circumstances that conversationmight have been one of the crises of my life.",
        "Embedding": "[ -1.826992  -14.945591   -0.6697919]"
    },
    "1036": {
        "#": "1036",
        "Sentence": "But, because the offerwas obviously and tactlessly for a service to be rendered, I had nochoice except to cut him off there.",
        "Embedding": "[ -2.5949106 -30.136393   11.70135  ]"
    },
    "1037": {
        "#": "1037",
        "Sentence": "\u201cI\u2019ve got my hands full,\u201d I said.",
        "Embedding": "[-26.229445  -1.469259 -17.6402  ]"
    },
    "1038": {
        "#": "1038",
        "Sentence": "\u201cI\u2019m much obliged but I couldn\u2019ttake on any more work.\u201d\u201cYou wouldn\u2019t have to do any business with Wolfshiem.\u201d Evidently hethought that I was shying away from the \u201cgonnegtion\u201d mentioned atlunch, but I assured him he was wrong.",
        "Embedding": "[-1.076176  -4.6422434 -7.081906 ]"
    },
    "1039": {
        "#": "1039",
        "Sentence": "He waited a moment longer,hoping I\u2019d begin a conversation, but I was too absorbed to beresponsive, so he went unwillingly home.",
        "Embedding": "[  6.6746664 -11.353266   -9.522509 ]"
    },
    "1040": {
        "#": "1040",
        "Sentence": "The evening had made me lightheaded and happy; I think I walked into adeep sleep as I entered my front door.",
        "Embedding": "[ 32.415504  -6.045766 -16.00088 ]"
    },
    "1041": {
        "#": "1041",
        "Sentence": "So I don\u2019t know whether or notGatsby went to Coney Island, or for how many hours he \u201cglanced intorooms\u201d while his house blazed gaudily on.",
        "Embedding": "[  6.6199083  26.905848  -20.989634 ]"
    },
    "1042": {
        "#": "1042",
        "Sentence": "I called up Daisy from theoffice next morning, and invited her to come to tea.",
        "Embedding": "[ 0.51200926 15.677583   30.147518  ]"
    },
    "1043": {
        "#": "1043",
        "Sentence": "\u201cDon\u2019t bring Tom,\u201d I warned her.",
        "Embedding": "[-22.292204   18.055899    1.8309498]"
    },
    "1044": {
        "#": "1044",
        "Sentence": "\u201cWhat?\u201d\u201cDon\u2019t bring Tom.\u201d\u201cWho is \u2018Tom\u2019?\u201d she asked innocently.",
        "Embedding": "[-21.984287   19.148972    4.6133366]"
    },
    "1045": {
        "#": "1045",
        "Sentence": "The day agreed upon was pouring rain.",
        "Embedding": "[43.814404  -9.794312   1.6232457]"
    },
    "1046": {
        "#": "1046",
        "Sentence": "At eleven o\u2019clock a man in araincoat, dragging a lawn-mower, tapped at my front door and said thatMr. Gatsby had sent him over to cut my grass.",
        "Embedding": "[ 12.895618  23.295218 -12.43153 ]"
    },
    "1047": {
        "#": "1047",
        "Sentence": "This reminded me that Ihad forgotten to tell my Finn to come back, so I drove into West EggVillage to search for her among soggy whitewashed alleys and to buysome cups and lemons and flowers.",
        "Embedding": "[24.961851  17.087982  -4.8740206]"
    },
    "1048": {
        "#": "1048",
        "Sentence": "The flowers were unnecessary, for at two o\u2019clock a greenhouse arrivedfrom Gatsby\u2019s, with innumerable receptacles to contain it.",
        "Embedding": "[18.520151 19.670866 22.952417]"
    },
    "1049": {
        "#": "1049",
        "Sentence": "An hourlater the front door opened nervously, and Gatsby in a white flannelsuit, silver shirt, and gold-coloured tie, hurried in.",
        "Embedding": "[ 7.9940734 24.574682   1.3158816]"
    },
    "1050": {
        "#": "1050",
        "Sentence": "He was pale,and there were dark signs of sleeplessness beneath his eyes.",
        "Embedding": "[ 32.489822 -16.53974    5.798331]"
    },
    "1051": {
        "#": "1051",
        "Sentence": "\u201cIs everything all right?\u201d he asked immediately.",
        "Embedding": "[-19.388033   -8.922119   -2.5143168]"
    },
    "1052": {
        "#": "1052",
        "Sentence": "\u201cThe grass looks fine, if that\u2019s what you mean.\u201d\u201cWhat grass?\u201d he inquired blankly.",
        "Embedding": "[ 11.594376  26.36353  -17.968817]"
    },
    "1053": {
        "#": "1053",
        "Sentence": "\u201cOh, the grass in the yard.\u201d Helooked out the window at it, but, judging from his expression, I don\u2019tbelieve he saw a thing.",
        "Embedding": "[ 14.312132  26.100866 -17.192955]"
    },
    "1054": {
        "#": "1054",
        "Sentence": "\u201cLooks very good,\u201d he remarked vaguely.",
        "Embedding": "[-12.497986 -28.749674 -11.762988]"
    },
    "1055": {
        "#": "1055",
        "Sentence": "\u201cOne of the papers said theythought the rain would stop about four.",
        "Embedding": "[ 45.67727   -10.936826    2.5459807]"
    },
    "1056": {
        "#": "1056",
        "Sentence": "I think it was TheJournal.",
        "Embedding": "[-29.404581 -20.132288  -9.240072]"
    },
    "1057": {
        "#": "1057",
        "Sentence": "Have you got everything you need in the shape of\u2014of tea?\u201dI took him into the pantry, where he looked a little reproachfully atthe Finn.",
        "Embedding": "[ 18.29989  -15.010562 -13.837472]"
    },
    "1058": {
        "#": "1058",
        "Sentence": "Together we scrutinized the twelve lemon cakes from thedelicatessen shop.",
        "Embedding": "[38.266453  22.646399  -3.2697105]"
    },
    "1059": {
        "#": "1059",
        "Sentence": "\u201cWill they do?\u201d I asked.",
        "Embedding": "[-27.189293   -8.569609    2.5578413]"
    },
    "1060": {
        "#": "1060",
        "Sentence": "\u201cOf course, of course!",
        "Embedding": "[-44.230385   -7.8012886  -7.87365  ]"
    },
    "1061": {
        "#": "1061",
        "Sentence": "They\u2019re fine!\u201d and he added hollowly, \u201c\u2026 oldsport.\u201dThe rain cooled about half-past three to a damp mist, through whichoccasional thin drops swam like dew.",
        "Embedding": "[38.205154  -4.975525   7.2782884]"
    },
    "1062": {
        "#": "1062",
        "Sentence": "Gatsby looked with vacant eyesthrough a copy of Clay\u2019s Economics, starting at the Finnish tread thatshook the kitchen floor, and peering towards the bleared windows fromtime to time as if a series of invisible but alarming happenings weretaking place outside.",
        "Embedding": "[26.912264 17.076492  4.690042]"
    },
    "1063": {
        "#": "1063",
        "Sentence": "Finally he got up and informed me, in anuncertain voice, that he was going home.",
        "Embedding": "[ 15.809026 -29.79439   -6.685145]"
    },
    "1064": {
        "#": "1064",
        "Sentence": "\u201cWhy\u2019s that?\u201d\u201cNobody\u2019s coming to tea.",
        "Embedding": "[-36.842617    6.3390265 -18.933529 ]"
    },
    "1065": {
        "#": "1065",
        "Sentence": "It\u2019s too late!\u201d He looked at his watch as ifthere was some pressing demand on his time elsewhere.",
        "Embedding": "[ 14.838958  -13.672188   -1.4676052]"
    },
    "1066": {
        "#": "1066",
        "Sentence": "\u201cI can\u2019t waitall day.\u201d\u201cDon\u2019t be silly; it\u2019s just two minutes to four.\u201dHe sat down miserably, as if I had pushed him, and simultaneouslythere was the sound of a motor turning into my lane.",
        "Embedding": "[ 10.121084   2.700819 -13.976496]"
    },
    "1067": {
        "#": "1067",
        "Sentence": "We both jumpedup, and, a little harrowed myself, I went out into the yard.",
        "Embedding": "[ -2.3309896 -45.721302    4.0897326]"
    },
    "1068": {
        "#": "1068",
        "Sentence": "Under the dripping bare lilac-trees a large open car was coming up thedrive.",
        "Embedding": "[35.186497   -0.48976764 -3.0104592 ]"
    },
    "1069": {
        "#": "1069",
        "Sentence": "It stopped.",
        "Embedding": "[-29.203867 -30.597073  -5.330065]"
    },
    "1070": {
        "#": "1070",
        "Sentence": "Daisy\u2019s face, tipped sideways beneath athree-cornered lavender hat, looked out at me with a bright ecstaticsmile.",
        "Embedding": "[ 4.848084 20.855701  4.723999]"
    },
    "1071": {
        "#": "1071",
        "Sentence": "\u201cIs this absolutely where you live, my dearest one?\u201dThe exhilarating ripple of her voice was a wild tonic in the rain.",
        "Embedding": "[17.649757 -9.573969 37.89839 ]"
    },
    "1072": {
        "#": "1072",
        "Sentence": "Ihad to follow the sound of it for a moment, up and down, with my earalone, before any words came through.",
        "Embedding": "[37.850403 -9.062862 23.869604]"
    },
    "1073": {
        "#": "1073",
        "Sentence": "A damp streak of hair lay like adash of blue paint across her cheek, and her hand was wet withglistening drops as I took it to help her from the car.",
        "Embedding": "[15.582678   1.5113274 24.445183 ]"
    },
    "1074": {
        "#": "1074",
        "Sentence": "\u201cAre you in love with me,\u201d she said low in my ear, \u201cor why did I haveto come alone?\u201d\u201cThat\u2019s the secret of Castle Rackrent.",
        "Embedding": "[-17.65442      0.81756693  13.617257  ]"
    },
    "1075": {
        "#": "1075",
        "Sentence": "Tell your chauffeur to go faraway and spend an hour.\u201d\u201cCome back in an hour, Ferdie.\u201d Then in a grave murmur: \u201cHis name isFerdie.\u201d\u201cDoes the gasoline affect his nose?\u201d\u201cI don\u2019t think so,\u201d she said innocently.",
        "Embedding": "[ 9.975782 -9.521792 12.622576]"
    },
    "1076": {
        "#": "1076",
        "Sentence": "\u201cWhy?\u201dWe went in.",
        "Embedding": "[-33.278534 -28.531322 -17.242931]"
    },
    "1077": {
        "#": "1077",
        "Sentence": "To my overwhelming surprise the living-room was deserted.",
        "Embedding": "[ 13.880015 -18.70673  -19.543497]"
    },
    "1078": {
        "#": "1078",
        "Sentence": "\u201cWell, that\u2019s funny,\u201d I exclaimed.",
        "Embedding": "[-30.30427   -6.837075  -6.874243]"
    },
    "1079": {
        "#": "1079",
        "Sentence": "\u201cWhat\u2019s funny?\u201dShe turned her head as there was a light dignified knocking at thefront door.",
        "Embedding": "[ 13.624729 -26.9642   -18.044397]"
    },
    "1080": {
        "#": "1080",
        "Sentence": "I went out and opened it.",
        "Embedding": "[-31.104723 -14.182308 -20.46795 ]"
    },
    "1081": {
        "#": "1081",
        "Sentence": "Gatsby, pale as death, with hishands plunged like weights in his coat pockets, was standing in apuddle of water glaring tragically into my eyes.",
        "Embedding": "[10.790686 38.781075 10.842226]"
    },
    "1082": {
        "#": "1082",
        "Sentence": "With his hands still in his coat pockets he stalked by me into thehall, turned sharply as if he were on a wire, and disappeared into theliving-room.",
        "Embedding": "[18.604647   0.6000304 10.799267 ]"
    },
    "1083": {
        "#": "1083",
        "Sentence": "It wasn\u2019t a bit funny.",
        "Embedding": "[-25.135712  -24.26046    -6.2016864]"
    },
    "1084": {
        "#": "1084",
        "Sentence": "Aware of the loud beating of myown heart I pulled the door to against the increasing rain.",
        "Embedding": "[39.57393  -9.298467 16.91903 ]"
    },
    "1085": {
        "#": "1085",
        "Sentence": "For half a minute there wasn\u2019t a sound.",
        "Embedding": "[-21.8972     -38.131718    -0.09682555]"
    },
    "1086": {
        "#": "1086",
        "Sentence": "Then from the living-room Iheard a sort of choking murmur and part of a laugh, followed byDaisy\u2019s voice on a clear artificial note:\u201cI certainly am awfully glad to see you again.\u201dA pause; it endured horribly.",
        "Embedding": "[34.005104  -7.0087757 21.631895 ]"
    },
    "1087": {
        "#": "1087",
        "Sentence": "I had nothing to do in the hall, so Iwent into the room.",
        "Embedding": "[ 10.944341 -14.914433 -15.015398]"
    },
    "1088": {
        "#": "1088",
        "Sentence": "Gatsby, his hands still in his pockets, was reclining against themantelpiece in a strained counterfeit of perfect ease, even ofboredom.",
        "Embedding": "[12.305338 38.936966  9.427017]"
    },
    "1089": {
        "#": "1089",
        "Sentence": "His head leaned back so far that it rested against the faceof a defunct mantelpiece clock, and from this position his distraughteyes stared down at Daisy, who was sitting, frightened but graceful,on the edge of a stiff chair.",
        "Embedding": "[19.81005   -7.4106126 16.72959  ]"
    },
    "1090": {
        "#": "1090",
        "Sentence": "\u201cWe\u2019ve met before,\u201d muttered Gatsby.",
        "Embedding": "[-4.755529   36.159412    0.27667016]"
    },
    "1091": {
        "#": "1091",
        "Sentence": "His eyes glanced momentarily atme, and his lips parted with an abortive attempt at a laugh.",
        "Embedding": "[ 28.064285 -21.99742    9.882352]"
    },
    "1092": {
        "#": "1092",
        "Sentence": "Luckilythe clock took this moment to tilt dangerously at the pressure of hishead, whereupon he turned and caught it with trembling fingers, andset it back in place.",
        "Embedding": "[21.220804 -8.708316 20.176617]"
    },
    "1093": {
        "#": "1093",
        "Sentence": "Then he sat down, rigidly, his elbow on the armof the sofa and his chin in his hand.",
        "Embedding": "[ 22.561535 -16.02803   22.527336]"
    },
    "1094": {
        "#": "1094",
        "Sentence": "\u201cI\u2019m sorry about the clock,\u201d he said.",
        "Embedding": "[ -8.993134 -11.647346 -24.92006 ]"
    },
    "1095": {
        "#": "1095",
        "Sentence": "My own face had now assumed a deep tropical burn.",
        "Embedding": "[ 16.029196 -32.554317  19.577353]"
    },
    "1096": {
        "#": "1096",
        "Sentence": "I couldn\u2019t muster upa single commonplace out of the thousand in my head.",
        "Embedding": "[ -3.9309387 -16.23736    -8.199028 ]"
    },
    "1097": {
        "#": "1097",
        "Sentence": "\u201cIt\u2019s an old clock,\u201d I told them idiotically.",
        "Embedding": "[ -7.9847794 -13.381864  -24.657293 ]"
    },
    "1098": {
        "#": "1098",
        "Sentence": "I think we all believed for a moment that it had smashed in pieces onthe floor.",
        "Embedding": "[ 13.589748 -30.814096  17.972414]"
    },
    "1099": {
        "#": "1099",
        "Sentence": "\u201cWe haven\u2019t met for many years,\u201d said Daisy, her voice asmatter-of-fact as it could ever be.",
        "Embedding": "[-11.221199  13.410616  30.260294]"
    },
    "1100": {
        "#": "1100",
        "Sentence": "\u201cFive years next November.\u201dThe automatic quality of Gatsby\u2019s answer set us all back at leastanother minute.",
        "Embedding": "[ -1.539125    2.8596823 -36.950123 ]"
    },
    "1101": {
        "#": "1101",
        "Sentence": "I had them both on their feet with the desperatesuggestion that they help me make tea in the kitchen when the demoniacFinn brought it in on a tray.",
        "Embedding": "[ 10.327335  18.203594 -15.924559]"
    },
    "1102": {
        "#": "1102",
        "Sentence": "Amid the welcome confusion of cups and cakes a certain physicaldecency established itself.",
        "Embedding": "[37.562325  21.562225   2.4694972]"
    },
    "1103": {
        "#": "1103",
        "Sentence": "Gatsby got himself into a shadow and,while Daisy and I talked, looked conscientiously from one to the otherof us with tense, unhappy eyes.",
        "Embedding": "[ 6.2020426 34.5892     9.797338 ]"
    },
    "1104": {
        "#": "1104",
        "Sentence": "However, as calmness wasn\u2019t an end initself, I made an excuse at the first possible moment, and got to myfeet.",
        "Embedding": "[  4.563832  -9.405554 -10.847551]"
    },
    "1105": {
        "#": "1105",
        "Sentence": "\u201cWhere are you going?\u201d demanded Gatsby in immediate alarm.",
        "Embedding": "[-14.476084  37.370007  -4.370619]"
    },
    "1106": {
        "#": "1106",
        "Sentence": "\u201cI\u2019ll be back.\u201d\u201cI\u2019ve got to speak to you about something before you go.\u201dHe followed me wildly into the kitchen, closed the door, andwhispered: \u201cOh, God!\u201d in a miserable way.",
        "Embedding": "[  7.386463 -13.771544 -15.465277]"
    },
    "1107": {
        "#": "1107",
        "Sentence": "\u201cWhat\u2019s the matter?\u201d\u201cThis is a terrible mistake,\u201d he said, shaking his head from side toside, \u201ca terrible, terrible mistake.\u201d\u201cYou\u2019re just embarrassed, that\u2019s all,\u201d and luckily I added: \u201cDaisy\u2019sembarrassed too.\u201d\u201cShe\u2019s embarrassed?\u201d he repeated incredulously.",
        "Embedding": "[ 6.188003   1.1161848 -2.8918793]"
    },
    "1108": {
        "#": "1108",
        "Sentence": "\u201cJust as much as you are.\u201d\u201cDon\u2019t talk so loud.\u201d\u201cYou\u2019re acting like a little boy,\u201d I broke out impatiently.",
        "Embedding": "[  5.2888746 -11.44154   -16.763258 ]"
    },
    "1109": {
        "#": "1109",
        "Sentence": "\u201cNot onlythat, but you\u2019re rude.",
        "Embedding": "[-27.984104     0.09173369 -26.820341  ]"
    },
    "1110": {
        "#": "1110",
        "Sentence": "Daisy\u2019s sitting in there all alone.\u201dHe raised his hand to stop my words, looked at me with unforgettablereproach, and, opening the door cautiously, went back into the otherroom.",
        "Embedding": "[12.237091   -0.37378174  7.3704195 ]"
    },
    "1111": {
        "#": "1111",
        "Sentence": "I walked out the back way\u2014just as Gatsby had when he had made hisnervous circuit of the house half an hour before\u2014and ran for a hugeblack knotted tree, whose massed leaves made a fabric against therain.",
        "Embedding": "[15.620504  30.431482   2.0415366]"
    },
    "1112": {
        "#": "1112",
        "Sentence": "Once more it was pouring, and my irregular lawn, well-shaved byGatsby\u2019s gardener, abounded in small muddy swamps and prehistoricmarshes.",
        "Embedding": "[36.380116  18.814716   3.3842187]"
    },
    "1113": {
        "#": "1113",
        "Sentence": "There was nothing to look at from under the tree exceptGatsby\u2019s enormous house, so I stared at it, like Kant at his churchsteeple, for half an hour.",
        "Embedding": "[ 7.1910195  5.3143344 -6.837633 ]"
    },
    "1114": {
        "#": "1114",
        "Sentence": "A brewer had built it early in the \u201cperiod\u201dcraze, a decade before, and there was a story that he\u2019d agreed to payfive years\u2019 taxes on all the neighbouring cottages if the owners wouldhave their roofs thatched with straw.",
        "Embedding": "[19.953327  16.969378   7.7892723]"
    },
    "1115": {
        "#": "1115",
        "Sentence": "Perhaps their refusal took theheart out of his plan to Found a Family\u2014he went into an immediatedecline.",
        "Embedding": "[  4.0361257 -21.606941   16.34207  ]"
    },
    "1116": {
        "#": "1116",
        "Sentence": "His children sold his house with the black wreath still onthe door.",
        "Embedding": "[23.802916 25.22961  -7.46718 ]"
    },
    "1117": {
        "#": "1117",
        "Sentence": "Americans, while willing, even eager, to be serfs, havealways been obstinate about being peasantry.",
        "Embedding": "[ 14.196374  13.676907 -29.062998]"
    },
    "1118": {
        "#": "1118",
        "Sentence": "After half an hour, the sun shone again, and the grocer\u2019s automobilerounded Gatsby\u2019s drive with the raw material for his servants\u2019dinner\u2014I felt sure he wouldn\u2019t eat a spoonful.",
        "Embedding": "[19.164036  29.544502   0.6705851]"
    },
    "1119": {
        "#": "1119",
        "Sentence": "A maid began opening the upper windows of his house, appeared momentarily in each, and,leaning from the large central bay, spat meditatively into thegarden.",
        "Embedding": "[42.87098  13.375727  6.345288]"
    },
    "1120": {
        "#": "1120",
        "Sentence": "It was time I went back.",
        "Embedding": "[-28.835802 -17.738914 -16.377048]"
    },
    "1121": {
        "#": "1121",
        "Sentence": "While the rain continued it hadseemed like the murmur of their voices, rising and swelling a littlenow and then with gusts of emotion.",
        "Embedding": "[31.233162  -4.1391315 22.811768 ]"
    },
    "1122": {
        "#": "1122",
        "Sentence": "But in the new silence I felt thatsilence had fallen within the house too.",
        "Embedding": "[-18.5136    -44.964226   -1.1502391]"
    },
    "1123": {
        "#": "1123",
        "Sentence": "I went in\u2014after making every possible noise in the kitchen, short ofpushing over the stove\u2014but I don\u2019t believe they heard a sound.",
        "Embedding": "[38.42378   -4.6525035 22.823614 ]"
    },
    "1124": {
        "#": "1124",
        "Sentence": "Theywere sitting at either end of the couch, looking at each other as ifsome question had been asked, or was in the air, and every vestige ofembarrassment was gone.",
        "Embedding": "[32.524933   -0.45718688 31.19957   ]"
    },
    "1125": {
        "#": "1125",
        "Sentence": "Daisy\u2019s face was smeared with tears, and whenI came in she jumped up and began wiping at it with her handkerchiefbefore a mirror.",
        "Embedding": "[15.408291   3.0086598 27.883558 ]"
    },
    "1126": {
        "#": "1126",
        "Sentence": "But there was a change in Gatsby that was simplyconfounding.",
        "Embedding": "[-8.628496  41.52229   -1.4265678]"
    },
    "1127": {
        "#": "1127",
        "Sentence": "He literally glowed; without a word or a gesture ofexultation a new well-being radiated from him and filled the littleroom.",
        "Embedding": "[ 13.430328 -19.952047  17.632332]"
    },
    "1128": {
        "#": "1128",
        "Sentence": "\u201cOh, hello, old sport,\u201d he said, as if he hadn\u2019t seen me for years.",
        "Embedding": "[-15.242489  20.53396  -16.135096]"
    },
    "1129": {
        "#": "1129",
        "Sentence": "Ithought for a moment he was going to shake hands.",
        "Embedding": "[  5.466315 -36.21332  -14.845158]"
    },
    "1130": {
        "#": "1130",
        "Sentence": "\u201cIt\u2019s stopped raining.\u201d\u201cHas it?\u201d When he realized what I was talking about, that there weretwinkle-bells of sunshine in the room, he smiled like a weather man,like an ecstatic patron of recurrent light, and repeated the news toDaisy.",
        "Embedding": "[ 15.254358 -11.463708  10.081268]"
    },
    "1131": {
        "#": "1131",
        "Sentence": "\u201cWhat do you think of that?",
        "Embedding": "[-19.596445  -5.220216 -11.949388]"
    },
    "1132": {
        "#": "1132",
        "Sentence": "It\u2019s stopped raining.\u201d\u201cI\u2019m glad, Jay.\u201d Her throat, full of aching, grieving beauty, toldonly of her unexpected joy.",
        "Embedding": "[ 6.390606  -3.3328934 33.549194 ]"
    },
    "1133": {
        "#": "1133",
        "Sentence": "\u201cI want you and Daisy to come over to my house,\u201d he said, \u201cI\u2019d like toshow her around.\u201d\u201cYou\u2019re sure you want me to come?\u201d\u201cAbsolutely, old sport.\u201dDaisy went upstairs to wash her face\u2014too late I thought withhumiliation of my towels\u2014while Gatsby and I waited on the lawn.",
        "Embedding": "[ 2.9220676 21.035282  -2.4499052]"
    },
    "1134": {
        "#": "1134",
        "Sentence": "\u201cMy house looks well, doesn\u2019t it?\u201d he demanded.",
        "Embedding": "[-17.574394  -13.130689   -2.2402391]"
    },
    "1135": {
        "#": "1135",
        "Sentence": "\u201cSee how the wholefront of it catches the light.\u201dI agreed that it was splendid.",
        "Embedding": "[-10.040209  -32.146843    0.5450773]"
    },
    "1136": {
        "#": "1136",
        "Sentence": "\u201cYes.\u201d His eyes went over it, every arched door and square tower.",
        "Embedding": "[ 16.964443  -37.495205    5.2077084]"
    },
    "1137": {
        "#": "1137",
        "Sentence": "\u201cIttook me just three years to earn the money that bought it.\u201d\u201cI thought you inherited your money.\u201d\u201cI did, old sport,\u201d he said automatically, \u201cbut I lost most of it inthe big panic\u2014the panic of the war.\u201dI think he hardly knew what he was saying, for when I asked him whatbusiness he was in he answered: \u201cThat\u2019s my affair,\u201d before he realizedthat it wasn\u2019t an appropriate reply.",
        "Embedding": "[-4.8366556  4.684124  -9.13638  ]"
    },
    "1138": {
        "#": "1138",
        "Sentence": "\u201cOh, I\u2019ve been in several things,\u201d he corrected himself.",
        "Embedding": "[-10.359414  -32.44342    -5.9528384]"
    },
    "1139": {
        "#": "1139",
        "Sentence": "\u201cI was in thedrug business and then I was in the oil business.",
        "Embedding": "[ 14.303679 -39.427372  -3.359705]"
    },
    "1140": {
        "#": "1140",
        "Sentence": "But I\u2019m not ineither one now.\u201d He looked at me with more attention.",
        "Embedding": "[  0.7737459 -20.988228   -8.412218 ]"
    },
    "1141": {
        "#": "1141",
        "Sentence": "\u201cDo you meanyou\u2019ve been thinking over what I proposed the other night?\u201dBefore I could answer, Daisy came out of the house and two rows ofbrass buttons on her dress gleamed in the sunlight.",
        "Embedding": "[ 5.8563333 18.672812  33.569553 ]"
    },
    "1142": {
        "#": "1142",
        "Sentence": "\u201cThat huge place there?\u201d she cried pointing.",
        "Embedding": "[-31.885452  -4.471552  20.11102 ]"
    },
    "1143": {
        "#": "1143",
        "Sentence": "\u201cDo you like it?\u201d\u201cI love it, but I don\u2019t see how you live there all alone.\u201d\u201cI keep it always full of interesting people, night and day.",
        "Embedding": "[ -7.132334   5.652219 -30.982313]"
    },
    "1144": {
        "#": "1144",
        "Sentence": "Peoplewho do interesting things.",
        "Embedding": "[-41.841526    7.0568137   4.630367 ]"
    },
    "1145": {
        "#": "1145",
        "Sentence": "Celebrated people.\u201dInstead of taking the shortcut along the Sound we went down to theroad and entered by the big postern.",
        "Embedding": "[45.59264    5.7819543  0.524179 ]"
    },
    "1146": {
        "#": "1146",
        "Sentence": "With enchanting murmurs Daisyadmired this aspect or that of the feudal silhouette against the sky,admired the gardens, the sparkling odour of jonquils and the frothyodour of hawthorn and plum blossoms and the pale gold odour ofkiss-me-at-the-gate.",
        "Embedding": "[31.587769 13.568401 14.600067]"
    },
    "1147": {
        "#": "1147",
        "Sentence": "It was strange to reach the marble steps and findno stir of bright dresses in and out the door, and hear no sound butbird voices in the trees.",
        "Embedding": "[ 3.4814487e+01 -3.0486196e-02  2.2737288e+01]"
    },
    "1148": {
        "#": "1148",
        "Sentence": "And inside, as we wandered through Marie Antoinette music-rooms andRestoration Salons, I felt that there were guests concealed behindevery couch and table, under orders to be breathlessly silent until we had passed through.",
        "Embedding": "[21.387238 10.463362 23.030088]"
    },
    "1149": {
        "#": "1149",
        "Sentence": "As Gatsby closed the door of \u201cthe Merton CollegeLibrary\u201d I could have sworn I heard the owl-eyed man break intoghostly laughter.",
        "Embedding": "[ 4.2365866 28.018408  -2.5722806]"
    },
    "1150": {
        "#": "1150",
        "Sentence": "We went upstairs, through period bedrooms swathed in rose and lavendersilk and vivid with new flowers, through dressing-rooms and poolrooms,and bathrooms with sunken baths\u2014intruding into one chamber where adishevelled man in pyjamas was doing liver exercises on the floor.",
        "Embedding": "[31.126745  9.509205 18.70732 ]"
    },
    "1151": {
        "#": "1151",
        "Sentence": "it was Mr. Klipspringer, the \u201cboarder.\u201d I had seen him wandering hungrilyabout the beach that morning.",
        "Embedding": "[11.289541 21.05797  -5.85596 ]"
    },
    "1152": {
        "#": "1152",
        "Sentence": "Finally we came to Gatsby\u2019s ownapartment, a bedroom and a bath, and an Adam\u2019s study, where we satdown and drank a glass of some Chartreuse he took from a cupboard inthe wall.",
        "Embedding": "[31.61002  11.142068 20.938377]"
    },
    "1153": {
        "#": "1153",
        "Sentence": "He hadn\u2019t once ceased looking at Daisy, and I think he revaluedeverything in his house according to the measure of response it drewfrom her well-loved eyes.",
        "Embedding": "[ 0.21251202  6.4898734  27.132658  ]"
    },
    "1154": {
        "#": "1154",
        "Sentence": "Sometimes too, he stared around at hispossessions in a dazed way, as though in her actual and astoundingpresence none of it was any longer real.",
        "Embedding": "[ 1.8988844 -6.7744207  6.3599987]"
    },
    "1155": {
        "#": "1155",
        "Sentence": "Once he nearly toppled down aflight of stairs.",
        "Embedding": "[  1.9340894 -37.8336     -8.935502 ]"
    },
    "1156": {
        "#": "1156",
        "Sentence": "His bedroom was the simplest room of all\u2014except where the dresser wasgarnished with a toilet set of pure dull gold.",
        "Embedding": "[29.381481   6.5189056 20.885681 ]"
    },
    "1157": {
        "#": "1157",
        "Sentence": "Daisy took the brushwith delight, and smoothed her hair, whereupon Gatsby sat down andshaded his eyes and began to laugh.",
        "Embedding": "[ 3.30894  35.079514 10.414435]"
    },
    "1158": {
        "#": "1158",
        "Sentence": "\u201cIt\u2019s the funniest thing, old sport,\u201d he said hilariously.",
        "Embedding": "[-17.909307  23.048119 -17.268486]"
    },
    "1159": {
        "#": "1159",
        "Sentence": "\u201cIcan\u2019t\u2014When I try to\u2014\u201dHe had passed visibly through two states and was entering upon athird.",
        "Embedding": "[ 21.989975   7.898191 -11.333595]"
    },
    "1160": {
        "#": "1160",
        "Sentence": "After his embarrassment and his unreasoning joy he was consumedwith wonder at her presence.",
        "Embedding": "[  1.9449303 -25.142015   21.750143 ]"
    },
    "1161": {
        "#": "1161",
        "Sentence": "He had been full of the idea so long,dreamed it right through to the end, waited with his teeth set, so tospeak, at an inconceivable pitch of intensity.",
        "Embedding": "[ 24.544847  -10.52601     1.7797147]"
    },
    "1162": {
        "#": "1162",
        "Sentence": "Now, in the reaction,he was running down like an over-wound clock.",
        "Embedding": "[ 20.553669 -29.683098 -15.734552]"
    },
    "1163": {
        "#": "1163",
        "Sentence": "Recovering himself in a minute he opened for us two hulking patentcabinets which held his massed suits and dressing-gowns and ties, andhis shirts, piled like bricks in stacks a dozen high.",
        "Embedding": "[25.07603  17.106949 15.613541]"
    },
    "1164": {
        "#": "1164",
        "Sentence": "\u201cI\u2019ve got a man in England who buys me clothes.",
        "Embedding": "[-21.477074  -5.772619  27.861578]"
    },
    "1165": {
        "#": "1165",
        "Sentence": "He sends over aselection of things at the beginning of each season, spring and fall.\u201dHe took out a pile of shirts and began throwing them, one by one,before us, shirts of sheer linen and thick silk and fine flannel,which lost their folds as they fell and covered the table inmany-coloured disarray.",
        "Embedding": "[25.311779 15.151251 15.674424]"
    },
    "1166": {
        "#": "1166",
        "Sentence": "While we admired he brought more and the softrich heap mounted higher\u2014shirts with stripes and scrolls and plaids incoral and apple-green and lavender and faint orange, with monograms ofindian blue.",
        "Embedding": "[31.098988 17.551094 16.776289]"
    },
    "1167": {
        "#": "1167",
        "Sentence": "Suddenly, with a strained sound, Daisy bent her head into the shirts and began to cry stormily.",
        "Embedding": "[ 8.600811  4.271349 30.431793]"
    },
    "1168": {
        "#": "1168",
        "Sentence": "\u201cThey\u2019re such beautiful shirts,\u201d she sobbed, her voice muffled in thethick folds.",
        "Embedding": "[-30.046314 -10.002182  20.196299]"
    },
    "1169": {
        "#": "1169",
        "Sentence": "\u201cIt makes me sad because I\u2019ve never seen such\u2014suchbeautiful shirts before.\u201dAfter the house, we were to see the grounds and the swimming pool, andthe hydroplane, and the midsummer flowers\u2014but outside Gatsby\u2019s windowit began to rain again, so we stood in a row looking at the corrugatedsurface of the Sound.",
        "Embedding": "[18.696848 14.72143  -9.142789]"
    },
    "1170": {
        "#": "1170",
        "Sentence": "\u201cIf it wasn\u2019t for the mist we could see your home across the bay,\u201dsaid Gatsby.",
        "Embedding": "[-5.670614 30.279526  2.615685]"
    },
    "1171": {
        "#": "1171",
        "Sentence": "\u201cYou always have a green light that burns all night atthe end of your dock.\u201dDaisy put her arm through his abruptly, but he seemed absorbed in whathe had just said.",
        "Embedding": "[  8.459744 -12.98176   14.926339]"
    },
    "1172": {
        "#": "1172",
        "Sentence": "Possibly it had occurred to him that the colossalsignificance of that light had now vanished forever.",
        "Embedding": "[ -4.128741 -24.329346  13.700679]"
    },
    "1173": {
        "#": "1173",
        "Sentence": "Compared to thegreat distance that had separated him from Daisy it had seemed verynear to her, almost touching her.",
        "Embedding": "[ 2.9985383  1.5215857 29.168182 ]"
    },
    "1174": {
        "#": "1174",
        "Sentence": "It had seemed as close as a star tothe moon.",
        "Embedding": "[ 17.382706 -24.24988   -8.378197]"
    },
    "1175": {
        "#": "1175",
        "Sentence": "Now it was again a green light on a dock.",
        "Embedding": "[ 23.546268 -30.075037 -17.034813]"
    },
    "1176": {
        "#": "1176",
        "Sentence": "His count ofenchanted objects had diminished by one.",
        "Embedding": "[  0.5694907 -28.235956  -27.488672 ]"
    },
    "1177": {
        "#": "1177",
        "Sentence": "I began to walk about the room, examining various indefinite objectsin the half darkness.",
        "Embedding": "[38.626785 -6.877516 -4.511821]"
    },
    "1178": {
        "#": "1178",
        "Sentence": "A large photograph of an elderly man in yachtingcostume attracted me, hung on the wall over his desk.",
        "Embedding": "[44.288788  13.970468  -7.5940166]"
    },
    "1179": {
        "#": "1179",
        "Sentence": "\u201cWho\u2019s this?\u201d\u201cThat?",
        "Embedding": "[-22.76717  -10.843086 -11.703941]"
    },
    "1180": {
        "#": "1180",
        "Sentence": "That\u2019s Mr. Dan Cody, old sport.\u201dThe name sounded faintly familiar.",
        "Embedding": "[ 10.660476  18.975311 -38.11579 ]"
    },
    "1181": {
        "#": "1181",
        "Sentence": "\u201cHe\u2019s dead now.",
        "Embedding": "[ -6.9016147 -37.675716  -17.629755 ]"
    },
    "1182": {
        "#": "1182",
        "Sentence": "He used to be my best friend years ago.\u201dThere was a small picture of Gatsby, also in yachting costume, on thebureau\u2014Gatsby with his head thrown back defiantly\u2014taken apparentlywhen he was about eighteen.",
        "Embedding": "[10.999687  39.402973   3.0066643]"
    },
    "1183": {
        "#": "1183",
        "Sentence": "\u201cI adore it,\u201d exclaimed Daisy.",
        "Embedding": "[-18.618177  13.456057  25.374247]"
    },
    "1184": {
        "#": "1184",
        "Sentence": "\u201cThe pompadour!",
        "Embedding": "[-46.367554 -13.824522 -27.023245]"
    },
    "1185": {
        "#": "1185",
        "Sentence": "You never told me youhad a pompadour\u2014or a yacht.\u201d\u201cLook at this,\u201d said Gatsby quickly.",
        "Embedding": "[-4.8401732 30.742104  -3.8281312]"
    },
    "1186": {
        "#": "1186",
        "Sentence": "\u201cHere\u2019s a lot of clippings\u2014aboutyou.\u201dThey stood side by side examining it.",
        "Embedding": "[ -5.8106256 -32.393616   -7.802249 ]"
    },
    "1187": {
        "#": "1187",
        "Sentence": "I was going to ask to see therubies when the phone rang, and Gatsby took up the receiver.",
        "Embedding": "[10.1175785 32.764305  -9.529078 ]"
    },
    "1188": {
        "#": "1188",
        "Sentence": "\u201cYes \u2026 Well, I can\u2019t talk now \u2026 I can\u2019t talk now, old sport \u2026 I said asmall town \u2026 He must know what a small town is \u2026 Well, he\u2019s no use tous if Detroit is his idea of a small town \u2026\u201dHe rang off.",
        "Embedding": "[-13.323682  19.70938  -13.658055]"
    },
    "1189": {
        "#": "1189",
        "Sentence": "\u201cCome here quick!\u201d cried Daisy at the window.",
        "Embedding": "[-22.124935  12.439571  24.312819]"
    },
    "1190": {
        "#": "1190",
        "Sentence": "The rain was still falling, but the darkness had parted in the west,and there was a pink and golden billow of foamy clouds above the sea.",
        "Embedding": "[41.225143  -4.6683125  6.556686 ]"
    },
    "1191": {
        "#": "1191",
        "Sentence": "\u201cLook at that,\u201d she whispered, and then after a moment: \u201cI\u2019d like tojust get one of those pink clouds and put you in it and push youaround.\u201dI tried to go then, but they wouldn\u2019t hear of it; perhaps my presencemade them feel more satisfactorily alone.",
        "Embedding": "[-4.272476 -4.524697 13.181409]"
    },
    "1192": {
        "#": "1192",
        "Sentence": "\u201cI know what we\u2019ll do,\u201d said Gatsby, \u201cwe\u2019ll have Klipspringer play thepiano.\u201dHe went out of the room calling \u201cEwing!\u201d and returned in a few minute saccompanied by an embarrassed, slightly worn young man, withshell-rimmed glasses and scanty blond hair.",
        "Embedding": "[10.058233 31.529642 11.931296]"
    },
    "1193": {
        "#": "1193",
        "Sentence": "He was now decentlyclothed in a \u201csport shirt,\u201d open at the neck, sneakers, and ducktrousers of a nebulous hue.",
        "Embedding": "[21.719534   7.48368    2.6892014]"
    },
    "1194": {
        "#": "1194",
        "Sentence": "\u201cDid we interrupt your exercise?\u201d inquired Daisy politely.",
        "Embedding": "[-25.650515  17.944595  25.096312]"
    },
    "1195": {
        "#": "1195",
        "Sentence": "\u201cI was asleep,\u201d cried Mr. Klipspringer, in a spasm of embarrassment.",
        "Embedding": "[  7.813839 -37.44558   20.845394]"
    },
    "1196": {
        "#": "1196",
        "Sentence": "\u201cThat is, I\u2019d been asleep.",
        "Embedding": "[-28.287268 -15.235663 -11.168813]"
    },
    "1197": {
        "#": "1197",
        "Sentence": "Then I got up \u2026\u201d\u201cKlipspringer plays the piano,\u201d said Gatsby, cutting him off.",
        "Embedding": "[  4.431124  34.299377 -14.043982]"
    },
    "1198": {
        "#": "1198",
        "Sentence": "\u201cDon\u2019tyou, Ewing, old sport?\u201d\u201cI don\u2019t play well.",
        "Embedding": "[-11.925403  18.530556 -22.674261]"
    },
    "1199": {
        "#": "1199",
        "Sentence": "I don\u2019t\u2014hardly play at all.",
        "Embedding": "[-26.303299  -5.377787 -20.798712]"
    },
    "1200": {
        "#": "1200",
        "Sentence": "I\u2019m all out of prac\u2014\u201d\u201cWe\u2019ll go downstairs,\u201d interrupted Gatsby.",
        "Embedding": "[-4.3872685  32.82439     0.11159254]"
    },
    "1201": {
        "#": "1201",
        "Sentence": "He flipped a switch.",
        "Embedding": "[-27.79776   -31.683712   -0.2622923]"
    },
    "1202": {
        "#": "1202",
        "Sentence": "Thegrey windows disappeared as the house glowed full of light.",
        "Embedding": "[ 38.634785 -10.537633  -8.623885]"
    },
    "1203": {
        "#": "1203",
        "Sentence": "In the music-room Gatsby turned on a solitary lamp beside the piano.",
        "Embedding": "[  4.711655  35.952034 -15.327977]"
    },
    "1204": {
        "#": "1204",
        "Sentence": "He lit Daisy\u2019s cigarette from a trembling match, and sat down with heron a couch far across the room, where there was no light save what thegleaming floor bounced in from the hall.",
        "Embedding": "[27.91336    3.5906594 19.432365 ]"
    },
    "1205": {
        "#": "1205",
        "Sentence": "When Klipspringer had played \u201cThe Love Nest\u201d he turned around on thebench and searched unhappily for Gatsby in the gloom.",
        "Embedding": "[11.296518  33.301193   0.8752044]"
    },
    "1206": {
        "#": "1206",
        "Sentence": "\u201cI\u2019m all out of practice, you see.",
        "Embedding": "[-32.75592    0.115726 -28.576504]"
    },
    "1207": {
        "#": "1207",
        "Sentence": "I told you I couldn\u2019t play.",
        "Embedding": "[-24.48398    -1.7305748 -19.870792 ]"
    },
    "1208": {
        "#": "1208",
        "Sentence": "I\u2019m allout of prac\u2014\u201d\u201cDon\u2019t talk so much, old sport,\u201d commanded Gatsby.",
        "Embedding": "[-7.3556757 31.245056  -8.6379385]"
    },
    "1209": {
        "#": "1209",
        "Sentence": "\u201cPlay!\u201d \u201cIn the morning, In the evening, Ain\u2019t we got fun\u2014\u201dOutside the wind was loud and there was a faint flow of thunder alongthe Sound.",
        "Embedding": "[43.320553  -1.7852257  6.4057364]"
    },
    "1210": {
        "#": "1210",
        "Sentence": "All the lights were going on in West Egg now; the electrictrains, men-carrying, were plunging home through the rain from NewYork.",
        "Embedding": "[ 32.74782     -0.25713846 -24.243767  ]"
    },
    "1211": {
        "#": "1211",
        "Sentence": "It was the hour of a profound human change, and excitement wasgenerating on the air.",
        "Embedding": "[ 37.97533  -19.56283  -16.233837]"
    },
    "1212": {
        "#": "1212",
        "Sentence": "\u201cOne thing\u2019s sure and nothing\u2019s surer The rich get richer and the poor get\u2014children.",
        "Embedding": "[-13.5739565  36.317593  -18.014862 ]"
    },
    "1213": {
        "#": "1213",
        "Sentence": "In the meantime, In between time\u2014\u201dAs I went over to say goodbye I saw that the expression ofbewilderment had come back into Gatsby\u2019s face, as though a faint doubthad occurred to him as to the quality of his present happiness.",
        "Embedding": "[18.251951  -9.641273   6.8512855]"
    },
    "1214": {
        "#": "1214",
        "Sentence": "Almostfive years!",
        "Embedding": "[-47.78676    -7.1225038 -13.669544 ]"
    },
    "1215": {
        "#": "1215",
        "Sentence": "There must have been moments even that afternoon whenDaisy tumbled short of his dreams\u2014not through her own fault, butbecause of the colossal vitality of his illusion.",
        "Embedding": "[28.6309    -8.683984   6.2185683]"
    },
    "1216": {
        "#": "1216",
        "Sentence": "It had gone beyondher, beyond everything.",
        "Embedding": "[-30.945778 -28.138325   3.619101]"
    },
    "1217": {
        "#": "1217",
        "Sentence": "He had thrown himself into it with a creativepassion, adding to it all the time, decking it out with every brightfeather that drifted his way.",
        "Embedding": "[ 19.258532 -18.67448    4.997181]"
    },
    "1218": {
        "#": "1218",
        "Sentence": "No amount of fire or freshness canchallenge what a man can store up in his ghostly heart.",
        "Embedding": "[20.257938   8.140527   8.2879925]"
    },
    "1219": {
        "#": "1219",
        "Sentence": "As I watched him he adjusted himself a little, visibly.",
        "Embedding": "[ -5.2141733 -25.767385   -2.9315388]"
    },
    "1220": {
        "#": "1220",
        "Sentence": "His hand tookhold of hers, and as she said something low in his ear he turnedtoward her with a rush of emotion.",
        "Embedding": "[ 16.230137 -14.85201   22.340162]"
    },
    "1221": {
        "#": "1221",
        "Sentence": "I think that voice held him most,with its fluctuating, feverish warmth, because it couldn\u2019t beover-dreamed\u2014that voice was a deathless song.",
        "Embedding": "[ 9.531867 -9.9123   37.164898]"
    },
    "1222": {
        "#": "1222",
        "Sentence": "They had forgotten me, but Daisy glanced up and held out her hand;Gatsby didn\u2019t know me now at all.",
        "Embedding": "[-0.7034289  2.811388   2.1323519]"
    },
    "1223": {
        "#": "1223",
        "Sentence": "I looked once more at them and theylooked back at me, remotely, possessed by intense life.",
        "Embedding": "[  3.8697274 -26.630188    2.4949026]"
    },
    "1224": {
        "#": "1224",
        "Sentence": "Then I wentout of the room and down the marble steps into the rain, leaving themthere together.",
        "Embedding": "[ 38.44243   -12.217686   -0.8209437]"
    },
    "1225": {
        "#": "1225",
        "Sentence": "VIAbout this time an ambitious young reporter from New York arrived onemorning at Gatsby\u2019s door and asked him if he had anything to say.",
        "Embedding": "[  2.710612  23.665535 -15.497228]"
    },
    "1226": {
        "#": "1226",
        "Sentence": "\u201cAnything to say about what?\u201d inquired Gatsby politely.",
        "Embedding": "[-7.851879 35.846416 -3.597408]"
    },
    "1227": {
        "#": "1227",
        "Sentence": "\u201cWhy\u2014any statement to give out.\u201dIt transpired after a confused five minutes that the man had heardGatsby\u2019s name around his office in a connection which he eitherwouldn\u2019t reveal or didn\u2019t fully understand.",
        "Embedding": "[ 10.799197  -16.219658    5.1560407]"
    },
    "1228": {
        "#": "1228",
        "Sentence": "This was his day off andwith laudable initiative he had hurried out \u201cto see.\u201dIt was a random shot, and yet the reporter\u2019s instinct was right.",
        "Embedding": "[25.788877 -3.376077 -9.549899]"
    },
    "1229": {
        "#": "1229",
        "Sentence": "Gatsby\u2019s notoriety, spread about by the hundreds who had accepted hishospitality and so become authorities upon his past, had increased allsummer until he fell just short of being news.",
        "Embedding": "[ 9.846928 45.66087   8.567138]"
    },
    "1230": {
        "#": "1230",
        "Sentence": "Contemporary legendssuch as the \u201cunderground pipeline to Canada\u201d attached themselves to him, and there was one persistent story that he didn\u2019t live in a houseat all, but in a boat that looked like a house and was moved secretlyup and down the Long Island shore.",
        "Embedding": "[26.587055   35.478256    0.39848924]"
    },
    "1231": {
        "#": "1231",
        "Sentence": "Just why these inventions were asource of satisfaction to James Gatz of North Dakota, isn\u2019t easy tosay.",
        "Embedding": "[  5.542444   9.878186 -39.667744]"
    },
    "1232": {
        "#": "1232",
        "Sentence": "James Gatz\u2014that was really, or at least legally, his name.",
        "Embedding": "[ -8.5744095 -21.065786  -24.67262  ]"
    },
    "1233": {
        "#": "1233",
        "Sentence": "He hadchanged it at the age of seventeen and at the specific moment thatwitnessed the beginning of his career\u2014when he saw Dan Cody\u2019s yachtdrop anchor over the most insidious flat on Lake Superior.",
        "Embedding": "[21.925964  33.01598    4.4643655]"
    },
    "1234": {
        "#": "1234",
        "Sentence": "It wasJames Gatz who had been loafing along the beach that afternoon in atorn green jersey and a pair of canvas pants, but it was already JayGatsby who borrowed a rowboat, pulled out to the Tuolomee, andinformed Cody that a wind might catch him and break him up in half an hour.",
        "Embedding": "[19.75759   19.685785  -1.8170671]"
    },
    "1235": {
        "#": "1235",
        "Sentence": "I suppose he\u2019d had the name ready for a long time, even then.",
        "Embedding": "[ -5.464472 -23.960485 -19.279236]"
    },
    "1236": {
        "#": "1236",
        "Sentence": "Hisparents were shiftless and unsuccessful farm people\u2014his imaginationhad never really accepted them as his parents at all.",
        "Embedding": "[23.072546 29.820307 -9.263524]"
    },
    "1237": {
        "#": "1237",
        "Sentence": "The truth wasthat Jay Gatsby of West Egg, Long Island, sprang from his Platonicconception of himself.",
        "Embedding": "[ 8.121204  43.0295     0.8651435]"
    },
    "1238": {
        "#": "1238",
        "Sentence": "He was a son of God\u2014a phrase which, if it meansanything, means just that\u2014and he must be about His Father\u2019s business,the service of a vast, vulgar, and meretricious beauty.",
        "Embedding": "[20.11166   -1.9445183 -4.723407 ]"
    },
    "1239": {
        "#": "1239",
        "Sentence": "So he inventedjust the sort of Jay Gatsby that a seventeen-year-old boy would belikely to invent, and to this conception he was faithful to the end.",
        "Embedding": "[ 5.681599  46.161877   3.5902402]"
    },
    "1240": {
        "#": "1240",
        "Sentence": "For over a year he had been beating his way along the south shore ofLake Superior as a clam-digger and a salmon-fisher or in any othercapacity that brought him food and bed.",
        "Embedding": "[21.841507 30.033705  2.572616]"
    },
    "1241": {
        "#": "1241",
        "Sentence": "His brown, hardening bodylived naturally through the half-fierce, half-lazy work of the bracingdays.",
        "Embedding": "[ 27.206331  -15.493712    2.3012383]"
    },
    "1242": {
        "#": "1242",
        "Sentence": "He knew women early, and since they spoiled him he becamecontemptuous of them, of young virgins because they were ignorant, ofthe others because they were hysterical about things which in hisoverwhelming self-absorption he took for granted.",
        "Embedding": "[-4.7157645  2.4006407 34.93578  ]"
    },
    "1243": {
        "#": "1243",
        "Sentence": "But his heart was in a constant, turbulent riot.",
        "Embedding": "[-23.953773 -41.36067   -2.122401]"
    },
    "1244": {
        "#": "1244",
        "Sentence": "The most grotesqueand fantastic conceits haunted him in his bed at night.",
        "Embedding": "[ 33.597813  -14.77497    -6.7909985]"
    },
    "1245": {
        "#": "1245",
        "Sentence": "A universe ofineffable gaudiness spun itself out in his brain while the clockticked on the washstand and the moon soaked with wet light his tangledclothes upon the floor.",
        "Embedding": "[33.07961   -3.2330263 11.527859 ]"
    },
    "1246": {
        "#": "1246",
        "Sentence": "Each night he added to the pattern of hisfancies until drowsiness closed down upon some vivid scene with anoblivious embrace.",
        "Embedding": "[ 24.44595   -14.858516    7.1904964]"
    },
    "1247": {
        "#": "1247",
        "Sentence": "For a while these reveries provided an outlet forhis imagination; they were a satisfactory hint of the unreality ofreality, a promise that the rock of the world was founded securely ona fairy\u2019s wing.",
        "Embedding": "[20.431648 12.010062 13.449579]"
    },
    "1248": {
        "#": "1248",
        "Sentence": "An instinct toward his future glory had led him, some months before,to the small Lutheran College of St. Olaf\u2019s in southern Minnesota.",
        "Embedding": "[22.95104   24.634836  -1.2652344]"
    },
    "1249": {
        "#": "1249",
        "Sentence": "Hestayed there two weeks, dismayed at its ferocious indifference to thedrums of his destiny, to destiny itself, and despising the janitor\u2019swork with which he was to pay his way through.",
        "Embedding": "[ 27.300652 -10.69759    8.571953]"
    },
    "1250": {
        "#": "1250",
        "Sentence": "Then he drifted back toLake Superior, and he was still searching for something to do on theday that Dan Cody\u2019s yacht dropped anchor in the shallows alongshore.",
        "Embedding": "[21.403065 34.441814  6.003446]"
    },
    "1251": {
        "#": "1251",
        "Sentence": "Cody was fifty years old then, a product of the Nevada silver fields,of the Yukon, of every rush for metal since seventy-five.",
        "Embedding": "[  5.561353  20.591808 -36.39043 ]"
    },
    "1252": {
        "#": "1252",
        "Sentence": "Thetransactions in Montana copper that made him many times a millionairefound him physically robust but on the verge of soft-mindedness, and,suspecting this, an infinite number of women tried to separate himfrom his money.",
        "Embedding": "[15.568404  -3.9543314 -3.1477144]"
    },
    "1253": {
        "#": "1253",
        "Sentence": "The none too savoury ramifications by which Ella Kaye,the newspaper woman, played Madame de Maintenon to his weakness andsent him to sea in a yacht, were common property of the turgidjournalism in 1902.",
        "Embedding": "[23.029085 35.759388 11.153221]"
    },
    "1254": {
        "#": "1254",
        "Sentence": "He had been coasting along all too hospitableshores for five years when he turned up as James Gatz\u2019s destiny inLittle Girl Bay.",
        "Embedding": "[-10.074239    1.1474355  26.393879 ]"
    },
    "1255": {
        "#": "1255",
        "Sentence": "To young Gatz, resting on his oars and looking up at the railed deck,that yacht represented all the beauty and glamour in the world.",
        "Embedding": "[21.006142 34.114056 10.174239]"
    },
    "1256": {
        "#": "1256",
        "Sentence": "Isuppose he smiled at Cody\u2014he had probably discovered that people likedhim when he smiled.",
        "Embedding": "[  8.803367  -24.467667   -1.8265488]"
    },
    "1257": {
        "#": "1257",
        "Sentence": "At any rate Cody asked him a few questions (one ofthem elicited the brand new name) and found that he was quick andextravagantly ambitious.",
        "Embedding": "[ 24.237692    -0.87916684 -16.25625   ]"
    },
    "1258": {
        "#": "1258",
        "Sentence": "A few days later he took him to Duluth andbought him a blue coat, six pairs of white duck trousers, and ayachting cap.",
        "Embedding": "[21.510672 22.629442 -2.170341]"
    },
    "1259": {
        "#": "1259",
        "Sentence": "And when the Tuolomee left for the West Indies and theBarbary Coast, Gatsby left too.",
        "Embedding": "[-10.058363    43.860737     0.95697707]"
    },
    "1260": {
        "#": "1260",
        "Sentence": "He was employed in a vague personal capacity\u2014while he remained withCody he was in turn steward, mate, skipper, secretary, and evenjailor, for Dan Cody sober knew what lavish doings Dan Cody drunkmight soon be about, and he provided for such contingencies byreposing more and more trust in Gatsby.",
        "Embedding": "[20.42667   36.646717   5.1379375]"
    },
    "1261": {
        "#": "1261",
        "Sentence": "The arrangement lasted fiveyears, during which the boat went three times around the Continent.",
        "Embedding": "[48.86751   -9.01198   -3.1242867]"
    },
    "1262": {
        "#": "1262",
        "Sentence": "It might have lasted indefinitely except for the fact that Ella Kayecame on board one night in Boston and a week later Dan Codyinhospitably died.",
        "Embedding": "[15.910099  18.931677   3.9340408]"
    },
    "1263": {
        "#": "1263",
        "Sentence": "I remember the portrait of him up in Gatsby\u2019s bedroom, a grey, floridman with a hard, empty face\u2014the pioneer debauchee, who during onephase of American life brought back to the Eastern seaboard the savageviolence of the frontier brothel and saloon.",
        "Embedding": "[13.215571 31.101955 11.888381]"
    },
    "1264": {
        "#": "1264",
        "Sentence": "It was indirectly due toCody that Gatsby drank so little.",
        "Embedding": "[-1.3174064 42.333298  -1.0979384]"
    },
    "1265": {
        "#": "1265",
        "Sentence": "Sometimes in the course of gayparties women used to rub champagne into his hair; for himself heformed the habit of letting liquor alone.",
        "Embedding": "[14.877655   2.2418659 -2.346813 ]"
    },
    "1266": {
        "#": "1266",
        "Sentence": "And it was from Cody that he inherited money\u2014a legacy of twenty-fivethousand dollars.",
        "Embedding": "[  7.4428635  22.011623  -36.06478  ]"
    },
    "1267": {
        "#": "1267",
        "Sentence": "He didn\u2019t get it.",
        "Embedding": "[-23.813017  -23.72035    -3.1889637]"
    },
    "1268": {
        "#": "1268",
        "Sentence": "He never understood the legaldevice that was used against him, but what remained of the millionswent intact to Ella Kaye.",
        "Embedding": "[  1.941155 -15.579927  18.372482]"
    },
    "1269": {
        "#": "1269",
        "Sentence": "He was left with his singularly appropriateeducation; the vague contour of Jay Gatsby had filled out to thesubstantiality of a man.",
        "Embedding": "[ 5.2282906 43.29521    4.4131846]"
    },
    "1270": {
        "#": "1270",
        "Sentence": "He told me all this very much later, but I\u2019ve put it down here withthe idea of exploding those first wild rumours about his antecedents,which weren\u2019t even faintly true.",
        "Embedding": "[-5.413277  -8.471535   2.4776754]"
    },
    "1271": {
        "#": "1271",
        "Sentence": "Moreover he told it to me at a timeof confusion, when I had reached the point of believing everything andnothing about him.",
        "Embedding": "[ -4.976118  -10.582973    4.3690805]"
    },
    "1272": {
        "#": "1272",
        "Sentence": "So I take advantage of this short halt, whileGatsby, so to speak, caught his breath, to clear this set ofmisconceptions away.",
        "Embedding": "[22.614628  -7.335831   2.0291889]"
    },
    "1273": {
        "#": "1273",
        "Sentence": "It was a halt, too, in my association with his affairs.",
        "Embedding": "[ 11.806727  -42.02987    -1.9647131]"
    },
    "1274": {
        "#": "1274",
        "Sentence": "For severalweeks I didn\u2019t see him or hear his voice on the phone\u2014mostly I was inNew York, trotting around with Jordan and trying to ingratiate myselfwith her senile aunt\u2014but finally I went over to his house one Sundayafternoon.",
        "Embedding": "[ 6.0623384 12.256384  -5.353281 ]"
    },
    "1275": {
        "#": "1275",
        "Sentence": "I hadn\u2019t been there two minutes when somebody brought Tom Buchanan in for a drink.",
        "Embedding": "[ -2.8787653  -8.250628  -26.312204 ]"
    },
    "1276": {
        "#": "1276",
        "Sentence": "I was startled, naturally, but the reallysurprising thing was that it hadn\u2019t happened before.",
        "Embedding": "[ -2.3031964 -16.993185    4.474576 ]"
    },
    "1277": {
        "#": "1277",
        "Sentence": "They were a party of three on horseback\u2014Tom and a man named Sloane anda pretty woman in a brown riding-habit, who had been there previously.",
        "Embedding": "[22.321722 14.757847 30.244501]"
    },
    "1278": {
        "#": "1278",
        "Sentence": "\u201cI\u2019m delighted to see you,\u201d said Gatsby, standing on his porch.",
        "Embedding": "[ 1.0350273 26.155197  -1.1776134]"
    },
    "1279": {
        "#": "1279",
        "Sentence": "\u201cI\u2019mdelighted that you dropped in.\u201dAs though they cared!",
        "Embedding": "[-15.808722    6.4418907 -27.680286 ]"
    },
    "1280": {
        "#": "1280",
        "Sentence": "\u201cSit right down.",
        "Embedding": "[-38.47596   -8.567549 -20.155315]"
    },
    "1281": {
        "#": "1281",
        "Sentence": "Have a cigarette or a cigar.\u201d He walked around theroom quickly, ringing bells.",
        "Embedding": "[ 43.018837 -18.6056    12.572941]"
    },
    "1282": {
        "#": "1282",
        "Sentence": "\u201cI\u2019ll have something to drink for you injust a minute.\u201dHe was profoundly affected by the fact that Tom was there.",
        "Embedding": "[-25.215855  18.234833  -8.820172]"
    },
    "1283": {
        "#": "1283",
        "Sentence": "But hewould be uneasy anyhow until he had given them something, realizing ina vague way that that was all they came for.",
        "Embedding": "[ 22.308529  -22.561357    3.6222875]"
    },
    "1284": {
        "#": "1284",
        "Sentence": "Mr. Sloane wantednothing.",
        "Embedding": "[ -3.197993 -25.209045 -38.443607]"
    },
    "1285": {
        "#": "1285",
        "Sentence": "A lemonade?",
        "Embedding": "[-41.415848   -5.8797193 -32.394737 ]"
    },
    "1286": {
        "#": "1286",
        "Sentence": "No, thanks.",
        "Embedding": "[-41.293194   -0.7311704  -9.060353 ]"
    },
    "1287": {
        "#": "1287",
        "Sentence": "A little champagne?",
        "Embedding": "[-41.928566  -7.343567 -30.817057]"
    },
    "1288": {
        "#": "1288",
        "Sentence": "Nothing at all,thanks \u2026 I\u2019m sorry\u2014\u201cDid you have a nice ride?\u201d\u201cVery good roads around here.\u201d\u201cI suppose the automobiles\u2014\u201d\u201cYeah.\u201dMoved by an irresistible impulse, Gatsby turned to Tom, who hadaccepted the introduction as a stranger.",
        "Embedding": "[-8.169817  26.429901  -7.0842595]"
    },
    "1289": {
        "#": "1289",
        "Sentence": "\u201cI believe we\u2019ve met somewhere before, Mr. Buchanan.\u201d\u201cOh, yes,\u201d said Tom, gruffly polite, but obviously not remembering.",
        "Embedding": "[-15.409779   21.952126    1.5621989]"
    },
    "1290": {
        "#": "1290",
        "Sentence": "\u201cSo we did.",
        "Embedding": "[-37.62295  -18.829506 -15.097181]"
    },
    "1291": {
        "#": "1291",
        "Sentence": "I remember very well.\u201d\u201cAbout two weeks ago.\u201d\u201cThat\u2019s right.",
        "Embedding": "[ -3.6895611  -1.0873024 -30.36058  ]"
    },
    "1292": {
        "#": "1292",
        "Sentence": "You were with Nick here.\u201d\u201cI know your wife,\u201d continued Gatsby, almost aggressively.",
        "Embedding": "[-10.24743    37.731026    5.7960095]"
    },
    "1293": {
        "#": "1293",
        "Sentence": "\u201cThat so?\u201dTom turned to me.",
        "Embedding": "[-29.36922   -12.173582  -11.0805235]"
    },
    "1294": {
        "#": "1294",
        "Sentence": "\u201cYou live near here, Nick?\u201d\u201cNext door.\u201d\u201cThat so?\u201dMr. Sloane didn\u2019t enter into the conversation, but lounged backhaughtily in his chair; the woman said nothing either\u2014untilunexpectedly, after two highballs, she became cordial.",
        "Embedding": "[ 9.233933   7.689873  -1.4680539]"
    },
    "1295": {
        "#": "1295",
        "Sentence": "\u201cWe\u2019ll all come over to your next party, Mr. Gatsby,\u201d she suggested.",
        "Embedding": "[-9.0838995 32.88898    5.8908496]"
    },
    "1296": {
        "#": "1296",
        "Sentence": "\u201cWhat do you say?\u201d\u201cCertainly; I\u2019d be delighted to have you.\u201d\u201cBe ver\u2019 nice,\u201d said Mr. Sloane, without gratitude.",
        "Embedding": "[-14.921322   7.427794 -10.929499]"
    },
    "1297": {
        "#": "1297",
        "Sentence": "\u201cWell\u2014think oughtto be starting home.\u201d\u201cPlease don\u2019t hurry,\u201d Gatsby urged them.",
        "Embedding": "[-12.109875   37.045692   -1.7494879]"
    },
    "1298": {
        "#": "1298",
        "Sentence": "He had control of himselfnow, and he wanted to see more of Tom.",
        "Embedding": "[-32.08284   26.521307   5.931729]"
    },
    "1299": {
        "#": "1299",
        "Sentence": "\u201cWhy don\u2019t you\u2014why don\u2019t youstay for supper?",
        "Embedding": "[-32.695274   9.227735 -17.953674]"
    },
    "1300": {
        "#": "1300",
        "Sentence": "I wouldn\u2019t be surprised if some other people droppedin from New York.\u201d\u201cYou come to supper with me,\u201d said the lady enthusiastically.",
        "Embedding": "[-4.2724633 -1.6270912 -9.48479  ]"
    },
    "1301": {
        "#": "1301",
        "Sentence": "\u201cBoth ofyou.\u201dThis included me.",
        "Embedding": "[-20.11656  -27.784773 -26.000359]"
    },
    "1302": {
        "#": "1302",
        "Sentence": "Mr. Sloane got to his feet.",
        "Embedding": "[ -3.6519334 -26.453661  -36.571613 ]"
    },
    "1303": {
        "#": "1303",
        "Sentence": "\u201cCome along,\u201d he said\u2014but to her only.",
        "Embedding": "[-25.370161 -18.390293  11.529066]"
    },
    "1304": {
        "#": "1304",
        "Sentence": "\u201cI mean it,\u201d she insisted.",
        "Embedding": "[-23.951984 -21.18984    8.5257  ]"
    },
    "1305": {
        "#": "1305",
        "Sentence": "\u201cI\u2019d love to have you.",
        "Embedding": "[-39.370033    3.77614    -6.4768662]"
    },
    "1306": {
        "#": "1306",
        "Sentence": "Lots of room.\u201dGatsby looked at me questioningly.",
        "Embedding": "[  0.28970882 -24.367994    -8.920099  ]"
    },
    "1307": {
        "#": "1307",
        "Sentence": "He wanted to go and he didn\u2019t seethat Mr. Sloane had determined he shouldn\u2019t.",
        "Embedding": "[-13.081863 -24.751282  13.164147]"
    },
    "1308": {
        "#": "1308",
        "Sentence": "\u201cI\u2019m afraid I won\u2019t be able to,\u201d I said.",
        "Embedding": "[-27.35366    2.403959 -18.420706]"
    },
    "1309": {
        "#": "1309",
        "Sentence": "\u201cWell, you come,\u201d she urged, concentrating on Gatsby.",
        "Embedding": "[-8.012137  35.465363   6.1001997]"
    },
    "1310": {
        "#": "1310",
        "Sentence": "Mr. Sloane murmured something close to her ear.",
        "Embedding": "[ -5.719228 -26.85624  -35.935635]"
    },
    "1311": {
        "#": "1311",
        "Sentence": "\u201cWe won\u2019t be late if we start now,\u201d she insisted aloud.",
        "Embedding": "[-19.308575  -10.416244    5.4586816]"
    },
    "1312": {
        "#": "1312",
        "Sentence": "\u201cI haven\u2019t got a horse,\u201d said Gatsby.",
        "Embedding": "[-8.326173 39.41529  -7.126099]"
    },
    "1313": {
        "#": "1313",
        "Sentence": "\u201cI used to ride in the army, butI\u2019ve never bought a horse.",
        "Embedding": "[ -8.996763  39.916542 -10.078113]"
    },
    "1314": {
        "#": "1314",
        "Sentence": "I\u2019ll have to follow you in my car.",
        "Embedding": "[  7.3920555 -12.595293  -31.411324 ]"
    },
    "1315": {
        "#": "1315",
        "Sentence": "Excuseme for just a minute.\u201dThe rest of us walked out on the porch, where Sloane and the ladybegan an impassioned conversation aside.",
        "Embedding": "[10.273393 10.14735  -1.157595]"
    },
    "1316": {
        "#": "1316",
        "Sentence": "\u201cMy God, I believe the man\u2019s coming,\u201d said Tom.",
        "Embedding": "[-19.203917   19.941633   -2.7116783]"
    },
    "1317": {
        "#": "1317",
        "Sentence": "\u201cDoesn\u2019t he know shedoesn\u2019t want him?\u201d\u201cShe says she does want him.\u201d\u201cShe has a big dinner party and he won\u2019t know a soul there.\u201d Hefrowned.",
        "Embedding": "[-6.6995444 23.92973    4.390093 ]"
    },
    "1318": {
        "#": "1318",
        "Sentence": "\u201cI wonder where in the devil he met Daisy.",
        "Embedding": "[-15.35926    5.444924  27.70492 ]"
    },
    "1319": {
        "#": "1319",
        "Sentence": "By God, I may beold-fashioned in my ideas, but women run around too much these days tosuit me.",
        "Embedding": "[-12.586453    -0.20180549  -0.1573234 ]"
    },
    "1320": {
        "#": "1320",
        "Sentence": "They meet all kinds of crazy fish.\u201dSuddenly Mr. Sloane and the lady walked down the steps and mountedtheir horses.",
        "Embedding": "[24.533792 14.931803 29.72861 ]"
    },
    "1321": {
        "#": "1321",
        "Sentence": "\u201cCome on,\u201d said Mr. Sloane to Tom, \u201cwe\u2019re late.",
        "Embedding": "[-24.079466  26.184746   4.852957]"
    },
    "1322": {
        "#": "1322",
        "Sentence": "We\u2019ve got to go.\u201d  Andthen to me: \u201cTell him we couldn\u2019t wait, will you?\u201dTom and I shook hands, the rest of us exchanged a cool nod, and theytrotted quickly down the drive, disappearing under the August foliagejust as Gatsby, with hat and light overcoat in hand, came out thefront door.",
        "Embedding": "[14.850848   0.7280789  6.644365 ]"
    },
    "1323": {
        "#": "1323",
        "Sentence": "Tom was evidently perturbed at Daisy\u2019s running around alone, for onthe following Saturday night he came with her to Gatsby\u2019sparty.",
        "Embedding": "[ 1.891941  8.839611 24.017572]"
    },
    "1324": {
        "#": "1324",
        "Sentence": "Perhaps his presence gave the evening its peculiar quality ofoppressiveness\u2014it stands out in my memory from Gatsby\u2019s other partiesthat summer.",
        "Embedding": "[17.558048  40.776382  -2.9437785]"
    },
    "1325": {
        "#": "1325",
        "Sentence": "There were the same people, or at least the same sort ofpeople, the same profusion of champagne, the same many-coloured,many-keyed commotion, but I felt an unpleasantness in the air, apervading harshness that hadn\u2019t been there before.",
        "Embedding": "[ 26.950497 -24.93254   -7.769321]"
    },
    "1326": {
        "#": "1326",
        "Sentence": "Or perhaps I hadmerely grown used to it, grown to accept West Egg as a world completein itself, with its own standards and its own great figures, second tonothing because it had no consciousness of being so, and now I waslooking at it again, through Daisy\u2019s eyes.",
        "Embedding": "[23.972906 38.80371  -6.046771]"
    },
    "1327": {
        "#": "1327",
        "Sentence": "It is invariably saddening to look through new eyes at things upon which you have expended yourown powers of adjustment.",
        "Embedding": "[ 34.633404 -21.97749   -8.134328]"
    },
    "1328": {
        "#": "1328",
        "Sentence": "They arrived at twilight, and, as we strolled out among the sparklinghundreds, Daisy\u2019s voice was playing murmurous tricks in her throat.",
        "Embedding": "[11.43025  -4.838349 38.652195]"
    },
    "1329": {
        "#": "1329",
        "Sentence": "\u201cThese things excite me so,\u201d she whispered.",
        "Embedding": "[-28.307192  -8.545043  14.982943]"
    },
    "1330": {
        "#": "1330",
        "Sentence": "\u201cIf you want to kiss meany time during the evening, Nick, just let me know and I\u2019ll be gladto arrange it for you.",
        "Embedding": "[-27.083015   10.6752615  17.55884  ]"
    },
    "1331": {
        "#": "1331",
        "Sentence": "Just mention my name.",
        "Embedding": "[-27.505112    1.1592832  -2.042127 ]"
    },
    "1332": {
        "#": "1332",
        "Sentence": "Or present a green card.",
        "Embedding": "[-35.323772 -38.25261   -3.601392]"
    },
    "1333": {
        "#": "1333",
        "Sentence": "I\u2019m giving out green\u2014\u201d\u201cLook around,\u201d suggested Gatsby.",
        "Embedding": "[-7.1673274 33.86637   -1.0677592]"
    },
    "1334": {
        "#": "1334",
        "Sentence": "\u201cI\u2019m looking around.",
        "Embedding": "[-31.038733  -9.14899  -18.990103]"
    },
    "1335": {
        "#": "1335",
        "Sentence": "I\u2019m having a marvellous\u2014\u201d\u201cYou must see the faces of many people you\u2019ve heard about.\u201dTom\u2019s arrogant eyes roamed the crowd.",
        "Embedding": "[ 30.514793 -23.63539    6.326236]"
    },
    "1336": {
        "#": "1336",
        "Sentence": "\u201cWe don\u2019t go around very much,\u201d he said; \u201cin fact, I was just thinkingI don\u2019t know a soul here.\u201d\u201cPerhaps you know that lady.\u201d Gatsby indicated a gorgeous, scarcelyhuman orchid of a woman who sat in state under a white-plum tree.",
        "Embedding": "[-3.6182837 24.620523   3.9669864]"
    },
    "1337": {
        "#": "1337",
        "Sentence": "Tomand Daisy stared, with that peculiarly unreal feeling that accompaniesthe recognition of a hitherto ghostly celebrity of the movies.",
        "Embedding": "[-2.209027 10.646307 37.409916]"
    },
    "1338": {
        "#": "1338",
        "Sentence": "\u201cShe\u2019s lovely,\u201d said Daisy.",
        "Embedding": "[-15.744017   14.7590885  25.53521  ]"
    },
    "1339": {
        "#": "1339",
        "Sentence": "\u201cThe man bending over her is her director.\u201dHe took them ceremoniously from group to group:\u201cMrs.",
        "Embedding": "[ 11.523381 -20.858332  31.461458]"
    },
    "1340": {
        "#": "1340",
        "Sentence": "Buchanan \u2026 and Mr. Buchanan\u2014\u201d After an instant\u2019s hesitation headded: \u201cthe polo player.\u201d\u201cOh no,\u201d objected Tom quickly, \u201cnot me.\u201dBut evidently the sound of it pleased Gatsby for Tom remained \u201cthepolo player\u201d for the rest of the evening.",
        "Embedding": "[13.367466  25.177776   7.7660437]"
    },
    "1341": {
        "#": "1341",
        "Sentence": "\u201cI\u2019ve never met so many celebrities,\u201d Daisy exclaimed.",
        "Embedding": "[-17.189545  11.148275  31.397486]"
    },
    "1342": {
        "#": "1342",
        "Sentence": "\u201cI liked thatman\u2014what was his name?\u2014with the sort of blue nose.\u201dGatsby identified him, adding that he was a small producer.",
        "Embedding": "[  1.0397387 -18.990648   12.981531 ]"
    },
    "1343": {
        "#": "1343",
        "Sentence": "\u201cWell, I liked him anyhow.\u201d\u201cI\u2019d a little rather not be the polo player,\u201d said Tom pleasantly,\u201cI\u2019d rather look at all these famous people in\u2014in oblivion.\u201dDaisy and Gatsby danced.",
        "Embedding": "[-11.165836   28.551243   -5.2959957]"
    },
    "1344": {
        "#": "1344",
        "Sentence": "I remember being surprised by his graceful,conservative foxtrot\u2014I had never seen him dance before.",
        "Embedding": "[ -4.0897365 -20.75545    -3.2527637]"
    },
    "1345": {
        "#": "1345",
        "Sentence": "Then theysauntered over to my house and sat on the steps for half an hour,while at her request I remained watchfully in the garden.",
        "Embedding": "[12.99738  10.460587 -7.850455]"
    },
    "1346": {
        "#": "1346",
        "Sentence": "\u201cIn casethere\u2019s a fire or a flood,\u201d she explained, \u201cor any act of God.\u201dTom appeared from his oblivion as we were sitting down to suppertogether.",
        "Embedding": "[17.402445 10.977698  9.49655 ]"
    },
    "1347": {
        "#": "1347",
        "Sentence": "\u201cDo you mind if I eat with some people over here?\u201d he said.",
        "Embedding": "[-10.787303  12.050771 -20.466318]"
    },
    "1348": {
        "#": "1348",
        "Sentence": "\u201cA fellow\u2019s getting off some funny stuff.\u201d\u201cGo ahead,\u201d answered Daisy genially, \u201cand if you want to take down anyaddresses here\u2019s my little gold pencil.\u201d \u2026 She looked around after amoment and told me the girl was \u201ccommon but pretty,\u201d and I knew thatexcept for the half-hour she\u2019d been alone with Gatsby she wasn\u2019thaving a good time.",
        "Embedding": "[-1.5913581 22.478022  24.967611 ]"
    },
    "1349": {
        "#": "1349",
        "Sentence": "We were at a particularly tipsy table.",
        "Embedding": "[ 16.53935  -40.87302  -13.767017]"
    },
    "1350": {
        "#": "1350",
        "Sentence": "That was my fault\u2014Gatsby hadbeen called to the phone, and I\u2019d enjoyed these same people only twoweeks before.",
        "Embedding": "[  7.92571   10.339568 -19.508965]"
    },
    "1351": {
        "#": "1351",
        "Sentence": "But what had amused me then turned septic on the airnow.",
        "Embedding": "[ -1.4494034 -33.507786    1.8569063]"
    },
    "1352": {
        "#": "1352",
        "Sentence": "\u201cHow do you feel, Miss Baedeker?\u201dThe girl addressed was trying, unsuccessfully, to slump against myshoulder.",
        "Embedding": "[ 2.3218367 -4.0371485 18.043081 ]"
    },
    "1353": {
        "#": "1353",
        "Sentence": "At this inquiry she sat up and opened her eyes.",
        "Embedding": "[ -5.8379807 -39.03785     8.040765 ]"
    },
    "1354": {
        "#": "1354",
        "Sentence": "\u201cWha\u2019?\u201dA massive and lethargic woman, who had been urging Daisy to play golfwith her at the local club tomorrow, spoke in Miss Baedeker\u2019s defence:\u201cOh, she\u2019s all right now.",
        "Embedding": "[-0.6710491 20.204863  24.47033  ]"
    },
    "1355": {
        "#": "1355",
        "Sentence": "When she\u2019s had five or six cocktails shealways starts screaming like that.",
        "Embedding": "[17.803247   2.3828743 41.625725 ]"
    },
    "1356": {
        "#": "1356",
        "Sentence": "I tell her she ought to leave italone.\u201d\u201cI do leave it alone,\u201d affirmed the accused hollowly.",
        "Embedding": "[-24.465208   -2.1019733   1.9218502]"
    },
    "1357": {
        "#": "1357",
        "Sentence": "\u201cWe heard you yelling, so I said to Doc Civet here: \u2018There\u2019s somebodythat needs your help, Doc.\u2019\u200a\u201d\u201cShe\u2019s much obliged, I\u2019m sure,\u201d said another friend, withoutgratitude, \u201cbut you got her dress all wet when you stuck her head inthe pool.\u201d\u201cAnything I hate is to get my head stuck in a pool,\u201d mumbled MissBaedeker.",
        "Embedding": "[ 8.69979    1.3691831 -3.896759 ]"
    },
    "1358": {
        "#": "1358",
        "Sentence": "\u201cThey almost drowned me once over in New Jersey.\u201d\u201cThen you ought to leave it alone,\u201d countered Doctor Civet.",
        "Embedding": "[  8.233867  -9.123922 -21.752455]"
    },
    "1359": {
        "#": "1359",
        "Sentence": "\u201cSpeak for yourself!\u201d cried Miss Baedeker violently.",
        "Embedding": "[-30.823614    2.7928193  18.497068 ]"
    },
    "1360": {
        "#": "1360",
        "Sentence": "\u201cYour handshakes.",
        "Embedding": "[-37.61754    -1.7409176 -23.056831 ]"
    },
    "1361": {
        "#": "1361",
        "Sentence": "I wouldn\u2019t let you operate on me!\u201dIt was like that.",
        "Embedding": "[-15.905351    0.4673833 -21.362871 ]"
    },
    "1362": {
        "#": "1362",
        "Sentence": "Almost the last thing I remember was standing withDaisy and watching the moving-picture director and his Star.",
        "Embedding": "[ 14.156233 -23.05327   -7.815884]"
    },
    "1363": {
        "#": "1363",
        "Sentence": "They werestill under the white-plum tree and their faces were touching exceptfor a pale, thin ray of moonlight between.",
        "Embedding": "[34.493557   7.7620716  2.2936032]"
    },
    "1364": {
        "#": "1364",
        "Sentence": "It occurred to me that he had been very slowly bending toward her all evening to attain thisproximity, and even while I watched I saw him stoop one ultimatedegree and kiss at her cheek.",
        "Embedding": "[ 3.397511 -4.188109  8.941171]"
    },
    "1365": {
        "#": "1365",
        "Sentence": "\u201cI like her,\u201d said Daisy, \u201cI think she\u2019s lovely.\u201dBut the rest offended her\u2014and inarguably because it wasn\u2019t a gesturebut an emotion.",
        "Embedding": "[-7.3320885 10.210923  25.823576 ]"
    },
    "1366": {
        "#": "1366",
        "Sentence": "She was appalled by West Egg, this unprecedented\u201cplace\u201d that Broadway had begotten upon a Long Island fishingvillage\u2014appalled by its raw vigour that chafed under the oldeuphemisms and by the too obtrusive fate that herded its inhabitantsalong a shortcut from nothing to nothing.",
        "Embedding": "[27.804893  34.119873  -2.5375383]"
    },
    "1367": {
        "#": "1367",
        "Sentence": "She saw something awful inthe very simplicity she failed to understand.",
        "Embedding": "[-16.884926 -24.852219  17.966585]"
    },
    "1368": {
        "#": "1368",
        "Sentence": "I sat on the front steps with them while they waited for their car.",
        "Embedding": "[ 17.659616   -5.3614717 -11.659161 ]"
    },
    "1369": {
        "#": "1369",
        "Sentence": "It was dark here in front; only the bright door sent ten square feetof light volleying out into the soft black morning.",
        "Embedding": "[ 36.782547  -7.250197 -11.759492]"
    },
    "1370": {
        "#": "1370",
        "Sentence": "Sometimes a shadowmoved against a dressing-room blind above, gave way to another shadow,an indefinite procession of shadows, who rouged and powdered in aninvisible glass.",
        "Embedding": "[34.311314  -0.0379061  7.2462673]"
    },
    "1371": {
        "#": "1371",
        "Sentence": "\u201cWho is this Gatsby anyhow?\u201d demanded Tom suddenly.",
        "Embedding": "[-0.8162016 35.609642  -0.253282 ]"
    },
    "1372": {
        "#": "1372",
        "Sentence": "\u201cSome bigbootlegger?\u201d\u201cWhere\u2019d you hear that?\u201d I inquired.",
        "Embedding": "[-23.851973    -0.98259443  -7.4920444 ]"
    },
    "1373": {
        "#": "1373",
        "Sentence": "\u201cI didn\u2019t hear it.",
        "Embedding": "[-30.720327 -13.845166  -3.102474]"
    },
    "1374": {
        "#": "1374",
        "Sentence": "I imagined it.",
        "Embedding": "[-34.357166 -15.196824 -12.255572]"
    },
    "1375": {
        "#": "1375",
        "Sentence": "A lot of these newly rich people arejust big bootleggers, you know.\u201d\u201cNot Gatsby,\u201d I said shortly.",
        "Embedding": "[-9.01027   30.977856  -4.1490693]"
    },
    "1376": {
        "#": "1376",
        "Sentence": "He was silent for a moment.",
        "Embedding": "[-20.513115  -35.18358    -0.6280073]"
    },
    "1377": {
        "#": "1377",
        "Sentence": "The pebbles of the drive crunched underhis feet.",
        "Embedding": "[ -0.8812601 -27.87247   -34.66898  ]"
    },
    "1378": {
        "#": "1378",
        "Sentence": "\u201cWell, he certainly must have strained himself to get this menagerietogether.\u201dA breeze stirred the grey haze of Daisy\u2019s fur collar.",
        "Embedding": "[ 5.99208  27.663393 25.158136]"
    },
    "1379": {
        "#": "1379",
        "Sentence": "\u201cAt least they are more interesting than the people we know,\u201d she saidwith an effort.",
        "Embedding": "[-42.03096  -12.948072  15.273368]"
    },
    "1380": {
        "#": "1380",
        "Sentence": "\u201cYou didn\u2019t look so interested.\u201d\u201cWell, I was.\u201dTom laughed and turned to me.",
        "Embedding": "[  0.7627982 -28.851437  -10.800756 ]"
    },
    "1381": {
        "#": "1381",
        "Sentence": "\u201cDid you notice Daisy\u2019s face when that girl asked her to put her undera cold shower?\u201dDaisy began to sing with the music in a husky, rhythmic whisper,bringing out a meaning in each word that it had never had before andwould never have again.",
        "Embedding": "[  6.510077 -12.219605  34.185684]"
    },
    "1382": {
        "#": "1382",
        "Sentence": "When the melody rose her voice broke upsweetly, following it, in a way contralto voices have, and each changetipped out a little of her warm human magic upon the air.",
        "Embedding": "[10.393261 -7.267815 36.919373]"
    },
    "1383": {
        "#": "1383",
        "Sentence": "\u201cLots of people come who haven\u2019t been invited,\u201d she saidsuddenly.",
        "Embedding": "[-43.307285 -13.012958  12.484435]"
    },
    "1384": {
        "#": "1384",
        "Sentence": "\u201cThat girl hadn\u2019t been invited.",
        "Embedding": "[-17.779972 -10.769526 -34.132816]"
    },
    "1385": {
        "#": "1385",
        "Sentence": "They simply force their wayin and he\u2019s too polite to object.\u201d\u201cI\u2019d like to know who he is and what he does,\u201d insisted Tom.",
        "Embedding": "[-13.42279    23.694654    0.5580629]"
    },
    "1386": {
        "#": "1386",
        "Sentence": "\u201cAnd Ithink I\u2019ll make a point of finding out.\u201d\u201cI can tell you right now,\u201d she answered.",
        "Embedding": "[-20.78092    -2.9103305   6.90811  ]"
    },
    "1387": {
        "#": "1387",
        "Sentence": "\u201cHe owned some drugstores, alot of drugstores.",
        "Embedding": "[-17.314926 -31.811752   9.893114]"
    },
    "1388": {
        "#": "1388",
        "Sentence": "He built them up himself.\u201dThe dilatory limousine came rolling up the drive.",
        "Embedding": "[ 21.988808 -13.939115 -19.62687 ]"
    },
    "1389": {
        "#": "1389",
        "Sentence": "\u201cGood night, Nick,\u201d said Daisy.",
        "Embedding": "[-18.338928  14.968518  20.52552 ]"
    },
    "1390": {
        "#": "1390",
        "Sentence": "Her glance left me and sought the lighted top of the steps, where\u201cThree O\u2019Clock in the Morning,\u201d a neat, sad little waltz of that year,was drifting out the open door.",
        "Embedding": "[13.822347 -4.900143  9.25821 ]"
    },
    "1391": {
        "#": "1391",
        "Sentence": "After all, in the very casualness ofGatsby\u2019s party there were romantic possibilities totally absent fromher world.",
        "Embedding": "[ 2.0059388 43.488598  16.87505  ]"
    },
    "1392": {
        "#": "1392",
        "Sentence": "What was it up there in the song that seemed to be callingher back inside?",
        "Embedding": "[-29.773207 -27.58851  -29.522764]"
    },
    "1393": {
        "#": "1393",
        "Sentence": "What would happen now in the dim, incalculable hours?",
        "Embedding": "[-13.700577 -11.544803 -21.006247]"
    },
    "1394": {
        "#": "1394",
        "Sentence": "Perhaps some unbelievable guest would arrive, a person infinitely rareand to be marvelled at, some authentically radiant young girl who withone fresh glance at Gatsby, one moment of magical encounter, wouldblot out those five years of unwavering devotion.",
        "Embedding": "[-2.6878867 29.061459  13.4200735]"
    },
    "1395": {
        "#": "1395",
        "Sentence": "I stayed late that night.",
        "Embedding": "[-30.317528 -19.543941 -18.771772]"
    },
    "1396": {
        "#": "1396",
        "Sentence": "Gatsby asked me to wait until he was free,and I lingered in the garden until the inevitable swimming party hadrun up, chilled and exalted, from the black beach, until the lightswere extinguished in the guestrooms overhead.",
        "Embedding": "[11.952662  26.860695  -1.2750324]"
    },
    "1397": {
        "#": "1397",
        "Sentence": "When he came down thesteps at last the tanned skin was drawn unusually tight on his face,and his eyes were bright and tired.",
        "Embedding": "[ 31.962133 -17.82476    8.048359]"
    },
    "1398": {
        "#": "1398",
        "Sentence": "\u201cShe didn\u2019t like it,\u201d he said immediately.",
        "Embedding": "[-19.45598  -22.649782   8.976875]"
    },
    "1399": {
        "#": "1399",
        "Sentence": "\u201cOf course she did.\u201d\u201cShe didn\u2019t like it,\u201d he insisted.",
        "Embedding": "[-20.610247 -20.054737   9.76892 ]"
    },
    "1400": {
        "#": "1400",
        "Sentence": "\u201cShe didn\u2019t have a good time.\u201dHe was silent, and I guessed at his unutterable depression.",
        "Embedding": "[ -8.292704 -14.394393  17.949715]"
    },
    "1401": {
        "#": "1401",
        "Sentence": "\u201cI feel far away from her,\u201d he said.",
        "Embedding": "[-23.397655 -18.268314   6.063659]"
    },
    "1402": {
        "#": "1402",
        "Sentence": "\u201cIt\u2019s hard to make herunderstand.\u201d\u201cYou mean about the dance?\u201d\u201cThe dance?\u201d He dismissed all the dances he had given with a snap ofhis fingers.",
        "Embedding": "[ 9.517576 -9.914815  3.295178]"
    },
    "1403": {
        "#": "1403",
        "Sentence": "\u201cOld sport, the dance is unimportant.\u201dHe wanted nothing less of Daisy than that she should go to Tom andsay: \u201cI never loved you.\u201d After she had obliterated four years withthat sentence they could decide upon the more practical measures to betaken.",
        "Embedding": "[ 1.227031 24.565996  8.638155]"
    },
    "1404": {
        "#": "1404",
        "Sentence": "One of them was that, after she was free, they were to go backto Louisville and be married from her house\u2014just as if it were fiveyears ago.",
        "Embedding": "[-10.937366  11.591147   9.89806 ]"
    },
    "1405": {
        "#": "1405",
        "Sentence": "\u201cAnd she doesn\u2019t understand,\u201d he said.",
        "Embedding": "[-20.722391  -22.137512    5.9479523]"
    },
    "1406": {
        "#": "1406",
        "Sentence": "\u201cShe used to be able tounderstand.",
        "Embedding": "[-25.845232 -23.565258  15.24503 ]"
    },
    "1407": {
        "#": "1407",
        "Sentence": "We\u2019d sit for hours\u2014\u201dHe broke off and began to walk up and down a desolate path of fruitrinds and discarded favours and crushed flowers.",
        "Embedding": "[24.623148   6.7032895 15.365715 ]"
    },
    "1408": {
        "#": "1408",
        "Sentence": "\u201cI wouldn\u2019t ask too much of her,\u201d I ventured.",
        "Embedding": "[-17.905052 -15.075162   9.050684]"
    },
    "1409": {
        "#": "1409",
        "Sentence": "\u201cYou can\u2019t repeat thepast.\u201d\u201cCan\u2019t repeat the past?\u201d he cried incredulously.",
        "Embedding": "[-26.268597    2.5481043  19.282389 ]"
    },
    "1410": {
        "#": "1410",
        "Sentence": "\u201cWhy of course youcan!\u201dHe looked around him wildly, as if the past were lurking here in theshadow of his house, just out of reach of his hand.",
        "Embedding": "[ 1.8792089  1.2684119 24.30012  ]"
    },
    "1411": {
        "#": "1411",
        "Sentence": "\u201cI\u2019m going to fix everything just the way it was before,\u201d he said,nodding determinedly.",
        "Embedding": "[ -9.986268 -17.364805   4.574095]"
    },
    "1412": {
        "#": "1412",
        "Sentence": "\u201cShe\u2019ll see.\u201dHe talked a lot about the past, and I gathered that he wanted torecover something, some idea of himself perhaps, that had gone intoloving Daisy.",
        "Embedding": "[-7.788777   5.9827566 24.566202 ]"
    },
    "1413": {
        "#": "1413",
        "Sentence": "His life had been confused and disordered since then,but if he could once return to a certain starting place and go over itall slowly, he could find out what that thing was \u2026\u2026 One autumn night, five years before, they had been walking down thestreet when the leaves were falling, and they came to a place wherethere were no trees and the sidewalk was white with moonlight.",
        "Embedding": "[21.296928  13.7592535  7.7485785]"
    },
    "1414": {
        "#": "1414",
        "Sentence": "Theystopped here and turned toward each other.",
        "Embedding": "[ -3.64177  -40.21541   -2.036645]"
    },
    "1415": {
        "#": "1415",
        "Sentence": "Now it was a cool nightwith that mysterious excitement in it which comes at the two changesof the year.",
        "Embedding": "[ 34.625122 -18.74675  -18.786144]"
    },
    "1416": {
        "#": "1416",
        "Sentence": "The quiet lights in the houses were humming out into thedarkness and there was a stir and bustle among the stars.",
        "Embedding": "[34.291855   3.0417147 18.49026  ]"
    },
    "1417": {
        "#": "1417",
        "Sentence": "Out of thecorner of his eye Gatsby saw that the blocks of the sidewalks reallyformed a ladder and mounted to a secret place above the trees\u2014he couldclimb to it, if he climbed alone, and once there he could suck on thepap of life, gulp down the incomparable milk of wonder.",
        "Embedding": "[17.297766 26.330767 -4.845562]"
    },
    "1418": {
        "#": "1418",
        "Sentence": "His heart beat faster as Daisy\u2019s white face came up to his own.",
        "Embedding": "[-12.161181    3.6703687  33.560253 ]"
    },
    "1419": {
        "#": "1419",
        "Sentence": "Heknew that when he kissed this girl, and forever wed his unutterablevisions to her perishable breath, his mind would never romp again likethe mind of God.",
        "Embedding": "[ 13.436222 -12.717624  29.334806]"
    },
    "1420": {
        "#": "1420",
        "Sentence": "So he waited, listening for a moment longer to thetuning-fork that had been struck upon a star.",
        "Embedding": "[ 16.006742  -12.67897     2.0965126]"
    },
    "1421": {
        "#": "1421",
        "Sentence": "Then he kissed her.",
        "Embedding": "[-27.54225  -28.187685   9.255055]"
    },
    "1422": {
        "#": "1422",
        "Sentence": "Athis lips\u2019 touch she blossomed for him like a flower and theincarnation was complete.",
        "Embedding": "[10.735618   -0.71426886 31.893616  ]"
    },
    "1423": {
        "#": "1423",
        "Sentence": "Through all he said, even through his appalling sentimentality, I wasreminded of something\u2014an elusive rhythm, a fragment of lost words,that I had heard somewhere a long time ago.",
        "Embedding": "[  6.0824456 -14.10472     3.997089 ]"
    },
    "1424": {
        "#": "1424",
        "Sentence": "For a moment a phrasetried to take shape in my mouth and my lips parted like a dumb man\u2019s,as though there was more struggling upon them than a wisp of startledair.",
        "Embedding": "[ 6.25067   -0.3305399 10.581783 ]"
    },
    "1425": {
        "#": "1425",
        "Sentence": "But they made no sound, and what I had almost remembered wasuncommunicable forever.",
        "Embedding": "[-21.416285  -41.6299      2.0454855]"
    },
    "1426": {
        "#": "1426",
        "Sentence": "VIIIt was when curiosity about Gatsby was at its highest that the lightsin his house failed to go on one Saturday night\u2014and, as obscurely asit had begun, his career as Trimalchio was over.",
        "Embedding": "[14.2522545 32.63722    1.0050025]"
    },
    "1427": {
        "#": "1427",
        "Sentence": "Only gradually did Ibecome aware that the automobiles which turned expectantly into hisdrive stayed for just a minute and then drove sulkily away.",
        "Embedding": "[26.381077  -2.5162578  0.5426251]"
    },
    "1428": {
        "#": "1428",
        "Sentence": "Wonderingif he were sick I went over to find out\u2014an unfamiliar butler with avillainous face squinted at me suspiciously from the door.",
        "Embedding": "[9.877684  2.604876  6.9781985]"
    },
    "1429": {
        "#": "1429",
        "Sentence": "\u201cIs Mr. Gatsby sick?\u201d\u201cNope.\u201d After a pause he added \u201csir\u201d in a dilatory, grudging way.",
        "Embedding": "[-0.03882152 37.482906   -4.295296  ]"
    },
    "1430": {
        "#": "1430",
        "Sentence": "\u201cI hadn\u2019t seen him around, and I was rather worried.",
        "Embedding": "[ -6.186877 -17.294363 -12.707865]"
    },
    "1431": {
        "#": "1431",
        "Sentence": "Tell him Mr.Carraway came over.\u201d\u201cWho?\u201d he demanded rudely.",
        "Embedding": "[-14.352969  -12.755719   -6.1769834]"
    },
    "1432": {
        "#": "1432",
        "Sentence": "\u201cCarraway.\u201d\u201cCarraway.",
        "Embedding": "[-48.856815 -10.758008 -16.363949]"
    },
    "1433": {
        "#": "1433",
        "Sentence": "All right, I\u2019ll tell him.\u201dAbruptly he slammed the door.",
        "Embedding": "[ 13.828048 -25.121017 -19.054976]"
    },
    "1434": {
        "#": "1434",
        "Sentence": "My Finn informed me that Gatsby had dismissed every servant in hishouse a week ago and replaced them with half a dozen others, who neverwent into West Egg village to be bribed by the tradesmen, but orderedmoderate supplies over the telephone.",
        "Embedding": "[  8.885198  17.578886 -24.745443]"
    },
    "1435": {
        "#": "1435",
        "Sentence": "The grocery boy reported thatthe kitchen looked like a pigsty, and the general opinion in thevillage was that the new people weren\u2019t servants at all.",
        "Embedding": "[ 20.494188  -21.35005    -1.9621465]"
    },
    "1436": {
        "#": "1436",
        "Sentence": "Next day Gatsby called me on the phone.",
        "Embedding": "[ 10.313086  34.288254 -11.017754]"
    },
    "1437": {
        "#": "1437",
        "Sentence": "\u201cGoing away?\u201d I inquired.",
        "Embedding": "[-29.879293   -1.9114081  -9.521467 ]"
    },
    "1438": {
        "#": "1438",
        "Sentence": "\u201cNo, old sport.\u201d\u201cI hear you fired all your servants.\u201d\u201cI wanted somebody who wouldn\u2019t gossip.",
        "Embedding": "[-15.559654  18.398281 -24.542723]"
    },
    "1439": {
        "#": "1439",
        "Sentence": "Daisy comes over quiteoften\u2014in the afternoons.\u201dSo the whole caravansary had fallen in like a card house at thedisapproval in her eyes.",
        "Embedding": "[ 4.0580106  1.2521138 26.15777  ]"
    },
    "1440": {
        "#": "1440",
        "Sentence": "\u201cThey\u2019re some people Wolfshiem wanted to do something for.",
        "Embedding": "[-16.610954 -34.723724 -16.856037]"
    },
    "1441": {
        "#": "1441",
        "Sentence": "They\u2019re allbrothers and sisters.",
        "Embedding": "[-19.577698 -31.955784 -19.999498]"
    },
    "1442": {
        "#": "1442",
        "Sentence": "They used to run a small hotel.\u201d\u201cI see.\u201dHe was calling up at Daisy\u2019s request\u2014would I come to lunch at herhouse tomorrow?",
        "Embedding": "[ 30.337032  22.865654 -11.210575]"
    },
    "1443": {
        "#": "1443",
        "Sentence": "Miss Baker would be there.",
        "Embedding": "[-5.3830285  8.639954   7.3646183]"
    },
    "1444": {
        "#": "1444",
        "Sentence": "Half an hour later Daisyherself telephoned and seemed relieved to find that I wascoming.",
        "Embedding": "[ 19.96557  -23.298086 -14.328959]"
    },
    "1445": {
        "#": "1445",
        "Sentence": "Something was up.",
        "Embedding": "[-23.09065  -11.944035 -17.246601]"
    },
    "1446": {
        "#": "1446",
        "Sentence": "And yet I couldn\u2019t believe that they wouldchoose this occasion for a scene\u2014especially for the rather harrowingscene that Gatsby had outlined in the garden.",
        "Embedding": "[ 5.743565  29.75859    2.9743865]"
    },
    "1447": {
        "#": "1447",
        "Sentence": "The next day was broiling, almost the last, certainly the warmest, ofthe summer.",
        "Embedding": "[ 24.198662 -17.345676 -30.000135]"
    },
    "1448": {
        "#": "1448",
        "Sentence": "As my train emerged from the tunnel into sunlight, onlythe hot whistles of the National Biscuit Company broke the simmeringhush at noon.",
        "Embedding": "[34.526974  20.438934  -4.6945734]"
    },
    "1449": {
        "#": "1449",
        "Sentence": "The straw seats of the car hovered on the edge ofcombustion; the woman next to me perspired delicately for a while into her white shirtwaist, and then, as her newspaper dampened under herfingers, lapsed despairingly into deep heat with a desolate cry.",
        "Embedding": "[30.242842   4.2623987 12.186435 ]"
    },
    "1450": {
        "#": "1450",
        "Sentence": "Herpocketbook slapped to the floor.",
        "Embedding": "[-36.146423 -29.340706 -21.29833 ]"
    },
    "1451": {
        "#": "1451",
        "Sentence": "\u201cOh, my!\u201d she gasped.",
        "Embedding": "[-29.451023  -9.748192  12.144451]"
    },
    "1452": {
        "#": "1452",
        "Sentence": "I picked it up with a weary bend and handed it back to her, holding itat arm\u2019s length and by the extreme tip of the corners to indicate thatI had no designs upon it\u2014but everyone near by, including the woman,suspected me just the same.",
        "Embedding": "[12.020472 -9.404589 17.705162]"
    },
    "1453": {
        "#": "1453",
        "Sentence": "\u201cHot!\u201d said the conductor to familiar faces.",
        "Embedding": "[ 12.40281    -6.8508763 -35.566708 ]"
    },
    "1454": {
        "#": "1454",
        "Sentence": "\u201cSome weather!",
        "Embedding": "[-44.50522    -5.4304223 -22.502779 ]"
    },
    "1455": {
        "#": "1455",
        "Sentence": "\u2026 Hot!",
        "Embedding": "[-43.216377   -2.8059256 -18.346796 ]"
    },
    "1456": {
        "#": "1456",
        "Sentence": "\u2026Hot!",
        "Embedding": "[-51.526386 -11.424924 -16.953745]"
    },
    "1457": {
        "#": "1457",
        "Sentence": "\u2026 Hot!",
        "Embedding": "[-44.576454   -1.6140953 -18.925064 ]"
    },
    "1458": {
        "#": "1458",
        "Sentence": "\u2026 Is it hot enough for you?",
        "Embedding": "[-29.233433  14.264142 -26.685667]"
    },
    "1459": {
        "#": "1459",
        "Sentence": "Is it hot?",
        "Embedding": "[-30.895468  15.200182 -26.285244]"
    },
    "1460": {
        "#": "1460",
        "Sentence": "Is it \u2026\u200a?\u201dMy commutation ticket came back to me with a dark stain from his hand.",
        "Embedding": "[ 11.116141 -16.268045 -40.374252]"
    },
    "1461": {
        "#": "1461",
        "Sentence": "That anyone should care in this heat whose flushed lips he kissed,whose head made damp the pyjama pocket over his heart!",
        "Embedding": "[13.526381  -4.0996323 14.872398 ]"
    },
    "1462": {
        "#": "1462",
        "Sentence": "\u2026 Through the hall of the Buchanans\u2019 house blew a faint wind, carrying the sound of the telephone bell out to Gatsby and me as we waited atthe door.",
        "Embedding": "[42.17946    3.8667016  3.6243067]"
    },
    "1463": {
        "#": "1463",
        "Sentence": "\u201cThe master\u2019s body?\u201d roared the butler into the mouthpiece.",
        "Embedding": "[ -2.0829465   9.400736  -28.506405 ]"
    },
    "1464": {
        "#": "1464",
        "Sentence": "\u201cI\u2019msorry, madame, but we can\u2019t furnish it\u2014it\u2019s far too hot to touch thisnoon!\u201dWhat he really said was: \u201cYes \u2026 Yes \u2026 I\u2019ll see.\u201dHe set down the receiver and came toward us, glistening slightly, totake our stiff straw hats.",
        "Embedding": "[16.04875    2.2007306  5.333453 ]"
    },
    "1465": {
        "#": "1465",
        "Sentence": "\u201cMadame expects you in the salon!\u201d he cried, needlessly indicating thedirection.",
        "Embedding": "[-27.926575   -1.4670935  24.806168 ]"
    },
    "1466": {
        "#": "1466",
        "Sentence": "In this heat every extra gesture was an affront to thecommon store of life.",
        "Embedding": "[  6.3853374 -21.68392    26.209599 ]"
    },
    "1467": {
        "#": "1467",
        "Sentence": "The room, shadowed well with awnings, was dark and cool.",
        "Embedding": "[ 36.48792  -12.318444  -8.139971]"
    },
    "1468": {
        "#": "1468",
        "Sentence": "Daisy andJordan lay upon an enormous couch, like silver idols weighing downtheir own white dresses against the singing breeze of the fans.",
        "Embedding": "[22.17594  26.279    16.012823]"
    },
    "1469": {
        "#": "1469",
        "Sentence": "\u201cWe can\u2019t move,\u201d they said together.",
        "Embedding": "[-43.64705    -3.4134336   2.1423573]"
    },
    "1470": {
        "#": "1470",
        "Sentence": "Jordan\u2019s fingers, powdered white over their tan, rested for a momentin mine.",
        "Embedding": "[-3.0266936 17.824621  -4.9587193]"
    },
    "1471": {
        "#": "1471",
        "Sentence": "\u201cAnd Mr. Thomas Buchanan, the athlete?\u201d I inquired.",
        "Embedding": "[-21.09181    34.41949     3.2187955]"
    },
    "1472": {
        "#": "1472",
        "Sentence": "Simultaneously I heard his voice, gruff, muffled, husky, at the halltelephone.",
        "Embedding": "[  9.191978 -12.13214   41.98153 ]"
    },
    "1473": {
        "#": "1473",
        "Sentence": "Gatsby stood in the centre of the crimson carpet and gazed around withfascinated eyes.",
        "Embedding": "[ 6.68742  38.123074 11.20875 ]"
    },
    "1474": {
        "#": "1474",
        "Sentence": "Daisy watched him and laughed, her sweet, excitinglaugh; a tiny gust of powder rose from her bosom into the air.",
        "Embedding": "[ 7.4519825  0.9802987 32.368206 ]"
    },
    "1475": {
        "#": "1475",
        "Sentence": "\u201cThe rumour is,\u201d whispered Jordan, \u201cthat that\u2019s Tom\u2019s girl on thetelephone.\u201dWe were silent.",
        "Embedding": "[-11.492895    17.02836     -0.85957843]"
    },
    "1476": {
        "#": "1476",
        "Sentence": "The voice in the hall rose high with annoyance: \u201cVerywell, then, I won\u2019t sell you the car at all \u2026 I\u2019m under no obligationsto you at all \u2026 and as for your bothering me about it at lunch time, Iwon\u2019t stand that at all!\u201d\u201cHolding down the receiver,\u201d said Daisy cynically.",
        "Embedding": "[  5.3863835  12.1930485 -11.516113 ]"
    },
    "1477": {
        "#": "1477",
        "Sentence": "\u201cNo, he\u2019s not,\u201d I assured her.",
        "Embedding": "[-27.244854 -22.362015   7.476175]"
    },
    "1478": {
        "#": "1478",
        "Sentence": "\u201cIt\u2019s a bona-fide deal.",
        "Embedding": "[-40.848328 -19.950123   2.652988]"
    },
    "1479": {
        "#": "1479",
        "Sentence": "I happen toknow about it.\u201dTom flung open the door, blocked out its space for a moment with histhick body, and hurried into the room.",
        "Embedding": "[32.42724  -7.471235 -7.004876]"
    },
    "1480": {
        "#": "1480",
        "Sentence": "\u201cMr.",
        "Embedding": "[-42.632507 -12.855596 -16.221254]"
    },
    "1481": {
        "#": "1481",
        "Sentence": "Gatsby!\u201d He put out his broad, flat hand with well-concealeddislike.",
        "Embedding": "[ 3.0038557 42.55448    5.019321 ]"
    },
    "1482": {
        "#": "1482",
        "Sentence": "\u201cI\u2019m glad to see you, sir \u2026 Nick \u2026\u201d\u201cMake us a cold drink,\u201d cried Daisy.",
        "Embedding": "[-22.668768  16.673254  19.017498]"
    },
    "1483": {
        "#": "1483",
        "Sentence": "As he left the room again she got up and went over to Gatsby andpulled his face down, kissing him on the mouth.",
        "Embedding": "[17.108192  -1.4312122 30.558483 ]"
    },
    "1484": {
        "#": "1484",
        "Sentence": "\u201cYou know I love you,\u201d she murmured.",
        "Embedding": "[-24.335432   -3.2815673  14.287949 ]"
    },
    "1485": {
        "#": "1485",
        "Sentence": "\u201cYou forget there\u2019s a lady present,\u201d said Jordan.",
        "Embedding": "[-8.815883  15.516504  -3.0371165]"
    },
    "1486": {
        "#": "1486",
        "Sentence": "Daisy looked around doubtfully.",
        "Embedding": "[-21.019342  17.049088  28.45113 ]"
    },
    "1487": {
        "#": "1487",
        "Sentence": "\u201cYou kiss Nick too.\u201d\u201cWhat a low, vulgar girl!\u201d\u201cI don\u2019t care!\u201d cried Daisy, and began to clog on the brick fireplace.",
        "Embedding": "[-4.354155 28.472353 25.638208]"
    },
    "1488": {
        "#": "1488",
        "Sentence": "Then she remembered the heat and sat down guiltily on the couch justas a freshly laundered nurse leading a little girl came into the room.",
        "Embedding": "[20.397326  6.930305 22.80111 ]"
    },
    "1489": {
        "#": "1489",
        "Sentence": "\u201cBles-sed pre-cious,\u201d she crooned, holding out her arms.",
        "Embedding": "[-32.329895 -10.451171  18.45612 ]"
    },
    "1490": {
        "#": "1490",
        "Sentence": "\u201cCome to yourown mother that loves you.\u201dThe child, relinquished by the nurse, rushed across the room androoted shyly into her mother\u2019s dress.",
        "Embedding": "[18.012972   7.5298257 22.189713 ]"
    },
    "1491": {
        "#": "1491",
        "Sentence": "\u201cThe bles-sed pre-cious!",
        "Embedding": "[-34.41961  -10.880892  18.515478]"
    },
    "1492": {
        "#": "1492",
        "Sentence": "Did mother get powder on your old yellowyhair?",
        "Embedding": "[-17.330439    2.7023432 -30.909107 ]"
    },
    "1493": {
        "#": "1493",
        "Sentence": "Stand up now, and say\u2014How-de-do.\u201dGatsby and I in turn leaned down and took the small reluctant hand.",
        "Embedding": "[  7.865798   -36.495914     0.23411672]"
    },
    "1494": {
        "#": "1494",
        "Sentence": "Afterward he kept looking at the child with surprise.",
        "Embedding": "[ -1.1449895 -33.838017   -3.4436984]"
    },
    "1495": {
        "#": "1495",
        "Sentence": "I don\u2019t think he had ever really believed in its existence before.",
        "Embedding": "[ -4.699817  -19.602634    0.3675159]"
    },
    "1496": {
        "#": "1496",
        "Sentence": "\u201cI got dressed before luncheon,\u201d said the child, turning eagerly toDaisy.",
        "Embedding": "[ -4.4553347  -4.1843905 -12.475676 ]"
    },
    "1497": {
        "#": "1497",
        "Sentence": "\u201cThat\u2019s because your mother wanted to show you off.\u201d Her face bentinto the single wrinkle of the small white neck.",
        "Embedding": "[-10.852547  13.398407 -35.749355]"
    },
    "1498": {
        "#": "1498",
        "Sentence": "\u201cYou dream, you.",
        "Embedding": "[-32.21763     0.1307086 -23.426413 ]"
    },
    "1499": {
        "#": "1499",
        "Sentence": "Youabsolute little dream.\u201d\u201cYes,\u201d admitted the child calmly.",
        "Embedding": "[-16.780943 -22.821404 -15.283689]"
    },
    "1500": {
        "#": "1500",
        "Sentence": "\u201cAunt Jordan\u2019s got on a white dresstoo.\u201d\u201cHow do you like mother\u2019s friends?\u201d Daisy turned her around so thatshe faced Gatsby.",
        "Embedding": "[-3.2442622 35.057083  10.361534 ]"
    },
    "1501": {
        "#": "1501",
        "Sentence": "\u201cDo you think they\u2019re pretty?\u201d\u201cWhere\u2019s Daddy?\u201d\u201cShe doesn\u2019t look like her father,\u201d explained Daisy.",
        "Embedding": "[-13.723866  20.656963  29.83469 ]"
    },
    "1502": {
        "#": "1502",
        "Sentence": "\u201cShe looks likeme.",
        "Embedding": "[-28.992294 -22.300585  14.09674 ]"
    },
    "1503": {
        "#": "1503",
        "Sentence": "She\u2019s got my hair and shape of the face.\u201dDaisy sat back upon the couch.",
        "Embedding": "[14.949242  5.155842 32.892387]"
    },
    "1504": {
        "#": "1504",
        "Sentence": "The nurse took a step forward and heldout her hand.",
        "Embedding": "[  8.076577  -34.358784    3.3655496]"
    },
    "1505": {
        "#": "1505",
        "Sentence": "\u201cCome, Pammy.\u201d\u201cGoodbye, sweetheart!\u201dWith a reluctant backward glance the well-disciplined child held to her nurse\u2019s hand and was pulled out the door, just as Tom came back,preceding four gin rickeys that clicked full of ice.",
        "Embedding": "[12.287942   2.4674015  9.566909 ]"
    },
    "1506": {
        "#": "1506",
        "Sentence": "Gatsby took up his drink.",
        "Embedding": "[-2.0262523 41.433228   4.091819 ]"
    },
    "1507": {
        "#": "1507",
        "Sentence": "\u201cThey certainly look cool,\u201d he said, with visible tension.",
        "Embedding": "[-10.268494 -28.464838 -12.131933]"
    },
    "1508": {
        "#": "1508",
        "Sentence": "We drank in long, greedy swallows.",
        "Embedding": "[-2.2715399e-02 -1.8844976e+01 -2.7247066e+01]"
    },
    "1509": {
        "#": "1509",
        "Sentence": "\u201cI read somewhere that the sun\u2019s getting hotter every year,\u201d said Tomgenially.",
        "Embedding": "[ 19.615139 -21.37474  -30.705496]"
    },
    "1510": {
        "#": "1510",
        "Sentence": "\u201cIt seems that pretty soon the earth\u2019s going to fall into the sun\u2014or wait a minute\u2014it\u2019s just the opposite\u2014the sun\u2019s gettingcolder every year.",
        "Embedding": "[ 20.555435 -21.974955 -32.206703]"
    },
    "1511": {
        "#": "1511",
        "Sentence": "\u201cCome outside,\u201d he suggested to Gatsby, \u201cI\u2019d like you to have a lookat the place.\u201dI went with them out to the veranda.",
        "Embedding": "[ 1.2803241 23.713057  -1.8799529]"
    },
    "1512": {
        "#": "1512",
        "Sentence": "On the green Sound, stagnant inthe heat, one small sail crawled slowly toward the fresher sea.",
        "Embedding": "[42.181614   -0.41301546 15.916641  ]"
    },
    "1513": {
        "#": "1513",
        "Sentence": "Gatsby\u2019s eyes followed it momentarily; he raised his hand and pointedacross the bay.",
        "Embedding": "[ 22.947771 -23.918785  18.916176]"
    },
    "1514": {
        "#": "1514",
        "Sentence": "\u201cI\u2019m right across from you.\u201d\u201cSo you are.\u201dOur eyes lifted over the rose-beds and the hot lawn and the weedyrefuse of the dog-days alongshore.",
        "Embedding": "[33.10153    15.652031    0.56919676]"
    },
    "1515": {
        "#": "1515",
        "Sentence": "Slowly the white wings of the boatmoved against the blue cool limit of the sky.",
        "Embedding": "[44.972458   1.1764456 17.236713 ]"
    },
    "1516": {
        "#": "1516",
        "Sentence": "Ahead lay the scallopedocean and the abounding blessed isles.",
        "Embedding": "[  0.4553534 -43.890835   -3.4287834]"
    },
    "1517": {
        "#": "1517",
        "Sentence": "\u201cThere\u2019s sport for you,\u201d said Tom, nodding.",
        "Embedding": "[-20.892115   21.768885   -6.0932727]"
    },
    "1518": {
        "#": "1518",
        "Sentence": "\u201cI\u2019d like to be out therewith him for about an hour.\u201dWe had luncheon in the dining-room, darkened too against the heat, anddrank down nervous gaiety with the cold ale.",
        "Embedding": "[18.073696  4.026355  5.024267]"
    },
    "1519": {
        "#": "1519",
        "Sentence": "\u201cWhat\u2019ll we do with ourselves this afternoon?\u201d cried Daisy, \u201cand theday after that, and the next thirty years?\u201d\u201cDon\u2019t be morbid,\u201d Jordan said.",
        "Embedding": "[-4.53456 16.43351 32.07431]"
    },
    "1520": {
        "#": "1520",
        "Sentence": "\u201cLife starts all over again when itgets crisp in the fall.\u201d\u201cBut it\u2019s so hot,\u201d insisted Daisy, on the verge of tears, \u201candeverything\u2019s so confused.",
        "Embedding": "[-5.6254764 15.537069  27.415237 ]"
    },
    "1521": {
        "#": "1521",
        "Sentence": "Let\u2019s all go to town!\u201dHer voice struggled on through the heat, beating against it, mouldingits senselessness into forms.",
        "Embedding": "[ 41.216103 -10.284818  19.33765 ]"
    },
    "1522": {
        "#": "1522",
        "Sentence": "\u201cI\u2019ve heard of making a garage out of a stable,\u201d Tom was saying toGatsby, \u201cbut I\u2019m the first man who ever made a stable out of agarage.\u201d\u201cWho wants to go to town?\u201d demanded Daisy insistently.",
        "Embedding": "[-16.887688   24.240349   -3.1306016]"
    },
    "1523": {
        "#": "1523",
        "Sentence": "Gatsby\u2019s eyesfloated toward her.",
        "Embedding": "[-31.807241 -16.381233  14.371859]"
    },
    "1524": {
        "#": "1524",
        "Sentence": "\u201cAh,\u201d she cried, \u201cyou look so cool.\u201dTheir eyes met, and they stared together at each other, alone inspace.",
        "Embedding": "[ 27.292118  -29.04425     0.8962977]"
    },
    "1525": {
        "#": "1525",
        "Sentence": "With an effort she glanced down at the table.",
        "Embedding": "[ -3.3412702 -37.593525    8.945801 ]"
    },
    "1526": {
        "#": "1526",
        "Sentence": "\u201cYou always look so cool,\u201d she repeated.",
        "Embedding": "[-32.97998   -8.109631  11.693608]"
    },
    "1527": {
        "#": "1527",
        "Sentence": "She had told him that she loved him, and Tom Buchanan saw.",
        "Embedding": "[-12.628888 -12.464211  33.07862 ]"
    },
    "1528": {
        "#": "1528",
        "Sentence": "He wasastounded.",
        "Embedding": "[-27.202427  -30.396154   -2.5529172]"
    },
    "1529": {
        "#": "1529",
        "Sentence": "His mouth opened a little, and he looked at Gatsby, andthen back at Daisy as if he had just recognized her as someone he knewa long time ago.",
        "Embedding": "[-0.2540608 32.363316   9.488221 ]"
    },
    "1530": {
        "#": "1530",
        "Sentence": "\u201cYou resemble the advertisement of the man,\u201d she went on innocently.",
        "Embedding": "[-35.810993  -5.939487  11.179216]"
    },
    "1531": {
        "#": "1531",
        "Sentence": "\u201cYou know the advertisement of the man\u2014\u201d\u201cAll right,\u201d broke in Tom quickly, \u201cI\u2019m perfectly willing to go totown.",
        "Embedding": "[-20.5345    14.701986  -7.831215]"
    },
    "1532": {
        "#": "1532",
        "Sentence": "Come on\u2014we\u2019re all going to town.\u201dHe got up, his eyes still flashing between Gatsby and his wife.",
        "Embedding": "[ 4.4182034 35.867077   7.5257254]"
    },
    "1533": {
        "#": "1533",
        "Sentence": "No onemoved.",
        "Embedding": "[-39.60033   -5.687666 -13.170836]"
    },
    "1534": {
        "#": "1534",
        "Sentence": "\u201cCome on!\u201d His temper cracked a little.",
        "Embedding": "[  3.5991206 -31.224745  -30.669619 ]"
    },
    "1535": {
        "#": "1535",
        "Sentence": "\u201cWhat\u2019s the matter, anyhow?",
        "Embedding": "[-20.526676  -7.77365  -13.8213  ]"
    },
    "1536": {
        "#": "1536",
        "Sentence": "If we\u2019re going to town, let\u2019s start.\u201dHis hand, trembling with his effort at self-control, bore to his lipsthe last of his glass of ale.",
        "Embedding": "[19.52827   -3.4734256  6.6597214]"
    },
    "1537": {
        "#": "1537",
        "Sentence": "Daisy\u2019s voice got us to our feet and outon to the blazing gravel drive.",
        "Embedding": "[15.648603 16.470472 36.942104]"
    },
    "1538": {
        "#": "1538",
        "Sentence": "\u201cAre we just going to go?\u201d she objected.",
        "Embedding": "[-21.265974  -12.29417     7.0100074]"
    },
    "1539": {
        "#": "1539",
        "Sentence": "\u201cLike this?",
        "Embedding": "[-39.06027  -14.953255 -10.11737 ]"
    },
    "1540": {
        "#": "1540",
        "Sentence": "Aren\u2019t we going to let anyone smoke a cigarette first?\u201d\u201cEverybody smoked all through lunch.\u201d\u201cOh, let\u2019s have fun,\u201d she begged him.",
        "Embedding": "[ 41.767258 -16.67956   12.550966]"
    },
    "1541": {
        "#": "1541",
        "Sentence": "\u201cIt\u2019s too hot to fuss.\u201dHe didn\u2019t answer.",
        "Embedding": "[-30.792068   9.98385  -27.224834]"
    },
    "1542": {
        "#": "1542",
        "Sentence": "\u201cHave it your own way,\u201d she said.",
        "Embedding": "[-26.871445 -17.623272   8.902839]"
    },
    "1543": {
        "#": "1543",
        "Sentence": "\u201cCome on, Jordan.\u201dThey went upstairs to get ready while we three men stood thereshuffling the hot pebbles with our feet.",
        "Embedding": "[16.090841 12.933423 33.083584]"
    },
    "1544": {
        "#": "1544",
        "Sentence": "A silver curve of the moonhovered already in the western sky.",
        "Embedding": "[  2.6470509  18.477844  -35.107502 ]"
    },
    "1545": {
        "#": "1545",
        "Sentence": "Gatsby started to speak, changedhis mind, but not before Tom wheeled and faced him expectantly.",
        "Embedding": "[ 1.9421612 35.792618   4.2386227]"
    },
    "1546": {
        "#": "1546",
        "Sentence": "\u201cHave you got your stables here?\u201d asked Gatsby with an effort.",
        "Embedding": "[-11.825564   34.931637    1.9350877]"
    },
    "1547": {
        "#": "1547",
        "Sentence": "\u201cAbout a quarter of a mile down the road.\u201d\u201cOh.\u201dA pause.",
        "Embedding": "[ -7.431634 -11.103031 -39.022858]"
    },
    "1548": {
        "#": "1548",
        "Sentence": "\u201cI don\u2019t see the idea of going to town,\u201d broke out Tom savagely.",
        "Embedding": "[-21.079554   25.341928   -1.4583565]"
    },
    "1549": {
        "#": "1549",
        "Sentence": "\u201cWomen get these notions in their heads\u2014\u201d\u201cShall we take anything to drink?\u201d called Daisy from an upper window.",
        "Embedding": "[-12.041802  18.555902  26.569592]"
    },
    "1550": {
        "#": "1550",
        "Sentence": "\u201cI\u2019ll get some whisky,\u201d answered Tom.",
        "Embedding": "[-31.694422  20.020338  -4.225327]"
    },
    "1551": {
        "#": "1551",
        "Sentence": "He went inside.",
        "Embedding": "[-26.086105 -29.136513  -4.252165]"
    },
    "1552": {
        "#": "1552",
        "Sentence": "Gatsby turned to me rigidly:\u201cI can\u2019t say anything in his house, old sport.\u201d\u201cShe\u2019s got an indiscreet voice,\u201d I remarked.",
        "Embedding": "[ 2.103242  26.361734  -6.2368593]"
    },
    "1553": {
        "#": "1553",
        "Sentence": "\u201cIt\u2019s full of\u2014\u201d Ihesitated.",
        "Embedding": "[-37.74486  -26.042006   3.779613]"
    },
    "1554": {
        "#": "1554",
        "Sentence": "\u201cHer voice is full of money,\u201d he said suddenly.",
        "Embedding": "[-15.438924  -36.27488     3.9540005]"
    },
    "1555": {
        "#": "1555",
        "Sentence": "That was it.",
        "Embedding": "[-35.070415 -18.390844  -9.645723]"
    },
    "1556": {
        "#": "1556",
        "Sentence": "I\u2019d never understood before.",
        "Embedding": "[-15.721077 -16.824656 -26.939758]"
    },
    "1557": {
        "#": "1557",
        "Sentence": "It was full of money\u2014thatwas the inexhaustible charm that rose and fell in it, the jingle ofit, the cymbals\u2019 song of it \u2026 High in a white palace the king\u2019sdaughter, the golden girl \u2026Tom came out of the house wrapping a quart bottle in a towel, followedby Daisy and Jordan wearing small tight hats of metallic cloth andcarrying light capes over their arms.",
        "Embedding": "[23.317617 25.702265 14.394726]"
    },
    "1558": {
        "#": "1558",
        "Sentence": "\u201cShall we all go in my car?\u201d suggested Gatsby.",
        "Embedding": "[-8.300846  31.904287   0.8992813]"
    },
    "1559": {
        "#": "1559",
        "Sentence": "He felt the hot, greenleather of the seat.",
        "Embedding": "[-23.8621   -27.525179   4.282639]"
    },
    "1560": {
        "#": "1560",
        "Sentence": "\u201cI ought to have left it in the shade.\u201d\u201cIs it standard shift?\u201d demanded Tom.",
        "Embedding": "[-23.592985   10.633403   -2.0271802]"
    },
    "1561": {
        "#": "1561",
        "Sentence": "\u201cYes.\u201d\u201cWell, you take my coup\u00e9 and let me drive your car to town.\u201dThe suggestion was distasteful to Gatsby.",
        "Embedding": "[-9.942238  29.705086   1.3350008]"
    },
    "1562": {
        "#": "1562",
        "Sentence": "\u201cI don\u2019t think there\u2019s much gas,\u201d he objected.",
        "Embedding": "[-18.976816 -27.30476  -11.43572 ]"
    },
    "1563": {
        "#": "1563",
        "Sentence": "\u201cPlenty of gas,\u201d said Tom boisterously.",
        "Embedding": "[-31.533552   19.202534    3.1176655]"
    },
    "1564": {
        "#": "1564",
        "Sentence": "He looked at the gauge.",
        "Embedding": "[-25.051968  -28.071095    0.8402817]"
    },
    "1565": {
        "#": "1565",
        "Sentence": "\u201cAndif it runs out I can stop at a drugstore.",
        "Embedding": "[-17.559166 -32.901714  11.990566]"
    },
    "1566": {
        "#": "1566",
        "Sentence": "You can buy anything at adrugstore nowadays.\u201dA pause followed this apparently pointless remark.",
        "Embedding": "[ -9.648781  -4.611163 -24.282028]"
    },
    "1567": {
        "#": "1567",
        "Sentence": "Daisy looked at Tomfrowning, and an indefinable expression, at once definitely unfamiliarand vaguely recognizable, as if I had only heard it described inwords, passed over Gatsby\u2019s face.",
        "Embedding": "[ 2.214924 31.021507 11.625582]"
    },
    "1568": {
        "#": "1568",
        "Sentence": "\u201cCome on, Daisy\u201d said Tom, pressing her with his hand toward Gatsby\u2019scar.",
        "Embedding": "[-22.963966  21.731773   9.021403]"
    },
    "1569": {
        "#": "1569",
        "Sentence": "\u201cI\u2019ll take you in this circus wagon.\u201dHe opened the door, but she moved out from the circle of his arm.",
        "Embedding": "[ 13.331169 -32.44338    0.930197]"
    },
    "1570": {
        "#": "1570",
        "Sentence": "\u201cYou take Nick and Jordan.",
        "Embedding": "[-7.2665057  19.882439   -0.75277877]"
    },
    "1571": {
        "#": "1571",
        "Sentence": "We\u2019ll follow you in the coup\u00e9.\u201dShe walked close to Gatsby, touching his coat with her hand.",
        "Embedding": "[-9.11269  35.35053   9.494317]"
    },
    "1572": {
        "#": "1572",
        "Sentence": "Jordanand Tom and I got into the front seat of Gatsby\u2019s car, Tom pushed theunfamiliar gears tentatively, and we shot off into the oppressiveheat, leaving them out of sight behind.",
        "Embedding": "[24.109272  7.535898 -5.1857  ]"
    },
    "1573": {
        "#": "1573",
        "Sentence": "\u201cDid you see that?\u201d demanded Tom.",
        "Embedding": "[-23.596876   14.284445    0.9897837]"
    },
    "1574": {
        "#": "1574",
        "Sentence": "\u201cSee what?\u201dHe looked at me keenly, realizing that Jordan and I must have knownall along.",
        "Embedding": "[-2.7196312 11.252897  -4.0692883]"
    },
    "1575": {
        "#": "1575",
        "Sentence": "\u201cYou think I\u2019m pretty dumb, don\u2019t you?\u201d he suggested.",
        "Embedding": "[-19.01964   -20.452251   -5.6562624]"
    },
    "1576": {
        "#": "1576",
        "Sentence": "\u201cPerhaps I am,but I have a\u2014almost a second sight, sometimes, that tells me what todo.",
        "Embedding": "[ -1.6275296  -3.7219472 -24.261518 ]"
    },
    "1577": {
        "#": "1577",
        "Sentence": "Maybe you don\u2019t believe that, but science\u2014\u201dHe paused.",
        "Embedding": "[-12.789526  -3.337994 -25.054577]"
    },
    "1578": {
        "#": "1578",
        "Sentence": "The immediate contingency overtook him, pulled him backfrom the edge of theoretical abyss.",
        "Embedding": "[ 27.62846   -10.0406065   2.5706294]"
    },
    "1579": {
        "#": "1579",
        "Sentence": "\u201cI\u2019ve made a small investigation of this fellow,\u201d he continued.",
        "Embedding": "[ -7.539507  -31.608374   -6.3235197]"
    },
    "1580": {
        "#": "1580",
        "Sentence": "\u201cIcould have gone deeper if I\u2019d known\u2014\u201d\u201cDo you mean you\u2019ve been to a medium?\u201d inquired Jordan humorously.",
        "Embedding": "[-6.6224966 10.048605  -9.455448 ]"
    },
    "1581": {
        "#": "1581",
        "Sentence": "\u201cWhat?\u201d Confused, he stared at us as we laughed.",
        "Embedding": "[  1.9396391 -28.457884   -4.604915 ]"
    },
    "1582": {
        "#": "1582",
        "Sentence": "\u201cA medium?\u201d\u201cAbout Gatsby.\u201d\u201cAbout Gatsby!",
        "Embedding": "[-5.921577  40.275276   3.2155478]"
    },
    "1583": {
        "#": "1583",
        "Sentence": "No, I haven\u2019t.",
        "Embedding": "[-41.645737   -2.4201622  -7.5258226]"
    },
    "1584": {
        "#": "1584",
        "Sentence": "I said I\u2019d been making a smallinvestigation of his past.\u201d\u201cAnd you found he was an Oxford man,\u201d said Jordan helpfully.",
        "Embedding": "[ -4.597431  12.898508 -11.862563]"
    },
    "1585": {
        "#": "1585",
        "Sentence": "\u201cAn Oxford man!\u201d He was incredulous.",
        "Embedding": "[ -5.1636415  14.642791  -13.56925  ]"
    },
    "1586": {
        "#": "1586",
        "Sentence": "\u201cLike hell he is!",
        "Embedding": "[-39.6545    -13.998591   -4.7842546]"
    },
    "1587": {
        "#": "1587",
        "Sentence": "He wears a pinksuit.\u201d\u201cNevertheless he\u2019s an Oxford man.\u201d\u201cOxford, New Mexico,\u201d snorted Tom contemptuously, \u201cor something likethat.\u201d\u201cListen, Tom.",
        "Embedding": "[-28.41668    21.572958    6.5299215]"
    },
    "1588": {
        "#": "1588",
        "Sentence": "If you\u2019re such a snob, why did you invite him to lunch?\u201ddemanded Jordan crossly.",
        "Embedding": "[-9.806581 11.582334 -6.254305]"
    },
    "1589": {
        "#": "1589",
        "Sentence": "\u201cDaisy invited him; she knew him before we were married\u2014God knowswhere!\u201dWe were all irritable now with the fading ale, and aware of it wedrove for a while in silence.",
        "Embedding": "[  9.086488 -11.233542  11.133316]"
    },
    "1590": {
        "#": "1590",
        "Sentence": "Then as Doctor T. J. Eckleburg\u2019s fadedeyes came into sight down the road, I remembered Gatsby\u2019s cautionabout gasoline.",
        "Embedding": "[ 5.795207 10.162115 14.002988]"
    },
    "1591": {
        "#": "1591",
        "Sentence": "\u201cWe\u2019ve got enough to get us to town,\u201d said Tom.",
        "Embedding": "[-20.8323    21.583021  -1.438943]"
    },
    "1592": {
        "#": "1592",
        "Sentence": "\u201cBut there\u2019s a garage right here,\u201d objected Jordan.",
        "Embedding": "[-7.1313734 13.863066  -1.3512228]"
    },
    "1593": {
        "#": "1593",
        "Sentence": "\u201cI don\u2019t want toget stalled in this baking heat.\u201dTom threw on both brakes impatiently, and we slid to an abrupt dustystop under Wilson\u2019s sign.",
        "Embedding": "[23.039103   1.807304   4.0507135]"
    },
    "1594": {
        "#": "1594",
        "Sentence": "After a moment the proprietor emerged fromthe interior of his establishment and gazed hollow-eyed at the car.",
        "Embedding": "[  4.2381644 -28.005692   22.278954 ]"
    },
    "1595": {
        "#": "1595",
        "Sentence": "\u201cLet\u2019s have some gas!\u201d cried Tom roughly.",
        "Embedding": "[-32.66977    17.425505    3.4221244]"
    },
    "1596": {
        "#": "1596",
        "Sentence": "\u201cWhat do you think westopped for\u2014to admire the view?\u201d\u201cI\u2019m sick,\u201d said Wilson without moving.",
        "Embedding": "[-7.2771397 19.61341   17.518219 ]"
    },
    "1597": {
        "#": "1597",
        "Sentence": "\u201cBeen sick all day.\u201d\u201cWhat\u2019s the matter?\u201d\u201cI\u2019m all run down.\u201d\u201cWell, shall I help myself?\u201d Tom demanded.",
        "Embedding": "[-28.836166   11.93025    -3.4958754]"
    },
    "1598": {
        "#": "1598",
        "Sentence": "\u201cYou sounded well enough onthe phone.\u201dWith an effort Wilson left the shade and support of the doorway and,breathing hard, unscrewed the cap of the tank.",
        "Embedding": "[11.911471 11.375999 10.495739]"
    },
    "1599": {
        "#": "1599",
        "Sentence": "In the sunlight hisface was green.",
        "Embedding": "[ 12.836646 -23.88879  -28.951172]"
    },
    "1600": {
        "#": "1600",
        "Sentence": "\u201cI didn\u2019t mean to interrupt your lunch,\u201d he said.",
        "Embedding": "[ -8.663946  -7.421934 -21.676573]"
    },
    "1601": {
        "#": "1601",
        "Sentence": "\u201cBut I need moneypretty bad, and I was wondering what you were going to do with yourold car.\u201d\u201cHow do you like this one?\u201d inquired Tom.",
        "Embedding": "[-26.216513   13.438579   -6.0135713]"
    },
    "1602": {
        "#": "1602",
        "Sentence": "\u201cI bought it last week.\u201d\u201cIt\u2019s a nice yellow one,\u201d said Wilson, as he strained at the handle.",
        "Embedding": "[-9.731865 19.373962 11.426119]"
    },
    "1603": {
        "#": "1603",
        "Sentence": "\u201cLike to buy it?\u201d\u201cBig chance,\u201d Wilson smiled faintly.",
        "Embedding": "[-10.636625  24.997765  16.509514]"
    },
    "1604": {
        "#": "1604",
        "Sentence": "\u201cNo, but I could make some moneyon the other.\u201d\u201cWhat do you want money for, all of a sudden?\u201d\u201cI\u2019ve been here too long.",
        "Embedding": "[-11.1523695   5.50393   -15.00092  ]"
    },
    "1605": {
        "#": "1605",
        "Sentence": "I want to get away.",
        "Embedding": "[-38.454548    6.7579613  -9.741779 ]"
    },
    "1606": {
        "#": "1606",
        "Sentence": "My wife and I want to goWest.\u201d\u201cYour wife does,\u201d exclaimed Tom, startled.",
        "Embedding": "[-14.142328   17.192822    7.0808873]"
    },
    "1607": {
        "#": "1607",
        "Sentence": "\u201cShe\u2019s been talking about it for ten years.\u201d He rested for a momentagainst the pump, shading his eyes.",
        "Embedding": "[ -3.4744344 -21.340145   26.992878 ]"
    },
    "1608": {
        "#": "1608",
        "Sentence": "\u201cAnd now she\u2019s going whether shewants to or not.",
        "Embedding": "[-15.392825 -16.774807  19.647848]"
    },
    "1609": {
        "#": "1609",
        "Sentence": "I\u2019m going to get her away.\u201dThe coup\u00e9 flashed by us with a flurry of dust and the flash of awaving hand.",
        "Embedding": "[20.514477  -3.2069352 25.00353  ]"
    },
    "1610": {
        "#": "1610",
        "Sentence": "\u201cWhat do I owe you?\u201d demanded Tom harshly.",
        "Embedding": "[-25.754038   12.788627   -2.4784844]"
    },
    "1611": {
        "#": "1611",
        "Sentence": "\u201cI just got wised up to something funny the last two days,\u201d remarkedWilson.",
        "Embedding": "[ -3.158081   -4.8128223 -29.166807 ]"
    },
    "1612": {
        "#": "1612",
        "Sentence": "\u201cThat\u2019s why I want to get away.",
        "Embedding": "[-36.45101    6.567565  -9.771291]"
    },
    "1613": {
        "#": "1613",
        "Sentence": "That\u2019s why I been botheringyou about the car.\u201d\u201cWhat do I owe you?\u201d\u201cDollar twenty.\u201dThe relentless beating heat was beginning to confuse me and I had abad moment there before I realized that so far his suspicions hadn\u2019talighted on Tom.",
        "Embedding": "[  3.6776764   3.0573108 -12.270599 ]"
    },
    "1614": {
        "#": "1614",
        "Sentence": "He had discovered that Myrtle had some sort of lifeapart from him in another world, and the shock had made him physicallysick.",
        "Embedding": "[  9.427127  27.02572  -30.742138]"
    },
    "1615": {
        "#": "1615",
        "Sentence": "I stared at him and then at Tom, who had made a paralleldiscovery less than an hour before\u2014and it occurred to me that therewas no difference between men, in intelligence or race, so profound asthe difference between the sick and the well.",
        "Embedding": "[ 1.7184627 -1.6931968  2.9682038]"
    },
    "1616": {
        "#": "1616",
        "Sentence": "Wilson was so sick thathe looked guilty, unforgivably guilty\u2014as if he had just got some poorgirl with child.",
        "Embedding": "[-5.6493874 21.424747  12.9405775]"
    },
    "1617": {
        "#": "1617",
        "Sentence": "\u201cI\u2019ll let you have that car,\u201d said Tom.",
        "Embedding": "[-23.772      20.086897   -4.6467233]"
    },
    "1618": {
        "#": "1618",
        "Sentence": "\u201cI\u2019ll send it over tomorrowafternoon.\u201dThat locality was always vaguely disquieting, even in the broad glareof afternoon, and now I turned my head as though I had been warned ofsomething behind.",
        "Embedding": "[ -0.80720246 -13.576514    -6.651581  ]"
    },
    "1619": {
        "#": "1619",
        "Sentence": "Over the ash-heaps the giant eyes of Doctor T. J.Eckleburg kept their vigil, but I perceived, after a moment, thatother eyes were regarding us with peculiar intensity from less thantwenty feet away.",
        "Embedding": "[ 40.00022    6.577502 -11.361116]"
    },
    "1620": {
        "#": "1620",
        "Sentence": "In one of the windows over the garage the curtains had been movedaside a little, and Myrtle Wilson was peering down at the car.",
        "Embedding": "[ 5.8925486 15.93514   13.172064 ]"
    },
    "1621": {
        "#": "1621",
        "Sentence": "Soengrossed was she that she had no consciousness of being observed, andone emotion after another crept into her face like objects into aslowly developing picture.",
        "Embedding": "[ 6.0736175   0.13720198 20.912247  ]"
    },
    "1622": {
        "#": "1622",
        "Sentence": "Her expression was curiously familiar\u2014it was an expression I had often seen on women\u2019s faces, but on Myrtle Wilson\u2019s face it seemed purposeless and inexplicable until I realizedthat her eyes, wide with jealous terror, were fixed not on Tom, but onJordan Baker, whom she took to be his wife.",
        "Embedding": "[ 1.7757636  -0.44098297 13.540748  ]"
    },
    "1623": {
        "#": "1623",
        "Sentence": "There is no confusion like the confusion of a simple mind, and as wedrove away Tom was feeling the hot whips of panic.",
        "Embedding": "[  3.9005444   0.5644827 -11.490123 ]"
    },
    "1624": {
        "#": "1624",
        "Sentence": "His wife and hismistress, until an hour ago secure and inviolate, were slipping precipitately from his control.",
        "Embedding": "[ 18.737175 -33.797943  -7.983146]"
    },
    "1625": {
        "#": "1625",
        "Sentence": "Instinct made him step on theaccelerator with the double purpose of overtaking Daisy and leaving Wilson behind, and we sped along toward Astoria at fifty miles an hour, until, among the spidery girders of the elevated, we came insight of the easygoing blue coup\u00e9.",
        "Embedding": "[29.039274   9.065347  -3.5047605]"
    },
    "1626": {
        "#": "1626",
        "Sentence": "\u201cThose big movies around Fiftieth Street are cool,\u201d suggestedJordan.",
        "Embedding": "[-3.7686179  9.609038  40.761635 ]"
    },
    "1627": {
        "#": "1627",
        "Sentence": "\u201cI love New York on summer afternoons when everyone\u2019s away.",
        "Embedding": "[ -5.3307066  33.620796  -23.240957 ]"
    },
    "1628": {
        "#": "1628",
        "Sentence": "There\u2019s something very sensuous about it\u2014overripe, as if all sorts offunny fruits were going to fall into your hands.\u201dThe word \u201csensuous\u201d had the effect of further disquieting Tom, butbefore he could invent a protest the coup\u00e9 came to a stop, and Daisysignalled us to draw up alongside.",
        "Embedding": "[13.877707   7.6010857 15.229864 ]"
    },
    "1629": {
        "#": "1629",
        "Sentence": "\u201cWhere are we going?\u201d she cried.",
        "Embedding": "[-31.690691   -3.9580433  18.119152 ]"
    },
    "1630": {
        "#": "1630",
        "Sentence": "\u201cHow about the movies?\u201d\u201cIt\u2019s so hot,\u201d she complained.",
        "Embedding": "[-32.505325   9.85857  -24.149248]"
    },
    "1631": {
        "#": "1631",
        "Sentence": "\u201cYou go.",
        "Embedding": "[-37.261314   -4.4202995 -21.356092 ]"
    },
    "1632": {
        "#": "1632",
        "Sentence": "We\u2019ll ride around and meet youafter.\u201d With an effort her wit rose faintly.",
        "Embedding": "[ 1.7655451  5.109221  37.485195 ]"
    },
    "1633": {
        "#": "1633",
        "Sentence": "\u201cWe\u2019ll meet you on somecorner.",
        "Embedding": "[-28.169342    4.9113293  -6.724466 ]"
    },
    "1634": {
        "#": "1634",
        "Sentence": "I\u2019ll be the man smoking two cigarettes.\u201d\u201cWe can\u2019t argue about it here,\u201d Tom said impatiently, as a truck gaveout a cursing whistle behind us.",
        "Embedding": "[-15.383329  25.560976   6.11702 ]"
    },
    "1635": {
        "#": "1635",
        "Sentence": "\u201cYou follow me to the south side ofCentral Park, in front of the Plaza.\u201dSeveral times he turned his head and looked back for their car, and ifthe traffic delayed them he slowed up until they came into sight.",
        "Embedding": "[24.22677    4.2909184 -8.879426 ]"
    },
    "1636": {
        "#": "1636",
        "Sentence": "Ithink he was afraid they would dart down a side-street and out of hislife forever.",
        "Embedding": "[ 25.263594 -16.271408 -13.415207]"
    },
    "1637": {
        "#": "1637",
        "Sentence": "But they didn\u2019t.",
        "Embedding": "[-28.69094   -38.516525    2.2332597]"
    },
    "1638": {
        "#": "1638",
        "Sentence": "And we all took the less explicable step of engaging the parlour of a suite in the Plaza Hotel.",
        "Embedding": "[18.445631 13.183529 24.698277]"
    },
    "1639": {
        "#": "1639",
        "Sentence": "The prolonged and tumultuous argument that ended by herding us intothat room eludes me, though I have a sharp physical memory that, inthe course of it, my underwear kept climbing like a damp snake aroundmy legs and intermittent beads of sweat raced cool across my back.",
        "Embedding": "[ 25.951439   12.20327   -10.9304285]"
    },
    "1640": {
        "#": "1640",
        "Sentence": "The notion originated with Daisy\u2019s suggestion that we hire fivebathrooms and take cold baths, and then assumed more tangible form as\u201ca place to have a mint julep.\u201d Each of us said over and over that it was a \u201ccrazy idea\u201d\u2014we all talked at once to a baffled clerk andthought, or pretended to think, that we were being very funny \u2026The room was large and stifling, and, though it was already fouro\u2019clock, opening the windows admitted only a gust of hot shrubberyfrom the Park.",
        "Embedding": "[15.222776 14.833561 15.195857]"
    },
    "1641": {
        "#": "1641",
        "Sentence": "Daisy went to the mirror and stood with her back to us,fixing her hair.",
        "Embedding": "[14.158894  3.822142 30.136822]"
    },
    "1642": {
        "#": "1642",
        "Sentence": "\u201cIt\u2019s a swell suite,\u201d whispered Jordan respectfully, and everyonelaughed.",
        "Embedding": "[-12.727164  13.940463  -4.211467]"
    },
    "1643": {
        "#": "1643",
        "Sentence": "\u201cOpen another window,\u201d commanded Daisy, without turning around.",
        "Embedding": "[-24.287077  13.831158  27.866291]"
    },
    "1644": {
        "#": "1644",
        "Sentence": "\u201cThere aren\u2019t any more.\u201d\u201cWell, we\u2019d better telephone for an axe\u2014\u201d\u201cThe thing to do is to forget about the heat,\u201d said Tom impatiently.",
        "Embedding": "[-6.7325773 18.36771    6.0345554]"
    },
    "1645": {
        "#": "1645",
        "Sentence": "\u201cYou make it ten times worse by crabbing about it.\u201dHe unrolled the bottle of whisky from the towel and put it on thetable.",
        "Embedding": "[ 42.326534 -24.454231   4.28247 ]"
    },
    "1646": {
        "#": "1646",
        "Sentence": "\u201cWhy not let her alone, old sport?\u201d remarked Gatsby.",
        "Embedding": "[-10.667325  32.424114 -10.255044]"
    },
    "1647": {
        "#": "1647",
        "Sentence": "\u201cYou\u2019re the onethat wanted to come to town.\u201dThere was a moment of silence.",
        "Embedding": "[-17.52453     1.7363106 -17.129997 ]"
    },
    "1648": {
        "#": "1648",
        "Sentence": "The telephone book slipped from itsnail and splashed to the floor, whereupon Jordan whispered, \u201cExcuseme\u201d\u2014but this time no one laughed.",
        "Embedding": "[11.039736  6.723315  2.475628]"
    },
    "1649": {
        "#": "1649",
        "Sentence": "\u201cI\u2019ll pick it up,\u201d I offered.",
        "Embedding": "[-29.070242  -3.005911 -16.31911 ]"
    },
    "1650": {
        "#": "1650",
        "Sentence": "\u201cI\u2019ve got it.\u201d Gatsby examined the parted string, muttered \u201cHum!\u201d inan interested way, and tossed the book on a chair.",
        "Embedding": "[ 1.7749956 26.429443  -9.1466465]"
    },
    "1651": {
        "#": "1651",
        "Sentence": "\u201cThat\u2019s a great expression of yours, isn\u2019t it?\u201d said Tom sharply.",
        "Embedding": "[-21.138908   15.973602   -1.3876404]"
    },
    "1652": {
        "#": "1652",
        "Sentence": "\u201cWhat is?\u201d\u201cAll this \u2018old sport\u2019 business.",
        "Embedding": "[-19.610168  22.128218 -21.572622]"
    },
    "1653": {
        "#": "1653",
        "Sentence": "Where\u2019d you pick that up?\u201d\u201cNow see here, Tom,\u201d said Daisy, turning around from the mirror, \u201cifyou\u2019re going to make personal remarks I won\u2019t stay here a minute.",
        "Embedding": "[-19.689072  24.734674   9.611389]"
    },
    "1654": {
        "#": "1654",
        "Sentence": "Call up and order some ice for the mint julep.\u201dAs Tom took up the receiver the compressed heat exploded into soundand we were listening to the portentous chords of Mendelssohn\u2019sWedding March from the ballroom below.",
        "Embedding": "[39.533867  7.383767 18.449514]"
    },
    "1655": {
        "#": "1655",
        "Sentence": "\u201cImagine marrying anybody in this heat!\u201d cried Jordan dismally.",
        "Embedding": "[-6.8910966 18.686754  -6.8035035]"
    },
    "1656": {
        "#": "1656",
        "Sentence": "\u201cStill\u2014I was married in the middle of June,\u201d Daisy remembered.",
        "Embedding": "[-15.271739  15.37854   32.52206 ]"
    },
    "1657": {
        "#": "1657",
        "Sentence": "\u201cLouisville in June!",
        "Embedding": "[-42.86029  -30.456465  -9.352623]"
    },
    "1658": {
        "#": "1658",
        "Sentence": "Somebody fainted.",
        "Embedding": "[-21.484436 -15.974309 -15.819884]"
    },
    "1659": {
        "#": "1659",
        "Sentence": "Who was it fainted, Tom?\u201d\u201cBiloxi,\u201d he answered shortly.",
        "Embedding": "[-19.57187  -15.91362  -14.374511]"
    },
    "1660": {
        "#": "1660",
        "Sentence": "\u201cA man named Biloxi.",
        "Embedding": "[-38.561596 -16.765625 -26.003723]"
    },
    "1661": {
        "#": "1661",
        "Sentence": "\u2018Blocks\u2019 Biloxi, and he made boxes\u2014that\u2019s afact\u2014and he was from Biloxi, Tennessee.\u201d\u201cThey carried him into my house,\u201d appended Jordan, \u201cbecause we livedjust two doors from the church.",
        "Embedding": "[23.827768  23.007715   3.5242045]"
    },
    "1662": {
        "#": "1662",
        "Sentence": "And he stayed three weeks, until Daddytold him he had to get out.",
        "Embedding": "[ -9.776009 -30.533937  12.120066]"
    },
    "1663": {
        "#": "1663",
        "Sentence": "The day after he left Daddy died.\u201d  Aftera moment she added.",
        "Embedding": "[ -3.1453629 -40.04951   -17.387075 ]"
    },
    "1664": {
        "#": "1664",
        "Sentence": "\u201cThere wasn\u2019t any connection.\u201d\u201cI used to know a Bill Biloxi from Memphis,\u201d I remarked.",
        "Embedding": "[ -1.0899223  17.019014  -18.462149 ]"
    },
    "1665": {
        "#": "1665",
        "Sentence": "\u201cThat was his cousin.",
        "Embedding": "[-33.07835   -20.346792   -1.3868272]"
    },
    "1666": {
        "#": "1666",
        "Sentence": "I knew his whole family history before heleft.",
        "Embedding": "[ -2.0337167 -19.728085  -17.091162 ]"
    },
    "1667": {
        "#": "1667",
        "Sentence": "He gave me an aluminium putter that I use today.\u201dThe music had died down as the ceremony began and now a long cheerfloated in at the window, followed by intermittent cries of\u201cYea\u2014ea\u2014ea!\u201d and finally by a burst of jazz as the dancing began.",
        "Embedding": "[11.401706  -7.934008   2.0044456]"
    },
    "1668": {
        "#": "1668",
        "Sentence": "\u201cWe\u2019re getting old,\u201d said Daisy.",
        "Embedding": "[-13.513221  15.947089  27.598644]"
    },
    "1669": {
        "#": "1669",
        "Sentence": "\u201cIf we were young we\u2019d rise anddance.\u201d\u201cRemember Biloxi,\u201d Jordan warned her.",
        "Embedding": "[-10.548808  17.301834  -6.80524 ]"
    },
    "1670": {
        "#": "1670",
        "Sentence": "\u201cWhere\u2019d you know him, Tom?\u201d\u201cBiloxi?\u201d He concentrated with an effort.",
        "Embedding": "[-12.708468 -16.517471 -18.269226]"
    },
    "1671": {
        "#": "1671",
        "Sentence": "\u201cI didn\u2019t know him.",
        "Embedding": "[-33.10492    -9.836677    0.5131579]"
    },
    "1672": {
        "#": "1672",
        "Sentence": "He was afriend of Daisy\u2019s.\u201d\u201cHe was not,\u201d she denied.",
        "Embedding": "[-15.671872 -24.444513  12.459696]"
    },
    "1673": {
        "#": "1673",
        "Sentence": "\u201cI\u2019d never seen him before.",
        "Embedding": "[-17.084906 -17.534374 -24.639626]"
    },
    "1674": {
        "#": "1674",
        "Sentence": "He came down inthe private car.\u201d\u201cWell, he said he knew you.",
        "Embedding": "[-14.328022 -24.310793  -5.072153]"
    },
    "1675": {
        "#": "1675",
        "Sentence": "He said he was raised in Louisville.",
        "Embedding": "[-40.738083  -30.718325   -6.0360284]"
    },
    "1676": {
        "#": "1676",
        "Sentence": "AsaBird brought him around at the last minute and asked if we had roomfor him.\u201dJordan smiled.",
        "Embedding": "[  7.8086224 -25.213997   -4.055034 ]"
    },
    "1677": {
        "#": "1677",
        "Sentence": "\u201cHe was probably bumming his way home.",
        "Embedding": "[-17.965515  -26.293268   -1.5512261]"
    },
    "1678": {
        "#": "1678",
        "Sentence": "He told me he was president ofyour class at Yale.\u201dTom and I looked at each other blankly.",
        "Embedding": "[  8.95489  -19.23978   -9.566693]"
    },
    "1679": {
        "#": "1679",
        "Sentence": "\u201cBiloxi?\u201d\u201cFirst place, we didn\u2019t have any president\u2014\u201dGatsby\u2019s foot beat a short, restless tattoo and Tom eyed him suddenly.",
        "Embedding": "[25.166027   8.874849  -0.5416172]"
    },
    "1680": {
        "#": "1680",
        "Sentence": "\u201cBy the way, Mr. Gatsby, I understand you\u2019re an Oxford man.\u201d\u201cNot exactly.\u201d\u201cOh, yes, I understand you went to Oxford.\u201d\u201cYes\u2014I went there.\u201dA pause.",
        "Embedding": "[-0.803594 30.08622  -6.784153]"
    },
    "1681": {
        "#": "1681",
        "Sentence": "Then Tom\u2019s voice, incredulous and insulting:\u201cYou must have gone there about the time Biloxi went to New Haven.\u201dAnother pause.",
        "Embedding": "[-19.16802   17.830496  -9.157865]"
    },
    "1682": {
        "#": "1682",
        "Sentence": "A waiter knocked and came in with crushed mint and icebut the silence was unbroken by his \u201cthank you\u201d and the soft closingof the door.",
        "Embedding": "[23.380157   3.1417365 14.081153 ]"
    },
    "1683": {
        "#": "1683",
        "Sentence": "This tremendous detail was to be cleared up at last.",
        "Embedding": "[-10.075303 -30.31848   -1.630552]"
    },
    "1684": {
        "#": "1684",
        "Sentence": "\u201cI told you I went there,\u201d said Gatsby.",
        "Embedding": "[-4.304978 37.158978 -4.918367]"
    },
    "1685": {
        "#": "1685",
        "Sentence": "\u201cI heard you, but I\u2019d like to know when.\u201d\u201cIt was in nineteen-nineteen, I only stayed five months.",
        "Embedding": "[-11.270035     0.18746218 -19.193365  ]"
    },
    "1686": {
        "#": "1686",
        "Sentence": "That\u2019s why Ican\u2019t really call myself an Oxford man.\u201dTom glanced around to see if we mirrored his unbelief.",
        "Embedding": "[ -4.040213  11.676018 -14.621377]"
    },
    "1687": {
        "#": "1687",
        "Sentence": "But we were alllooking at Gatsby.",
        "Embedding": "[-7.8834076  39.566967   -0.23644483]"
    },
    "1688": {
        "#": "1688",
        "Sentence": "\u201cIt was an opportunity they gave to some of the officers after thearmistice,\u201d he continued.",
        "Embedding": "[ -3.3984652 -29.7119     24.14827  ]"
    },
    "1689": {
        "#": "1689",
        "Sentence": "\u201cWe could go to any of the universities inEngland or France.\u201dI wanted to get up and slap him on the back.",
        "Embedding": "[ 11.438872  -10.927043   -6.3263273]"
    },
    "1690": {
        "#": "1690",
        "Sentence": "I had one of thoserenewals of complete faith in him that I\u2019d experienced before.",
        "Embedding": "[ -2.3973832 -19.315203  -13.845058 ]"
    },
    "1691": {
        "#": "1691",
        "Sentence": "Daisy rose, smiling faintly, and went to the table.",
        "Embedding": "[-21.666187  17.860756  31.410254]"
    },
    "1692": {
        "#": "1692",
        "Sentence": "\u201cOpen the whisky, Tom,\u201d she ordered, \u201cand I\u2019ll make you a mint julep.",
        "Embedding": "[-32.35406   18.927713  -6.354988]"
    },
    "1693": {
        "#": "1693",
        "Sentence": "Then you won\u2019t seem so stupid to yourself \u2026 Look at the mint!\u201d\u201cWait a minute,\u201d snapped Tom, \u201cI want to ask Mr. Gatsby one morequestion.\u201d\u201cGo on,\u201d Gatsby said politely.",
        "Embedding": "[-1.1527336 30.6008    -4.052428 ]"
    },
    "1694": {
        "#": "1694",
        "Sentence": "\u201cWhat kind of a row are you trying to cause in my house anyhow?\u201dThey were out in the open at last and Gatsby was content.",
        "Embedding": "[ 1.5312223 32.050472   0.9381157]"
    },
    "1695": {
        "#": "1695",
        "Sentence": "\u201cHe isn\u2019t causing a row,\u201d Daisy looked desperately from one to theother.",
        "Embedding": "[-12.547738   8.093161  27.677015]"
    },
    "1696": {
        "#": "1696",
        "Sentence": "\u201cYou\u2019re causing a row.",
        "Embedding": "[-35.98707   -1.265385 -24.46578 ]"
    },
    "1697": {
        "#": "1697",
        "Sentence": "Please have a little self-control.\u201d\u201cSelf-control!\u201d repeated Tom incredulously.",
        "Embedding": "[-25.368029  19.18518    3.405498]"
    },
    "1698": {
        "#": "1698",
        "Sentence": "\u201cI suppose the latestthing is to sit back and let Mr. Nobody from Nowhere make love to yourwife.",
        "Embedding": "[-12.12856      0.72929406   6.2679553 ]"
    },
    "1699": {
        "#": "1699",
        "Sentence": "Well, if that\u2019s the idea you can count me out \u2026 Nowadays peoplebegin by sneering at family life and family institutions, and nextthey\u2019ll throw everything overboard and have intermarriage betweenblack and white.\u201dFlushed with his impassioned gibberish, he saw himself standing aloneon the last barrier of civilization.",
        "Embedding": "[-3.3894546  1.6047614 -2.5701308]"
    },
    "1700": {
        "#": "1700",
        "Sentence": "\u201cWe\u2019re all white here,\u201d murmured Jordan.",
        "Embedding": "[-5.2321258 16.664291  -3.846293 ]"
    },
    "1701": {
        "#": "1701",
        "Sentence": "\u201cI know I\u2019m not very popular.",
        "Embedding": "[-18.762463 -13.195828 -25.593555]"
    },
    "1702": {
        "#": "1702",
        "Sentence": "I don\u2019t give big parties.",
        "Embedding": "[-23.781723 -12.237936 -31.164064]"
    },
    "1703": {
        "#": "1703",
        "Sentence": "I supposeyou\u2019ve got to make your house into a pigsty in order to have anyfriends\u2014in the modern world.\u201dAngry as I was, as we all were, I was tempted to laugh whenever heopened his mouth.",
        "Embedding": "[ 12.879925   6.137249 -11.641096]"
    },
    "1704": {
        "#": "1704",
        "Sentence": "The transition from libertine to prig was socomplete.",
        "Embedding": "[ -9.952258 -24.274307  27.062416]"
    },
    "1705": {
        "#": "1705",
        "Sentence": "\u201cI\u2019ve got something to tell you, old sport\u2014\u201d began Gatsby.",
        "Embedding": "[-6.8830113 33.882187  -8.604274 ]"
    },
    "1706": {
        "#": "1706",
        "Sentence": "But Daisyguessed at his intention.",
        "Embedding": "[-29.257599 -42.02764   -2.38973 ]"
    },
    "1707": {
        "#": "1707",
        "Sentence": "\u201cPlease don\u2019t!\u201d she interrupted helplessly.",
        "Embedding": "[-21.3708   -13.930044  10.97269 ]"
    },
    "1708": {
        "#": "1708",
        "Sentence": "\u201cPlease let\u2019s all gohome.",
        "Embedding": "[-36.952663    0.6859689 -10.061353 ]"
    },
    "1709": {
        "#": "1709",
        "Sentence": "Why don\u2019t we all go home?\u201d\u201cThat\u2019s a good idea,\u201d I got up.",
        "Embedding": "[-32.400764   8.830233 -20.314262]"
    },
    "1710": {
        "#": "1710",
        "Sentence": "\u201cCome on, Tom.",
        "Embedding": "[-27.02339    19.734818   -1.5398163]"
    },
    "1711": {
        "#": "1711",
        "Sentence": "Nobody wants a drink.\u201d\u201cI want to know what Mr. Gatsby has to tell me.\u201d\u201cYour wife doesn\u2019t love you,\u201d said Gatsby.",
        "Embedding": "[-0.86748195 32.262634   -2.2123973 ]"
    },
    "1712": {
        "#": "1712",
        "Sentence": "\u201cShe\u2019s never loved you.",
        "Embedding": "[-26.061714     0.15286587  14.585354  ]"
    },
    "1713": {
        "#": "1713",
        "Sentence": "She loves me.\u201d\u201cYou must be crazy!\u201d exclaimed Tom automatically.",
        "Embedding": "[-19.671549   13.536661    5.5929294]"
    },
    "1714": {
        "#": "1714",
        "Sentence": "Gatsby sprang to his feet, vivid with excitement.",
        "Embedding": "[ 0.65143657 40.27782     5.9915705 ]"
    },
    "1715": {
        "#": "1715",
        "Sentence": "\u201cShe never loved you, do you hear?\u201d he cried.",
        "Embedding": "[-26.1633      -0.47747812  16.634535  ]"
    },
    "1716": {
        "#": "1716",
        "Sentence": "\u201cShe only married youbecause I was poor and she was tired of waiting for me.",
        "Embedding": "[-17.004438   -6.1920233  23.007833 ]"
    },
    "1717": {
        "#": "1717",
        "Sentence": "It was aterrible mistake, but in her heart she never loved anyone except me!\u201dAt this point Jordan and I tried to go, but Tom and Gatsby insistedwith competitive firmness that we remain\u2014as though neither of them hadanything to conceal and it would be a privilege to partake vicariouslyof their emotions.",
        "Embedding": "[ 3.0637074 27.168293   8.201224 ]"
    },
    "1718": {
        "#": "1718",
        "Sentence": "\u201cSit down, Daisy,\u201d Tom\u2019s voice groped unsuccessfully for the paternalnote.",
        "Embedding": "[-18.380404  21.102858  10.259318]"
    },
    "1719": {
        "#": "1719",
        "Sentence": "\u201cWhat\u2019s been going on?",
        "Embedding": "[-22.590357  -10.1320915 -14.906906 ]"
    },
    "1720": {
        "#": "1720",
        "Sentence": "I want to hear all about it.\u201d\u201cI told you what\u2019s been going on,\u201d said Gatsby.",
        "Embedding": "[-5.3006573 34.189026  -4.351036 ]"
    },
    "1721": {
        "#": "1721",
        "Sentence": "\u201cGoing on for fiveyears\u2014and you didn\u2019t know.\u201dTom turned to Daisy sharply.",
        "Embedding": "[-23.260252  16.837013  26.329363]"
    },
    "1722": {
        "#": "1722",
        "Sentence": "\u201cYou\u2019ve been seeing this fellow for five years?\u201d\u201cNot seeing,\u201d said Gatsby.",
        "Embedding": "[-2.490246 34.247147 -5.736959]"
    },
    "1723": {
        "#": "1723",
        "Sentence": "\u201cNo, we couldn\u2019t meet.",
        "Embedding": "[-43.047928   -3.719305   -1.2564365]"
    },
    "1724": {
        "#": "1724",
        "Sentence": "But both of us lovedeach other all that time, old sport, and you didn\u2019t know.",
        "Embedding": "[-14.197754  20.905859 -18.677149]"
    },
    "1725": {
        "#": "1725",
        "Sentence": "I used tolaugh sometimes\u201d\u2014but there was no laughter in his eyes\u2014\u201cto think thatyou didn\u2019t know.\u201d\u201cOh\u2014that\u2019s all.\u201d Tom tapped his thick fingers together like aclergyman and leaned back in his chair.",
        "Embedding": "[5.5908694 8.608489  2.4097033]"
    },
    "1726": {
        "#": "1726",
        "Sentence": "\u201cYou\u2019re crazy!\u201d he exploded.",
        "Embedding": "[-21.93574  -20.51363   -8.394063]"
    },
    "1727": {
        "#": "1727",
        "Sentence": "\u201cI can\u2019t speak about what happened fiveyears ago, because I didn\u2019t know Daisy then\u2014and I\u2019ll be damned if Isee how you got within a mile of her unless you brought the groceriesto the back door.",
        "Embedding": "[-9.634778  6.244525 16.808846]"
    },
    "1728": {
        "#": "1728",
        "Sentence": "But all the rest of that\u2019s a God damned lie.",
        "Embedding": "[-25.034388  -40.167027    6.3735857]"
    },
    "1729": {
        "#": "1729",
        "Sentence": "Daisyloved me when she married me and she loves me now.\u201d\u201cNo,\u201d said Gatsby, shaking his head.",
        "Embedding": "[-2.6670387 30.003857   5.7681937]"
    },
    "1730": {
        "#": "1730",
        "Sentence": "\u201cShe does, though.",
        "Embedding": "[-27.686943 -24.518688  13.212258]"
    },
    "1731": {
        "#": "1731",
        "Sentence": "The trouble is that sometimes she gets foolishideas in her head and doesn\u2019t know what she\u2019s doing.\u201d He noddedsagely.",
        "Embedding": "[-10.46941  -15.975611  12.862801]"
    },
    "1732": {
        "#": "1732",
        "Sentence": "\u201cAnd what\u2019s more, I love Daisy too.",
        "Embedding": "[-18.799212  13.007986  28.703163]"
    },
    "1733": {
        "#": "1733",
        "Sentence": "Once in a while I go offon a spree and make a fool of myself, but I always come back, and inmy heart I love her all the time.\u201d\u201cYou\u2019re revolting,\u201d said Daisy.",
        "Embedding": "[-6.3000245 16.601     24.871435 ]"
    },
    "1734": {
        "#": "1734",
        "Sentence": "She turned to me, and her voice,dropping an octave lower, filled the room with thrilling scorn: \u201cDoyou know why we left Chicago?",
        "Embedding": "[18.029482  -4.2374134 32.413784 ]"
    },
    "1735": {
        "#": "1735",
        "Sentence": "I\u2019m surprised that they didn\u2019t treat youto the story of that little spree.\u201dGatsby walked over and stood beside her.",
        "Embedding": "[  3.0051875 -13.056522   19.727394 ]"
    },
    "1736": {
        "#": "1736",
        "Sentence": "\u201cDaisy, that\u2019s all over now,\u201d he said earnestly.",
        "Embedding": "[-12.8151655  10.994762   25.865837 ]"
    },
    "1737": {
        "#": "1737",
        "Sentence": "\u201cIt doesn\u2019t matterany more.",
        "Embedding": "[-24.090605 -36.87061   -9.148758]"
    },
    "1738": {
        "#": "1738",
        "Sentence": "Just tell him the truth\u2014that you never loved him\u2014and it\u2019sall wiped out forever.\u201dShe looked at him blindly.",
        "Embedding": "[-11.916163  -12.314372   -6.0184298]"
    },
    "1739": {
        "#": "1739",
        "Sentence": "\u201cWhy\u2014how could I love him\u2014possibly?\u201d\u201cYou never loved him.\u201dShe hesitated.",
        "Embedding": "[-17.186722   -4.2708755  15.656707 ]"
    },
    "1740": {
        "#": "1740",
        "Sentence": "Her eyes fell on Jordan and me with a sort of appeal,as though she realized at last what she was doing\u2014and as though she had never, all along, intended doing anything at all.",
        "Embedding": "[-2.9194553 -6.6983805 19.686172 ]"
    },
    "1741": {
        "#": "1741",
        "Sentence": "But it was donenow.",
        "Embedding": "[-29.347088  -39.09167    -0.6201242]"
    },
    "1742": {
        "#": "1742",
        "Sentence": "It was too late.",
        "Embedding": "[-27.784449 -20.758951 -13.973837]"
    },
    "1743": {
        "#": "1743",
        "Sentence": "\u201cI never loved him,\u201d she said, with perceptible reluctance.",
        "Embedding": "[-17.070189   -6.3967795  15.579553 ]"
    },
    "1744": {
        "#": "1744",
        "Sentence": "\u201cNot at Kapiolani?\u201d demanded Tom suddenly.",
        "Embedding": "[-28.780252    15.822803     0.33758765]"
    },
    "1745": {
        "#": "1745",
        "Sentence": "\u201cNo.\u201dFrom the ballroom beneath, muffled and suffocating chords weredrifting up on hot waves of air.",
        "Embedding": "[39.61015   2.341633 17.615654]"
    },
    "1746": {
        "#": "1746",
        "Sentence": "\u201cNot that day I carried you down from the Punch Bowl to keep yourshoes dry?\u201d There was a husky tenderness in his tone \u2026 \u201cDaisy?\u201d\u201cPlease don\u2019t.\u201d Her voice was cold, but the rancour was gone from it.",
        "Embedding": "[  6.630728 -10.528989  37.235535]"
    },
    "1747": {
        "#": "1747",
        "Sentence": "She looked at Gatsby.",
        "Embedding": "[-4.4139905 39.154617   6.1353793]"
    },
    "1748": {
        "#": "1748",
        "Sentence": "\u201cThere, Jay,\u201d she said\u2014but her hand as she triedto light a cigarette was trembling.",
        "Embedding": "[ 39.703987 -17.476023  13.574734]"
    },
    "1749": {
        "#": "1749",
        "Sentence": "Suddenly she threw the cigaretteand the burning match on the carpet.",
        "Embedding": "[ 15.888755 -30.422949  20.743198]"
    },
    "1750": {
        "#": "1750",
        "Sentence": "\u201cOh, you want too much!\u201d she cried to Gatsby.",
        "Embedding": "[-5.4965725 34.74842    5.2721157]"
    },
    "1751": {
        "#": "1751",
        "Sentence": "\u201cI love you now\u2014isn\u2019tthat enough?",
        "Embedding": "[-21.748722  -2.552446  13.462217]"
    },
    "1752": {
        "#": "1752",
        "Sentence": "I can\u2019t help what\u2019s past.\u201d She began to sobhelplessly.",
        "Embedding": "[-15.482706 -12.537999  14.996562]"
    },
    "1753": {
        "#": "1753",
        "Sentence": "\u201cI did love him once\u2014but I loved you too.\u201dGatsby\u2019s eyes opened and closed.",
        "Embedding": "[-18.77855    -1.1929178  15.671713 ]"
    },
    "1754": {
        "#": "1754",
        "Sentence": "\u201cYou loved me too?\u201d he repeated.",
        "Embedding": "[-22.610294   -1.2706791  16.683342 ]"
    },
    "1755": {
        "#": "1755",
        "Sentence": "\u201cEven that\u2019s a lie,\u201d said Tom savagely.",
        "Embedding": "[-24.827152   23.489395   -3.3051848]"
    },
    "1756": {
        "#": "1756",
        "Sentence": "\u201cShe didn\u2019t know you werealive.",
        "Embedding": "[-27.266596  -1.498484  12.123281]"
    },
    "1757": {
        "#": "1757",
        "Sentence": "Why\u2014there\u2019s things between Daisy and me that you\u2019ll never know,things that neither of us can ever forget.\u201dThe words seemed to bite physically into Gatsby.",
        "Embedding": "[ 3.528359  29.358677   6.8896976]"
    },
    "1758": {
        "#": "1758",
        "Sentence": "\u201cI want to speak to Daisy alone,\u201d he insisted.",
        "Embedding": "[-11.669761    7.8256254  24.243153 ]"
    },
    "1759": {
        "#": "1759",
        "Sentence": "\u201cShe\u2019s all excitednow\u2014\u201d\u201cEven alone I can\u2019t say I never loved Tom,\u201d she admitted in a pitifulvoice.",
        "Embedding": "[-10.665093    -0.73678166  11.375012  ]"
    },
    "1760": {
        "#": "1760",
        "Sentence": "\u201cIt wouldn\u2019t be true.\u201d\u201cOf course it wouldn\u2019t,\u201d agreed Tom.",
        "Embedding": "[-21.278482   26.548822   -3.8092813]"
    },
    "1761": {
        "#": "1761",
        "Sentence": "She turned to her husband.",
        "Embedding": "[-24.402403 -24.100775  19.136707]"
    },
    "1762": {
        "#": "1762",
        "Sentence": "\u201cAs if it mattered to you,\u201d she said.",
        "Embedding": "[-29.156855 -17.243649   8.603517]"
    },
    "1763": {
        "#": "1763",
        "Sentence": "\u201cOf course it matters.",
        "Embedding": "[-45.40593   -9.536721  -5.873504]"
    },
    "1764": {
        "#": "1764",
        "Sentence": "I\u2019m going to take better care of you from nowon.\u201d\u201cYou don\u2019t understand,\u201d said Gatsby, with a touch of panic.",
        "Embedding": "[-2.7925844  29.467636   -0.07721692]"
    },
    "1765": {
        "#": "1765",
        "Sentence": "\u201cYou\u2019renot going to take care of her any more.\u201d\u201cI\u2019m not?\u201d Tom opened his eyes wide and laughed.",
        "Embedding": "[ 26.597528 -21.538212  11.84605 ]"
    },
    "1766": {
        "#": "1766",
        "Sentence": "He could afford tocontrol himself now.",
        "Embedding": "[-18.809494  -28.316774    0.9502086]"
    },
    "1767": {
        "#": "1767",
        "Sentence": "\u201cWhy\u2019s that?\u201d\u201cDaisy\u2019s leaving you.\u201d\u201cNonsense.\u201d\u201cI am, though,\u201d she said with a visible effort.",
        "Embedding": "[-18.046675 -10.223083  14.472016]"
    },
    "1768": {
        "#": "1768",
        "Sentence": "\u201cShe\u2019s not leaving me!\u201d Tom\u2019s words suddenly leaned down over Gatsby.",
        "Embedding": "[-0.85614425 34.6387      3.332689  ]"
    },
    "1769": {
        "#": "1769",
        "Sentence": "\u201cCertainly not for a common swindler who\u2019d have to steal the ring heput on her finger.\u201d\u201cI won\u2019t stand this!\u201d cried Daisy.",
        "Embedding": "[-7.447938 32.470306 17.567394]"
    },
    "1770": {
        "#": "1770",
        "Sentence": "\u201cOh, please let\u2019s get out.\u201d\u201cWho are you, anyhow?\u201d broke out Tom.",
        "Embedding": "[-26.10972    16.351984   -4.4875035]"
    },
    "1771": {
        "#": "1771",
        "Sentence": "\u201cYou\u2019re one of that bunch thathangs around with Meyer Wolfshiem\u2014that much I happen to know.",
        "Embedding": "[-32.17214    9.690399   7.474835]"
    },
    "1772": {
        "#": "1772",
        "Sentence": "I\u2019vemade a little investigation into your affairs\u2014and I\u2019ll carry itfurther tomorrow.\u201d\u201cYou can suit yourself about that, old sport,\u201d said Gatsby steadily.",
        "Embedding": "[ -5.050667  30.254673 -10.229746]"
    },
    "1773": {
        "#": "1773",
        "Sentence": "\u201cI found out what your \u2018drugstores\u2019 were.\u201d He turned to us and spokerapidly.",
        "Embedding": "[  9.967481 -17.730408  -8.278739]"
    },
    "1774": {
        "#": "1774",
        "Sentence": "\u201cHe and this Wolfshiem bought up a lot of side-streetdrugstores here and in Chicago and sold grain alcohol over thecounter.",
        "Embedding": "[ 25.164623 -22.171904 -23.098045]"
    },
    "1775": {
        "#": "1775",
        "Sentence": "That\u2019s one of his little stunts.",
        "Embedding": "[-36.601818  -19.815674   -0.5784405]"
    },
    "1776": {
        "#": "1776",
        "Sentence": "I picked him for abootlegger the first time I saw him, and I wasn\u2019t far wrong.\u201d\u201cWhat about it?\u201d said Gatsby politely.",
        "Embedding": "[ 4.8317747 29.422863  -6.7454104]"
    },
    "1777": {
        "#": "1777",
        "Sentence": "\u201cI guess your friend WalterChase wasn\u2019t too proud to come in on it.\u201d\u201cAnd you left him in the lurch, didn\u2019t you?",
        "Embedding": "[-14.710395   5.078688 -23.392511]"
    },
    "1778": {
        "#": "1778",
        "Sentence": "You let him go to jail fora month over in New Jersey.",
        "Embedding": "[  1.1379064  26.149607  -23.378021 ]"
    },
    "1779": {
        "#": "1779",
        "Sentence": "God!",
        "Embedding": "[-43.369556   -7.9726176 -16.266941 ]"
    },
    "1780": {
        "#": "1780",
        "Sentence": "You ought to hear Walter on thesubject of you.\u201d\u201cHe came to us dead broke.",
        "Embedding": "[-13.808599    8.217926   -6.0573235]"
    },
    "1781": {
        "#": "1781",
        "Sentence": "He was very glad to pick up some money, oldsport.\u201d\u201cDon\u2019t you call me \u2018old sport\u2019!\u201d cried Tom.",
        "Embedding": "[-18.560926  21.817675 -13.378401]"
    },
    "1782": {
        "#": "1782",
        "Sentence": "Gatsby saidnothing.",
        "Embedding": "[-4.499512  41.85024    1.1349645]"
    },
    "1783": {
        "#": "1783",
        "Sentence": "\u201cWalter could have you up on the betting laws too, butWolfshiem scared him into shutting his mouth.\u201dThat unfamiliar yet recognizable look was back again in Gatsby\u2019s face.",
        "Embedding": "[ 0.20113665 34.628407   16.321812  ]"
    },
    "1784": {
        "#": "1784",
        "Sentence": "\u201cThat drugstore business was just small change,\u201d continued Tom slowly,\u201cbut you\u2019ve got something on now that Walter\u2019s afraid to tell meabout.\u201dI glanced at Daisy, who was staring terrified between Gatsby and herhusband, and at Jordan, who had begun to balance an invisible butabsorbing object on the tip of her chin.",
        "Embedding": "[ 2.05688  33.37822  13.979391]"
    },
    "1785": {
        "#": "1785",
        "Sentence": "Then I turned back toGatsby\u2014and was startled at his expression.",
        "Embedding": "[  1.4301238 -33.978046   -2.2917109]"
    },
    "1786": {
        "#": "1786",
        "Sentence": "He looked\u2014and this is saidin all contempt for the babbled slander of his garden\u2014as if he had\u201ckilled a man.\u201d For a moment the set of his face could be described injust that fantastic way.",
        "Embedding": "[20.242018  -4.3441906 -1.43796  ]"
    },
    "1787": {
        "#": "1787",
        "Sentence": "It passed, and he began to talk excitedly to Daisy, denyingeverything, defending his name against accusations that had not beenmade.",
        "Embedding": "[ 9.954537 10.21053  31.925333]"
    },
    "1788": {
        "#": "1788",
        "Sentence": "But with every word she was drawing further and further into herself, so he gave that up, and only the dead dream fought on as theafternoon slipped away, trying to touch what was no longer tangible,struggling unhappily, undespairingly, toward that lost voice acrossthe room.",
        "Embedding": "[-1.5921631 -2.6419759 31.648867 ]"
    },
    "1789": {
        "#": "1789",
        "Sentence": "The voice begged again to go.",
        "Embedding": "[-29.76747  -20.538553  19.8153  ]"
    },
    "1790": {
        "#": "1790",
        "Sentence": "\u201cPlease, Tom!",
        "Embedding": "[-26.81315    19.425074    0.6549902]"
    },
    "1791": {
        "#": "1791",
        "Sentence": "I can\u2019t stand this any more.\u201dHer frightened eyes told that whatever intentions, whatever courageshe had had, were definitely gone.",
        "Embedding": "[-3.948746 -8.223365 17.695572]"
    },
    "1792": {
        "#": "1792",
        "Sentence": "\u201cYou two start on home, Daisy,\u201d said Tom.",
        "Embedding": "[-21.5903    23.052294   7.26809 ]"
    },
    "1793": {
        "#": "1793",
        "Sentence": "\u201cIn Mr. Gatsby\u2019s car.\u201dShe looked at Tom, alarmed now, but he insisted with magnanimousscorn.",
        "Embedding": "[-26.993866   25.906378    5.6994348]"
    },
    "1794": {
        "#": "1794",
        "Sentence": "\u201cGo on.",
        "Embedding": "[-36.86325   -7.255181 -21.000124]"
    },
    "1795": {
        "#": "1795",
        "Sentence": "He won\u2019t annoy you.",
        "Embedding": "[-20.126143 -23.698393  -6.234713]"
    },
    "1796": {
        "#": "1796",
        "Sentence": "I think he realizes that his presumptuouslittle flirtation is over.\u201dThey were gone, without a word, snapped out, made accidental,isolated, like ghosts, even from our pity.",
        "Embedding": "[ 28.205202 -15.178883 -10.779879]"
    },
    "1797": {
        "#": "1797",
        "Sentence": "After a moment Tom got up and began wrapping the unopened bottle ofwhisky in the towel.",
        "Embedding": "[ 42.477592 -22.283861   5.023452]"
    },
    "1798": {
        "#": "1798",
        "Sentence": "\u201cWant any of this stuff?",
        "Embedding": "[-42.110332    3.5626695  -6.401846 ]"
    },
    "1799": {
        "#": "1799",
        "Sentence": "Jordan?",
        "Embedding": "[-6.019255   17.650965   -0.94937694]"
    },
    "1800": {
        "#": "1800",
        "Sentence": "\u2026 Nick?\u201dI didn\u2019t answer.",
        "Embedding": "[-28.309853   6.428857 -29.96534 ]"
    },
    "1801": {
        "#": "1801",
        "Sentence": "\u201cNick?\u201d He asked again.",
        "Embedding": "[-25.17003   15.7048    11.003587]"
    },
    "1802": {
        "#": "1802",
        "Sentence": "\u201cWhat?\u201d\u201cWant any?\u201d\u201cNo \u2026 I just remembered that today\u2019s my birthday.\u201dI was thirty.",
        "Embedding": "[-22.890467    6.8562813 -26.074947 ]"
    },
    "1803": {
        "#": "1803",
        "Sentence": "Before me stretched the portentous, menacing road of anew decade.",
        "Embedding": "[  5.255879  -41.917515   -6.7815604]"
    },
    "1804": {
        "#": "1804",
        "Sentence": "It was seven o\u2019clock when we got into the coup\u00e9 with him and startedfor Long Island.",
        "Embedding": "[  3.7001593  27.641495  -20.422731 ]"
    },
    "1805": {
        "#": "1805",
        "Sentence": "Tom talked incessantly, exulting and laughing, buthis voice was as remote from Jordan and me as the foreign clamour onthe sidewalk or the tumult of the elevated overhead.",
        "Embedding": "[ 5.549324 23.916897 17.953268]"
    },
    "1806": {
        "#": "1806",
        "Sentence": "Human sympathyhas its limits, and we were content to let all their tragic argumentsfade with the city lights behind.",
        "Embedding": "[31.386995   7.3637667 -7.5133157]"
    },
    "1807": {
        "#": "1807",
        "Sentence": "Thirty\u2014the promise of a decade ofloneliness, a thinning list of single men to know, a thinningbriefcase of enthusiasm, thinning hair.",
        "Embedding": "[ 2.9389122 35.23633   26.481054 ]"
    },
    "1808": {
        "#": "1808",
        "Sentence": "But there was Jordan besideme, who, unlike Daisy, was too wise ever to carry well-forgottendreams from age to age.",
        "Embedding": "[-8.09403  10.944758 33.01739 ]"
    },
    "1809": {
        "#": "1809",
        "Sentence": "As we passed over the dark bridge her wan facefell lazily against my coat\u2019s shoulder and the formidable stroke ofthirty died away with the reassuring pressure of her hand.",
        "Embedding": "[23.392563 -3.391818 25.823896]"
    },
    "1810": {
        "#": "1810",
        "Sentence": "So we drove on toward death through the cooling twilight.",
        "Embedding": "[ 43.400887  -16.211687   -2.5420349]"
    },
    "1811": {
        "#": "1811",
        "Sentence": "The young Greek, Michaelis, who ran the coffee joint beside theash-heaps was the principal witness at the inquest.",
        "Embedding": "[ 29.946228  21.427214 -24.220942]"
    },
    "1812": {
        "#": "1812",
        "Sentence": "He had sleptthrough the heat until after five, when he strolled over to thegarage, and found George Wilson sick in his office\u2014really sick, paleas his own pale hair and shaking all over.",
        "Embedding": "[10.998067 11.999969 16.20165 ]"
    },
    "1813": {
        "#": "1813",
        "Sentence": "Michaelis advised him to goto bed, but Wilson refused, saying that he\u2019d miss a lot of business ifhe did.",
        "Embedding": "[-4.173288 20.483202 14.87079 ]"
    },
    "1814": {
        "#": "1814",
        "Sentence": "While his neighbour was trying to persuade him a violentracket broke out overhead.",
        "Embedding": "[  7.3541   -21.528976   9.035139]"
    },
    "1815": {
        "#": "1815",
        "Sentence": "\u201cI\u2019ve got my wife locked in up there,\u201d explained Wilson calmly.",
        "Embedding": "[-12.637958  17.333065   8.788596]"
    },
    "1816": {
        "#": "1816",
        "Sentence": "\u201cShe\u2019s going to stay there till the day after tomorrow, and then we\u2019regoing to move away.\u201dMichaelis was astonished; they had been neighbours for four years, andWilson had never seemed faintly capable of such a statement.",
        "Embedding": "[-3.9037216 -3.9395769 27.158346 ]"
    },
    "1817": {
        "#": "1817",
        "Sentence": "Generally he was one of these worn-out men: when he wasn\u2019t working, he sat on a chair in the doorway and stared at the people and the carsthat passed along the road.",
        "Embedding": "[28.602993  -2.7082083 -4.9542503]"
    },
    "1818": {
        "#": "1818",
        "Sentence": "When anyone spoke to him he invariablylaughed in an agreeable, colourless way.",
        "Embedding": "[ 10.47851   -23.722794    7.8175483]"
    },
    "1819": {
        "#": "1819",
        "Sentence": "He was his wife\u2019s man and nothis own.",
        "Embedding": "[-19.0874    -9.083956  32.55283 ]"
    },
    "1820": {
        "#": "1820",
        "Sentence": "So naturally Michaelis tried to find out what had happened, but Wilsonwouldn\u2019t say a word\u2014instead he began to throw curious, suspiciousglances at his visitor and ask him what he\u2019d been doing at certaintimes on certain days.",
        "Embedding": "[ 14.201572  -17.17496     7.2944064]"
    },
    "1821": {
        "#": "1821",
        "Sentence": "Just as the latter was getting uneasy, some work men came past the door bound for his restaurant, and Michaelistook the opportunity to get away, intending to come back later.",
        "Embedding": "[16.449268  -8.017972   4.5386887]"
    },
    "1822": {
        "#": "1822",
        "Sentence": "But hedidn\u2019t.",
        "Embedding": "[-31.396757  -38.63646    -3.3187957]"
    },
    "1823": {
        "#": "1823",
        "Sentence": "He supposed he forgot to, that\u2019s all.",
        "Embedding": "[-20.623055  -23.204128   -2.4098551]"
    },
    "1824": {
        "#": "1824",
        "Sentence": "When he came outsideagain, a little after seven, he was reminded of the conversationbecause he heard Mrs. Wilson\u2019s voice, loud and scolding, downstairs inthe garage.",
        "Embedding": "[ 5.1902113 18.559767  10.4740715]"
    },
    "1825": {
        "#": "1825",
        "Sentence": "\u201cBeat me!\u201d he heard her cry.",
        "Embedding": "[-29.132776   -1.1870952  20.146774 ]"
    },
    "1826": {
        "#": "1826",
        "Sentence": "\u201cThrow me down and beat me, you dirtylittle coward!\u201dA moment later she rushed out into the dusk, waving her hands andshouting\u2014before he could move from his door the business was over.",
        "Embedding": "[12.625022  -3.1622636  6.606769 ]"
    },
    "1827": {
        "#": "1827",
        "Sentence": "The \u201cdeath car\u201d as the newspapers called it, didn\u2019t stop; it came outof the gathering darkness, wavered tragically for a moment, and thendisappeared around the next bend.",
        "Embedding": "[39.40013   -2.9708793  1.0722535]"
    },
    "1828": {
        "#": "1828",
        "Sentence": "Mavro Michaelis wasn\u2019t even sure ofits colour\u2014he told the first policeman that it was light green.",
        "Embedding": "[ 20.85179   -9.334636 -28.637278]"
    },
    "1829": {
        "#": "1829",
        "Sentence": "Theother car, the one going toward New York, came to rest a hundred yardsbeyond, and its driver hurried back to where Myrtle Wilson, her lifeviolently extinguished, knelt in the road and mingled her thick darkblood with the dust.",
        "Embedding": "[11.181606 14.162297 13.043775]"
    },
    "1830": {
        "#": "1830",
        "Sentence": "Michaelis and this man reached her first, but when they had torn openher shirtwaist, still damp with perspiration, they saw that her leftbreast was swinging loose like a flap, and there was no need to listenfor the heart beneath.",
        "Embedding": "[13.1709585 -2.9379702 18.375404 ]"
    },
    "1831": {
        "#": "1831",
        "Sentence": "The mouth was wide open and ripped a little atthe corners, as though she had choked a little in giving up thetremendous vitality she had stored so long.",
        "Embedding": "[10.843448  -1.5397339 18.18613  ]"
    },
    "1832": {
        "#": "1832",
        "Sentence": "We saw the three or four automobiles and the crowd when we were stillsome distance away.",
        "Embedding": "[ -6.828174 -45.714058   6.931247]"
    },
    "1833": {
        "#": "1833",
        "Sentence": "\u201cWreck!\u201d said Tom.",
        "Embedding": "[-25.433067    22.45682     -0.82969856]"
    },
    "1834": {
        "#": "1834",
        "Sentence": "\u201cThat\u2019s good.",
        "Embedding": "[-39.39658    -9.729103   -7.1491423]"
    },
    "1835": {
        "#": "1835",
        "Sentence": "Wilson\u2019ll have a little business atlast.\u201dHe slowed down, but still without any intention of stopping, until, aswe came nearer, the hushed, intent faces of the people at the garagedoor made him automatically put on the brakes.",
        "Embedding": "[25.404428  -1.4009358  4.768914 ]"
    },
    "1836": {
        "#": "1836",
        "Sentence": "\u201cWe\u2019ll take a look,\u201d he said doubtfully, \u201cjust a look.\u201dI became aware now of a hollow, wailing sound which issued incessantlyfrom the garage, a sound which as we got out of the coup\u00e9 and walkedtoward the door resolved itself into the words \u201cOh, my God!\u201d utteredover and over in a gasping moan.",
        "Embedding": "[37.01141  -7.063996 21.595564]"
    },
    "1837": {
        "#": "1837",
        "Sentence": "\u201cThere\u2019s some bad trouble here,\u201d said Tom excitedly.",
        "Embedding": "[-20.748459   21.079777    1.4328871]"
    },
    "1838": {
        "#": "1838",
        "Sentence": "He reached up on tiptoes and peered over a circle of heads into thegarage, which was lit only by a yellow light in a swinging metalbasket overhead.",
        "Embedding": "[30.57966   -1.9234912 12.0943775]"
    },
    "1839": {
        "#": "1839",
        "Sentence": "Then he made a harsh sound in his throat, and with aviolent thrusting movement of his powerful arms pushed his waythrough.",
        "Embedding": "[ 20.434156  -15.5579605  16.955605 ]"
    },
    "1840": {
        "#": "1840",
        "Sentence": "The circle closed up again with a running murmur of expostulation; it was a minute before I could see anything at all.",
        "Embedding": "[ 2.5198464 -6.0689573 23.862907 ]"
    },
    "1841": {
        "#": "1841",
        "Sentence": "Then new arrivalsderanged the line, and Jordan and I were pushed suddenly inside.",
        "Embedding": "[  3.7111592 -39.901035    1.673581 ]"
    },
    "1842": {
        "#": "1842",
        "Sentence": "Myrtle Wilson\u2019s body, wrapped in a blanket, and then in anotherblanket, as though she suffered from a chill in the hot night, lay ona worktable by the wall, and Tom, with his back to us, was bendingover it, motionless.",
        "Embedding": "[12.215734 14.554089 15.32706 ]"
    },
    "1843": {
        "#": "1843",
        "Sentence": "Next to him stood a motorcycle policeman takingdown names with much sweat and correction in a little book.",
        "Embedding": "[ 25.003212   -4.2428246 -30.583757 ]"
    },
    "1844": {
        "#": "1844",
        "Sentence": "At first Icouldn\u2019t find the source of the high, groaning words that echoedclamorously through the bare garage\u2014then I saw Wilson standing on theraised threshold of his office, swaying back and forth and holding tothe doorposts with both hands.",
        "Embedding": "[17.744463  -5.8077674 18.803802 ]"
    },
    "1845": {
        "#": "1845",
        "Sentence": "Some man was talking to him in a lowvoice and attempting, from time to time, to lay a hand on hisshoulder, but Wilson neither heard nor saw.",
        "Embedding": "[-2.9301505 20.71215    9.542475 ]"
    },
    "1846": {
        "#": "1846",
        "Sentence": "His eyes would drop slowlyfrom the swinging light to the laden table by the wall, and then jerkback to the light again, and he gave out incessantly his high,horrible call:\u201cOh, my Ga-od!",
        "Embedding": "[31.372204  -0.9458083 14.011308 ]"
    },
    "1847": {
        "#": "1847",
        "Sentence": "Oh, my Ga-od!",
        "Embedding": "[-36.236702   -5.701365   -9.4814415]"
    },
    "1848": {
        "#": "1848",
        "Sentence": "Oh, Ga-od!",
        "Embedding": "[-36.976322   -6.6252604 -10.993503 ]"
    },
    "1849": {
        "#": "1849",
        "Sentence": "Oh, my Ga-od!\u201dPresently Tom lifted his head with a jerk and, after staring aroundthe garage with glazed eyes, addressed a mumbled incoherent remark tothe policeman.",
        "Embedding": "[ 25.71996  -19.760233  13.915541]"
    },
    "1850": {
        "#": "1850",
        "Sentence": "\u201cM-a-v\u2014\u201d the policeman was saying, \u201c\u2014o\u2014\u201d\u201cNo, r\u2014\u201d corrected the man, \u201cM-a-v-r-o\u2014\u201d\u201cListen to me!\u201d muttered Tom fiercely.",
        "Embedding": "[ 25.31398    -6.5567555 -27.912794 ]"
    },
    "1851": {
        "#": "1851",
        "Sentence": "\u201cr\u2014\u201d said the policeman, \u201co\u2014\u201d\u201cg\u2014\u201d\u201cg\u2014\u201d He looked up as Tom\u2019s broad hand fell sharply on his shoulder.",
        "Embedding": "[ 24.561235 -18.162563  15.980033]"
    },
    "1852": {
        "#": "1852",
        "Sentence": "\u201cWhat you want, fella?\u201d\u201cWhat happened?\u2014that\u2019s what I want to know.\u201d\u201cAuto hit her.",
        "Embedding": "[-36.904163   8.387751  -1.016132]"
    },
    "1853": {
        "#": "1853",
        "Sentence": "Ins\u2019antly killed.\u201d\u201cInstantly killed,\u201d repeated Tom, staring.",
        "Embedding": "[-27.705568   26.486486    1.0904297]"
    },
    "1854": {
        "#": "1854",
        "Sentence": "\u201cShe ran out ina road.",
        "Embedding": "[-22.585043 -24.255188  15.138623]"
    },
    "1855": {
        "#": "1855",
        "Sentence": "Son-of-a-bitch didn\u2019t even stopus car.\u201d\u201cThere was two cars,\u201d said Michaelis, \u201cone comin\u2019, one goin\u2019, see?\u201d\u201cGoing where?\u201d asked the policeman keenly.",
        "Embedding": "[ 21.256443   -6.4871383 -29.03904  ]"
    },
    "1856": {
        "#": "1856",
        "Sentence": "\u201cOne goin\u2019 each way.",
        "Embedding": "[-47.190582   -1.3480313 -10.862756 ]"
    },
    "1857": {
        "#": "1857",
        "Sentence": "Well, she\u201d\u2014his hand rose toward the blankets butstopped halfway and fell to his side\u2014\u201cshe ran out there an\u2019 the onecomin\u2019 from N\u2019York knock right into her, goin\u2019 thirty or forty mile san hour.\u201d\u201cWhat\u2019s the name of this place here?\u201d demanded the officer.",
        "Embedding": "[19.102667 -4.952455 13.562244]"
    },
    "1858": {
        "#": "1858",
        "Sentence": "\u201cHasn\u2019t got any name.\u201dA pale well-dressed negro stepped near.",
        "Embedding": "[ 10.95314  -22.980822 -34.81595 ]"
    },
    "1859": {
        "#": "1859",
        "Sentence": "\u201cIt was a yellow car,\u201d he said, \u201cbig yellow car.",
        "Embedding": "[ 16.902895  -6.819663 -24.831928]"
    },
    "1860": {
        "#": "1860",
        "Sentence": "New.\u201d\u201cSee the accident?\u201d asked the policeman.",
        "Embedding": "[ 20.037361  -5.653167 -32.852833]"
    },
    "1861": {
        "#": "1861",
        "Sentence": "\u201cNo, but the car passed me down the road, going faster\u2019n forty.",
        "Embedding": "[ 12.7967     -4.2332716 -24.320396 ]"
    },
    "1862": {
        "#": "1862",
        "Sentence": "Goingfifty, sixty.\u201d\u201cCome here and let\u2019s have your name.",
        "Embedding": "[-26.424065    2.7213407  -2.7745605]"
    },
    "1863": {
        "#": "1863",
        "Sentence": "Look out now.",
        "Embedding": "[-33.94297    -7.7247925 -21.355772 ]"
    },
    "1864": {
        "#": "1864",
        "Sentence": "I want to get hisname.\u201dSome words of this conversation must have reached Wilson, swaying inthe office door, for suddenly a new theme found voice among hisgrasping cries:\u201cYou don\u2019t have to tell me what kind of car it was!",
        "Embedding": "[  3.0768049  16.083387  -12.833187 ]"
    },
    "1865": {
        "#": "1865",
        "Sentence": "I know what kindof car it was!\u201dWatching Tom, I saw the wad of muscle back of his shoulder tightenunder his coat.",
        "Embedding": "[-17.673529  26.775688  -9.639575]"
    },
    "1866": {
        "#": "1866",
        "Sentence": "He walked quickly over to Wilson and, standing infront of him, seized him firmly by the upper arms.",
        "Embedding": "[ 22.433167 -16.8573    17.281527]"
    },
    "1867": {
        "#": "1867",
        "Sentence": "\u201cYou\u2019ve got to pull yourself together,\u201d he said with soothinggruffness.",
        "Embedding": "[-16.151102 -20.476377  -8.251549]"
    },
    "1868": {
        "#": "1868",
        "Sentence": "Wilson\u2019s eyes fell upon Tom; he started up on his tiptoes and thenwould have collapsed to his knees had not Tom held him upright.",
        "Embedding": "[ 9.7721   25.377186 14.547197]"
    },
    "1869": {
        "#": "1869",
        "Sentence": "\u201cListen,\u201d said Tom, shaking him a little.",
        "Embedding": "[-24.203836  22.112326   2.725132]"
    },
    "1870": {
        "#": "1870",
        "Sentence": "\u201cI just got here a minuteago, from New York.",
        "Embedding": "[ -4.675451  30.78198  -23.61709 ]"
    },
    "1871": {
        "#": "1871",
        "Sentence": "I was bringing you that coup\u00e9 we\u2019ve been talkingabout.",
        "Embedding": "[-10.595649   5.011273 -21.48464 ]"
    },
    "1872": {
        "#": "1872",
        "Sentence": "That yellow car I was driving this afternoon wasn\u2019t mine\u2014do youhear?",
        "Embedding": "[ 14.975953  -7.030085 -25.176119]"
    },
    "1873": {
        "#": "1873",
        "Sentence": "I haven\u2019t seen it all afternoon.\u201dOnly the negro and I were near enough to hear what he said, but thepoliceman caught something in the tone and looked over with truculenteyes.",
        "Embedding": "[ 2.045436   1.3890319 -6.662361 ]"
    },
    "1874": {
        "#": "1874",
        "Sentence": "\u201cWhat\u2019s all that?\u201d he demanded.",
        "Embedding": "[-18.384823  -11.83796    -6.0412536]"
    },
    "1875": {
        "#": "1875",
        "Sentence": "\u201cI\u2019m a friend of his.\u201d Tom turned his head but kept his hands firm onWilson\u2019s body.",
        "Embedding": "[  7.5329275 -29.744083  -17.484379 ]"
    },
    "1876": {
        "#": "1876",
        "Sentence": "\u201cHe says he knows the car that did it \u2026 It was a yellowcar.\u201dSome dim impulse moved the policeman to look suspiciously at Tom.",
        "Embedding": "[ 23.840366   -6.6116896 -25.292707 ]"
    },
    "1877": {
        "#": "1877",
        "Sentence": "\u201cAnd what colour\u2019s your car?\u201d\u201cIt\u2019s a blue car, a coup\u00e9.\u201d\u201cWe\u2019ve come straight from New York,\u201d I said.",
        "Embedding": "[ 12.543399  -8.448954 -27.648108]"
    },
    "1878": {
        "#": "1878",
        "Sentence": "Someone who had been driving a little behind us confirmed this, andthe policeman turned away.",
        "Embedding": "[ 21.364603  -4.555679 -29.992395]"
    },
    "1879": {
        "#": "1879",
        "Sentence": "\u201cNow, if you\u2019ll let me have that name again correct\u2014\u201dPicking up Wilson like a doll, Tom carried him into the office, sethim down in a chair, and came back.",
        "Embedding": "[-10.518302  24.585718   9.197853]"
    },
    "1880": {
        "#": "1880",
        "Sentence": "\u201cIf somebody\u2019ll come here and sit with him,\u201d he snappedauthoritatively.",
        "Embedding": "[ -4.804523 -39.979103  -4.63087 ]"
    },
    "1881": {
        "#": "1881",
        "Sentence": "He watched while the two men standing closest glancedat each other and went unwillingly into the room.",
        "Embedding": "[27.720613 -9.888136 19.493975]"
    },
    "1882": {
        "#": "1882",
        "Sentence": "Then Tom shut thedoor on them and came down the single step, his eyes avoiding thetable.",
        "Embedding": "[ 36.669006   -13.887351     0.15689318]"
    },
    "1883": {
        "#": "1883",
        "Sentence": "As he passed close to me he whispered: \u201cLet\u2019s get out.\u201dSelf-consciously, with his authoritative arms breaking the way, wepushed through the still gathering crowd, passing a hurried doctor,case in hand, who had been sent for in wild hope half an hour ago.",
        "Embedding": "[21.300436 -3.583457  9.028134]"
    },
    "1884": {
        "#": "1884",
        "Sentence": "Tom drove slowly until we were beyond the bend\u2014then his foot came downhard, and the coup\u00e9 raced along through the night.",
        "Embedding": "[27.808523  8.647133 -1.430034]"
    },
    "1885": {
        "#": "1885",
        "Sentence": "In a little while Iheard a low husky sob, and saw that the tears were overflowing downhis face.",
        "Embedding": "[  2.786599 -10.519964  39.765533]"
    },
    "1886": {
        "#": "1886",
        "Sentence": "\u201cThe God damned coward!\u201d he whimpered.",
        "Embedding": "[-21.74639  -16.566238  -3.995981]"
    },
    "1887": {
        "#": "1887",
        "Sentence": "\u201cHe didn\u2019t even stop his car.\u201d The Buchanans\u2019 house floated suddenly toward us through the darkrustling trees.",
        "Embedding": "[ 19.356869  -17.887272    2.6542833]"
    },
    "1888": {
        "#": "1888",
        "Sentence": "Tom stopped beside the porch and looked up at thesecond floor, where two windows bloomed with light among the vines.",
        "Embedding": "[33.86039  11.045057  6.42839 ]"
    },
    "1889": {
        "#": "1889",
        "Sentence": "\u201cDaisy\u2019s home,\u201d he said.",
        "Embedding": "[-17.909029    5.6893888  21.104837 ]"
    },
    "1890": {
        "#": "1890",
        "Sentence": "As we got out of the car he glanced at me andfrowned slightly.",
        "Embedding": "[ -0.55221397 -27.005188    -3.8314564 ]"
    },
    "1891": {
        "#": "1891",
        "Sentence": "\u201cI ought to have dropped you in West Egg, Nick.",
        "Embedding": "[  0.1043111  17.101305  -27.221376 ]"
    },
    "1892": {
        "#": "1892",
        "Sentence": "There\u2019s nothing we cando tonight.\u201dA change had come over him, and he spoke gravely, and with decision.",
        "Embedding": "[ 1.1056248 -3.256881  -3.2808485]"
    },
    "1893": {
        "#": "1893",
        "Sentence": "As we walked across the moonlight gravel to the porch he disposed ofthe situation in a few brisk phrases.",
        "Embedding": "[17.15711 18.77877 35.68442]"
    },
    "1894": {
        "#": "1894",
        "Sentence": "\u201cI\u2019ll telephone for a taxi to take you home, and while you\u2019re waitingyou and Jordan better go in the kitchen and have them get you somesupper\u2014if you want any.\u201d He opened the door.",
        "Embedding": "[  9.122241    2.4659338 -18.945787 ]"
    },
    "1895": {
        "#": "1895",
        "Sentence": "\u201cCome in.\u201d\u201cNo, thanks.",
        "Embedding": "[-34.713898   -1.7201769 -12.222605 ]"
    },
    "1896": {
        "#": "1896",
        "Sentence": "But I\u2019d be glad if you\u2019d order me the taxi.",
        "Embedding": "[  7.6898055    0.29786336 -19.31197   ]"
    },
    "1897": {
        "#": "1897",
        "Sentence": "I\u2019ll waitoutside.\u201dJordan put her hand on my arm.",
        "Embedding": "[  8.590277  -31.7826      1.0373207]"
    },
    "1898": {
        "#": "1898",
        "Sentence": "\u201cWon\u2019t you come in, Nick?\u201d\u201cNo, thanks.\u201dI was feeling a little sick and I wanted to be alone.",
        "Embedding": "[-14.295848    1.6207631 -15.838642 ]"
    },
    "1899": {
        "#": "1899",
        "Sentence": "But Jordanlingered for a moment more.",
        "Embedding": "[-24.895517 -38.968307  -7.184373]"
    },
    "1900": {
        "#": "1900",
        "Sentence": "\u201cIt\u2019s only half-past nine,\u201d she said.",
        "Embedding": "[-27.805782  -17.61659     3.5726652]"
    },
    "1901": {
        "#": "1901",
        "Sentence": "I\u2019d be damned if I\u2019d go in; I\u2019d had enough of all of them for one day,and suddenly that included Jordan too.",
        "Embedding": "[-4.5487065 13.459398  -6.876193 ]"
    },
    "1902": {
        "#": "1902",
        "Sentence": "She must have seen something ofthis in my expression, for she turned abruptly away and ran up theporch steps into the house.",
        "Embedding": "[  7.763131 -11.143645  22.354593]"
    },
    "1903": {
        "#": "1903",
        "Sentence": "I sat down for a few minutes with my headin my hands, until I heard the phone taken up inside and the butler\u2019svoice calling a taxi.",
        "Embedding": "[ 10.942998    4.2443666 -17.94363  ]"
    },
    "1904": {
        "#": "1904",
        "Sentence": "Then I walked slowly down the drive away fromthe house, intending to wait by the gate.",
        "Embedding": "[34.423862  -9.151859  -1.0064839]"
    },
    "1905": {
        "#": "1905",
        "Sentence": "I hadn\u2019t gone twenty yards when I heard my name and Gatsby steppedfrom between two bushes into the path.",
        "Embedding": "[ 8.200816  32.29731   -5.6874585]"
    },
    "1906": {
        "#": "1906",
        "Sentence": "I must have felt pretty weirdby that time, because I could think of nothing except the luminosityof his pink suit under the moon.",
        "Embedding": "[ 3.5700448 -5.477092   1.433807 ]"
    },
    "1907": {
        "#": "1907",
        "Sentence": "\u201cWhat are you doing?\u201d I inquired.",
        "Embedding": "[-23.868084  -4.984703  -8.406238]"
    },
    "1908": {
        "#": "1908",
        "Sentence": "\u201cJust standing here, old sport.\u201dSomehow, that seemed a despicable occupation.",
        "Embedding": "[ -8.927642  17.813654 -24.419336]"
    },
    "1909": {
        "#": "1909",
        "Sentence": "For all I knew he wasgoing to rob the house in a moment; I wouldn\u2019t have been surprised tosee sinister faces, the faces of \u201cWolfshiem\u2019s people,\u201d behind him inthe dark shrubbery.",
        "Embedding": "[ 33.599583   4.293816 -16.079456]"
    },
    "1910": {
        "#": "1910",
        "Sentence": "\u201cDid you see any trouble on the road?\u201d he asked after a minute.",
        "Embedding": "[-11.115142 -11.100878 -13.040786]"
    },
    "1911": {
        "#": "1911",
        "Sentence": "\u201cYes.\u201dHe hesitated.",
        "Embedding": "[-17.37138  -19.187534 -17.180386]"
    },
    "1912": {
        "#": "1912",
        "Sentence": "\u201cWas she killed?\u201d\u201cYes.\u201d\u201cI thought so; I told Daisy I thought so.",
        "Embedding": "[-12.440306  14.920215  22.51835 ]"
    },
    "1913": {
        "#": "1913",
        "Sentence": "It\u2019s better that the shockshould all come at once.",
        "Embedding": "[-34.402348    2.0958633   1.2740262]"
    },
    "1914": {
        "#": "1914",
        "Sentence": "She stood it pretty well.\u201dHe spoke as if Daisy\u2019s reaction was the only thing that mattered.",
        "Embedding": "[ -4.8505588 -10.07244    23.392857 ]"
    },
    "1915": {
        "#": "1915",
        "Sentence": "\u201cI got to West Egg by a side road,\u201d he went on, \u201cand left the car inmy garage.",
        "Embedding": "[ 17.406954   -2.6350186 -21.14776  ]"
    },
    "1916": {
        "#": "1916",
        "Sentence": "I don\u2019t think anybody saw us, but of course I can\u2019t besure.\u201dI disliked him so much by this time that I didn\u2019t find it necessary totell him he was wrong.",
        "Embedding": "[-1.8846891 -3.978542  -4.0827274]"
    },
    "1917": {
        "#": "1917",
        "Sentence": "\u201cWho was the woman?\u201d he inquired.",
        "Embedding": "[-21.967005 -13.745069  -9.163134]"
    },
    "1918": {
        "#": "1918",
        "Sentence": "\u201cHer name was Wilson.",
        "Embedding": "[-14.8412285  22.295956   18.935692 ]"
    },
    "1919": {
        "#": "1919",
        "Sentence": "Her husband owns the garage.",
        "Embedding": "[-18.482975  -5.272213  34.596252]"
    },
    "1920": {
        "#": "1920",
        "Sentence": "How the devil didit happen?\u201d\u201cWell, I tried to swing the wheel\u2014\u201d He broke off, and suddenly Iguessed at the truth.",
        "Embedding": "[ 13.135149    1.9571321 -27.409624 ]"
    },
    "1921": {
        "#": "1921",
        "Sentence": "\u201cWas Daisy driving?\u201d\u201cYes,\u201d he said after a moment, \u201cbut of course I\u2019ll say I was.",
        "Embedding": "[-12.173613  12.823704  24.228683]"
    },
    "1922": {
        "#": "1922",
        "Sentence": "You see,when we left New York she was very nervous and she thought it wouldsteady her to drive\u2014and this woman rushed out at us just as we werepassing a car coming the other way.",
        "Embedding": "[ 2.3529706 -7.3449903 29.743153 ]"
    },
    "1923": {
        "#": "1923",
        "Sentence": "It all happened in a minute, butit seemed to me that she wanted to speak to us, thought we weresomebody she knew.",
        "Embedding": "[-8.768272 -8.958812 18.332901]"
    },
    "1924": {
        "#": "1924",
        "Sentence": "Well, first Daisy turned away from the woman towardthe other car, and then she lost her nerve and turned back.",
        "Embedding": "[ 3.1209927 -5.609386  31.411549 ]"
    },
    "1925": {
        "#": "1925",
        "Sentence": "The secondmy hand reached the wheel I felt the shock\u2014it must have killed herinstantly.\u201d\u201cIt ripped her open\u2014\u201d\u201cDon\u2019t tell me, old sport.\u201d He winced.",
        "Embedding": "[  9.92668     3.0750551 -32.94076  ]"
    },
    "1926": {
        "#": "1926",
        "Sentence": "\u201cAnyhow\u2014Daisy stepped on it.",
        "Embedding": "[-34.984623 -28.541489 -19.317022]"
    },
    "1927": {
        "#": "1927",
        "Sentence": "Itried to make her stop, but she couldn\u2019t, so I pulled on the emergencybrake.",
        "Embedding": "[-18.680655 -15.47999   14.55306 ]"
    },
    "1928": {
        "#": "1928",
        "Sentence": "Then she fell over into my lap and I drove on.",
        "Embedding": "[ -0.11911666 -41.724792     2.659341  ]"
    },
    "1929": {
        "#": "1929",
        "Sentence": "\u201cShe\u2019ll be all right tomorrow,\u201d he said presently.",
        "Embedding": "[-20.32309     -6.9705453   -0.20247607]"
    },
    "1930": {
        "#": "1930",
        "Sentence": "\u201cI\u2019m just going towait here and see if he tries to bother her about that unpleasantnessthis afternoon.",
        "Embedding": "[-12.683116 -16.684734  12.51676 ]"
    },
    "1931": {
        "#": "1931",
        "Sentence": "She\u2019s locked herself into her room, and if he tries any brutality she\u2019s going to turn the light out and on again.\u201d\u201cHe won\u2019t touch her,\u201d I said.",
        "Embedding": "[ 8.4359665 -5.5364804  6.790025 ]"
    },
    "1932": {
        "#": "1932",
        "Sentence": "\u201cHe\u2019s not thinking about her.\u201d\u201cI don\u2019t trust him, old sport.\u201d\u201cHow long are you going to wait?\u201d\u201cAll night, if necessary.",
        "Embedding": "[ -7.520908 -14.007462 -16.583023]"
    },
    "1933": {
        "#": "1933",
        "Sentence": "Anyhow, till they all go to bed.\u201dA new point of view occurred to me.",
        "Embedding": "[-32.446194    4.464429    3.0337052]"
    },
    "1934": {
        "#": "1934",
        "Sentence": "Suppose Tom found out that Daisyhad been driving.",
        "Embedding": "[-28.694035   23.965397   -2.4129274]"
    },
    "1935": {
        "#": "1935",
        "Sentence": "He might think he saw a connection in it\u2014he mightthink anything.",
        "Embedding": "[-16.117817  -25.312672   -0.5548389]"
    },
    "1936": {
        "#": "1936",
        "Sentence": "I looked at the house; there were two or three brightwindows downstairs and the pink glow from Daisy\u2019s room on the groundfloor.",
        "Embedding": "[ 8.613787 18.439827 32.84008 ]"
    },
    "1937": {
        "#": "1937",
        "Sentence": "\u201cYou wait here,\u201d I said.",
        "Embedding": "[-23.717844    1.8117824 -18.29404  ]"
    },
    "1938": {
        "#": "1938",
        "Sentence": "\u201cI\u2019ll see if there\u2019s any sign of acommotion.\u201dI walked back along the border of the lawn, traversed the gravelsoftly, and tiptoed up the veranda steps.",
        "Embedding": "[35.35811   14.297643   2.3185706]"
    },
    "1939": {
        "#": "1939",
        "Sentence": "The drawing-room curtainswere open, and I saw that the room was empty.",
        "Embedding": "[ 13.206953 -18.671665 -16.35548 ]"
    },
    "1940": {
        "#": "1940",
        "Sentence": "Crossing the porch wherewe had dined that June night three months before, I came to a smallrectangle of light which I guessed was the pantry window.",
        "Embedding": "[ 39.27547    -3.7514837 -10.72892  ]"
    },
    "1941": {
        "#": "1941",
        "Sentence": "The blindwas drawn, but I found a rift at the sill.",
        "Embedding": "[  8.859971 -39.501015  -8.927676]"
    },
    "1942": {
        "#": "1942",
        "Sentence": "Daisy and Tom were sitting opposite each other at the kitchen table,with a plate of cold fried chicken between them, and two bottles ofale.",
        "Embedding": "[41.810146   23.302914   -0.05431737]"
    },
    "1943": {
        "#": "1943",
        "Sentence": "He was talking intently across the table at her, and in hisearnestness his hand had fallen upon and covered her own.",
        "Embedding": "[ 21.037546 -15.764685  25.196936]"
    },
    "1944": {
        "#": "1944",
        "Sentence": "Once in awhile she looked up at him and nodded in agreement.",
        "Embedding": "[ -6.396114  -37.27074     5.7097836]"
    },
    "1945": {
        "#": "1945",
        "Sentence": "They weren\u2019t happy, and neither of them had touched the chicken or theale\u2014and yet they weren\u2019t unhappy either.",
        "Embedding": "[ 28.83461  -28.524895  -9.889216]"
    },
    "1946": {
        "#": "1946",
        "Sentence": "There was an unmistakable airof natural intimacy about the picture, and anybody would have saidthat they were conspiring together.",
        "Embedding": "[ 27.649584  -31.863451    2.1085615]"
    },
    "1947": {
        "#": "1947",
        "Sentence": "As I tiptoed from the porch I heard my taxi feeling its way along thedark road toward the house.",
        "Embedding": "[ 13.303266   3.560937 -19.609674]"
    },
    "1948": {
        "#": "1948",
        "Sentence": "Gatsby was waiting where I had left him inthe drive.",
        "Embedding": "[ 0.14104418 39.36795     1.4789287 ]"
    },
    "1949": {
        "#": "1949",
        "Sentence": "\u201cIs it all quiet up there?\u201d he asked anxiously.",
        "Embedding": "[-13.845936 -19.710215 -13.212443]"
    },
    "1950": {
        "#": "1950",
        "Sentence": "\u201cYes, it\u2019s all quiet.\u201d I hesitated.",
        "Embedding": "[-11.573397 -20.417786 -14.050421]"
    },
    "1951": {
        "#": "1951",
        "Sentence": "\u201cYou\u2019d better come home and getsome sleep.\u201dHe shook his head.",
        "Embedding": "[  4.5697227 -27.37773   -14.65699  ]"
    },
    "1952": {
        "#": "1952",
        "Sentence": "\u201cI want to wait here till Daisy goes to bed.",
        "Embedding": "[-16.594967  11.096475  19.869223]"
    },
    "1953": {
        "#": "1953",
        "Sentence": "Good night, old sport.\u201dHe put his hands in his coat pockets and turned back eagerly to hisscrutiny of the house, as though my presence marred the sacredness ofthe vigil.",
        "Embedding": "[17.195574  -0.8877953 10.032908 ]"
    },
    "1954": {
        "#": "1954",
        "Sentence": "So I walked away and left him standing there in themoonlight\u2014watching over nothing.",
        "Embedding": "[  4.229568  -35.701103   -4.5307508]"
    },
    "1955": {
        "#": "1955",
        "Sentence": "VIIII couldn\u2019t sleep all night; a foghorn was groaning incessantly on theSound, and I tossed half-sick between grotesque reality and savage,frightening dreams.",
        "Embedding": "[ 30.101171  -8.013004 -15.38603 ]"
    },
    "1956": {
        "#": "1956",
        "Sentence": "Toward dawn I heard a taxi go up Gatsby\u2019s drive,and immediately I jumped out of bed and began to dress\u2014I felt that Ihad something to tell him, something to warn him about, and morningwould be too late.",
        "Embedding": "[ 17.595919  -27.556273    5.7690434]"
    },
    "1957": {
        "#": "1957",
        "Sentence": "Crossing his lawn, I saw that his front door was still open and he wasleaning against a table in the hall, heavy with dejection or sleep.",
        "Embedding": "[ 8.505685  14.418298   1.6314857]"
    },
    "1958": {
        "#": "1958",
        "Sentence": "\u201cNothing happened,\u201d he said wanly.",
        "Embedding": "[-23.890081  -20.169788    1.3100209]"
    },
    "1959": {
        "#": "1959",
        "Sentence": "\u201cI waited, and about four o\u2019clockshe came to the window and stood there for a minute and then turnedout the light.\u201dHis house had never seemed so enormous to me as it did that night whenwe hunted through the great rooms for cigarettes.",
        "Embedding": "[ 32.443035  -4.308738 -17.953083]"
    },
    "1960": {
        "#": "1960",
        "Sentence": "We pushed asidecurtains that were like pavilions, and felt over innumerable feet ofdark wall for electric light switches\u2014once I tumbled with a sort ofsplash upon the keys of a ghostly piano.",
        "Embedding": "[35.56017    7.7003527 11.22748  ]"
    },
    "1961": {
        "#": "1961",
        "Sentence": "There was an inexplicableamount of dust everywhere, and the rooms were musty, as though theyhadn\u2019t been aired for many days.",
        "Embedding": "[51.071644   1.4693059  6.6422358]"
    },
    "1962": {
        "#": "1962",
        "Sentence": "I found the humidor on an unfamiliartable, with two stale, dry cigarettes inside.",
        "Embedding": "[ 43.13383   -16.824944    7.7184544]"
    },
    "1963": {
        "#": "1963",
        "Sentence": "Throwing open the Frenchwindows of the drawing-room, we sat smoking out into the darkness.",
        "Embedding": "[ 41.63446  -15.110715   9.474196]"
    },
    "1964": {
        "#": "1964",
        "Sentence": "\u201cYou ought to go away,\u201d I said.",
        "Embedding": "[-24.274292    3.7546887 -18.640322 ]"
    },
    "1965": {
        "#": "1965",
        "Sentence": "\u201cIt\u2019s pretty certain they\u2019ll traceyour car.\u201d\u201cGo away now, old sport?\u201d\u201cGo to Atlantic City for a week, or up to Montreal.\u201dHe wouldn\u2019t consider it.",
        "Embedding": "[ 10.147044  31.861633 -24.385155]"
    },
    "1966": {
        "#": "1966",
        "Sentence": "He couldn\u2019t possibly leave Daisy until heknew what she was going to do.",
        "Embedding": "[-11.2469225   4.54351    25.774622 ]"
    },
    "1967": {
        "#": "1967",
        "Sentence": "He was clutching at some last hope andI couldn\u2019t bear to shake him free.",
        "Embedding": "[  3.3108938 -34.51901   -15.112921 ]"
    },
    "1968": {
        "#": "1968",
        "Sentence": "It was this night that he told me the strange story of his youth withDan Cody\u2014told it to me because \u201cJay Gatsby\u201d had broken up like glassagainst Tom\u2019s hard malice, and the long secret extravaganza was playedout.",
        "Embedding": "[11.167456  38.873955  -0.8656941]"
    },
    "1969": {
        "#": "1969",
        "Sentence": "I think that he would have acknowledged anything now, withoutreserve, but he wanted to talk about Daisy.",
        "Embedding": "[-9.3012     7.3979073 26.41842  ]"
    },
    "1970": {
        "#": "1970",
        "Sentence": "She was the first \u201cnice\u201d girl he had ever known.",
        "Embedding": "[-12.473681 -28.521961  19.882853]"
    },
    "1971": {
        "#": "1971",
        "Sentence": "In various unrevealedcapacities he had come in contact with such people, but always withindiscernible barbed wire between.",
        "Embedding": "[ 12.035865 -25.91556   11.247649]"
    },
    "1972": {
        "#": "1972",
        "Sentence": "He found her excitinglydesirable.",
        "Embedding": "[-23.847847 -26.158913   7.538961]"
    },
    "1973": {
        "#": "1973",
        "Sentence": "He went to her house, at first with other officers fromCamp Taylor, then alone.",
        "Embedding": "[ 3.5226657  9.424617  30.257797 ]"
    },
    "1974": {
        "#": "1974",
        "Sentence": "It amazed him\u2014he had never been in such abeautiful house before.",
        "Embedding": "[-10.610848 -32.003544  18.39823 ]"
    },
    "1975": {
        "#": "1975",
        "Sentence": "But what gave it an air of breathlessintensity, was that Daisy lived there\u2014it was as casual a thing to heras his tent out at camp was to him.",
        "Embedding": "[-1.1897954  0.6306568 28.251677 ]"
    },
    "1976": {
        "#": "1976",
        "Sentence": "There was a ripe mystery about it,a hint of bedrooms upstairs more beautiful and cool than otherbedrooms, of gay and radiant activities taking place through itscorridors, and of romances that were not musty and laid away alreadyin lavender but fresh and breathing and redolent of this year\u2019sshining motorcars and of dances whose flowers were scarcelywithered.",
        "Embedding": "[31.707996 11.435825 17.61845 ]"
    },
    "1977": {
        "#": "1977",
        "Sentence": "It excited him, too, that many men had already lovedDaisy\u2014it increased her value in his eyes.",
        "Embedding": "[ -2.3799596 -22.01851    22.313166 ]"
    },
    "1978": {
        "#": "1978",
        "Sentence": "He felt their presence allabout the house, pervading the air with the shades and echoes of stillvibrant emotions.",
        "Embedding": "[30.471832  -1.9785347 20.491365 ]"
    },
    "1979": {
        "#": "1979",
        "Sentence": "But he knew that he was in Daisy\u2019s house by a colossalaccident.",
        "Embedding": "[  7.9368415  25.096712  -31.392225 ]"
    },
    "1980": {
        "#": "1980",
        "Sentence": "However glorious might be his future as Jay Gatsby, he wasat present a penniless young man without a past, and at any moment theinvisible cloak of his uniform might slip from his shoulders.",
        "Embedding": "[ 7.532872 43.330605  6.516348]"
    },
    "1981": {
        "#": "1981",
        "Sentence": "So hemade the most of his time.",
        "Embedding": "[ -7.5633717 -27.183174  -23.282919 ]"
    },
    "1982": {
        "#": "1982",
        "Sentence": "He took what he could get, ravenously andunscrupulously\u2014eventually he took Daisy one still October night, tookher because he had no real right to touch her hand.",
        "Embedding": "[-4.699384   3.7659116 29.18064  ]"
    },
    "1983": {
        "#": "1983",
        "Sentence": "He might have despised himself, for he had certainly taken her underfalse pretences.",
        "Embedding": "[ -7.4979205 -22.378288   16.06453  ]"
    },
    "1984": {
        "#": "1984",
        "Sentence": "I don\u2019t mean that he had traded on his phantommillions, but he had deliberately given Daisy a sense of security; helet her believe that he was a person from much the same strata asherself\u2014that he was fully able to take care of her.",
        "Embedding": "[-5.406081   3.6369536 31.901752 ]"
    },
    "1985": {
        "#": "1985",
        "Sentence": "As a matter offact, he had no such facilities\u2014he had no comfortable family standingbehind him, and he was liable at the whim of an impersonal governmentto be blown anywhere about the world.",
        "Embedding": "[ 24.075424  -8.109622 -10.368763]"
    },
    "1986": {
        "#": "1986",
        "Sentence": "But he didn\u2019t despise himself and it didn\u2019t turn out as he hadimagined.",
        "Embedding": "[-10.332404 -23.403505  13.472056]"
    },
    "1987": {
        "#": "1987",
        "Sentence": "He had intended, probably, to take what he could and go\u2014butnow he found that he had committed himself to the following of agrail.",
        "Embedding": "[ -3.997706 -21.69558   17.126629]"
    },
    "1988": {
        "#": "1988",
        "Sentence": "He knew that Daisy was extraordinary, but he didn\u2019t realizejust how extraordinary a \u201cnice\u201d girl could be.",
        "Embedding": "[-8.734421   7.3964314 29.478516 ]"
    },
    "1989": {
        "#": "1989",
        "Sentence": "She vanished into herrich house, into her rich, full life, leaving Gatsby\u2014nothing.",
        "Embedding": "[-1.1771324 -1.5929866 39.990513 ]"
    },
    "1990": {
        "#": "1990",
        "Sentence": "He feltmarried to her, that was all.",
        "Embedding": "[-24.231472 -23.627386   8.938633]"
    },
    "1991": {
        "#": "1991",
        "Sentence": "When they met again, two days later, it was Gatsby who was breathless,who was, somehow, betrayed.",
        "Embedding": "[13.897691  35.68826    0.7855951]"
    },
    "1992": {
        "#": "1992",
        "Sentence": "Her porch was bright with the boughtluxury of star-shine; the wicker of the settee squeaked fashionably asshe turned toward him and he kissed her curious and lovely mouth.",
        "Embedding": "[15.554866  -3.5636966 30.09597  ]"
    },
    "1993": {
        "#": "1993",
        "Sentence": "She had caught a cold, and it made her voice huskier and more charming than ever, and Gatsby was overwhelmingly aware of the youth andmystery that wealth imprisons and preserves, of the freshness of manyclothes, and of Daisy, gleaming like silver, safe and proud above thehot struggles of the poor.",
        "Embedding": "[18.31809  33.346462 12.979332]"
    },
    "1994": {
        "#": "1994",
        "Sentence": "\u201cI can\u2019t describe to you how surprised I was to find out I loved her,old sport.",
        "Embedding": "[-19.591448  19.21466  -22.914688]"
    },
    "1995": {
        "#": "1995",
        "Sentence": "I even hoped for a while that she\u2019d throw me over, but shedidn\u2019t, because she was in love with me too.",
        "Embedding": "[-17.085276  -5.35978   19.761724]"
    },
    "1996": {
        "#": "1996",
        "Sentence": "She thought I knew a lotbecause I knew different things from her \u2026 Well, there I was, way offmy ambitions, getting deeper in love every minute, and all of a suddenI didn\u2019t care.",
        "Embedding": "[-9.932506  -7.9334245 16.289202 ]"
    },
    "1997": {
        "#": "1997",
        "Sentence": "What was the use of doing great things if I could havea better time telling her what I was going to do?\u201dOn the last afternoon before he went abroad, he sat with Daisy in hisarms for a long, silent time.",
        "Embedding": "[-7.6179667  6.6140914 19.462362 ]"
    },
    "1998": {
        "#": "1998",
        "Sentence": "It was a cold fall day, with fire in theroom and her cheeks flushed.",
        "Embedding": "[47.75966   -5.9296327  8.42635  ]"
    },
    "1999": {
        "#": "1999",
        "Sentence": "Now and then she moved and he changed hisarm a little, and once he kissed her dark shining hair.",
        "Embedding": "[14.456441  -0.1066223 33.977127 ]"
    },
    "2000": {
        "#": "2000",
        "Sentence": "The afternoonhad made them tranquil for a while, as if to give them a deep memoryfor the long parting the next day promised.",
        "Embedding": "[ 24.19014  -12.777515   9.123579]"
    },
    "2001": {
        "#": "2001",
        "Sentence": "They had never been closerin their month of love, nor communicated more profoundly one withanother, than when she brushed silent lips against his coat\u2019s shoulderor when he touched the end of her fingers, gently, as though she wereasleep.",
        "Embedding": "[12.965706 -9.30847  26.43913 ]"
    },
    "2002": {
        "#": "2002",
        "Sentence": "He did extraordinarily well in the war.",
        "Embedding": "[-18.433632 -29.25996   -6.329104]"
    },
    "2003": {
        "#": "2003",
        "Sentence": "He was a captain before hewent to the front, and following the Argonne battles he got hismajority and the command of the divisional machine-guns.",
        "Embedding": "[ 21.350197 -29.812147 -27.357212]"
    },
    "2004": {
        "#": "2004",
        "Sentence": "After thearmistice he tried frantically to get home, but some complication ormisunderstanding sent him to Oxford instead.",
        "Embedding": "[  8.5095005 -21.680445   17.196184 ]"
    },
    "2005": {
        "#": "2005",
        "Sentence": "He was worried now\u2014therewas a quality of nervous despair in Daisy\u2019s letters.",
        "Embedding": "[ -8.603114 -19.939293  18.038786]"
    },
    "2006": {
        "#": "2006",
        "Sentence": "She didn\u2019t seewhy he couldn\u2019t come.",
        "Embedding": "[-18.090424 -23.964453  11.038842]"
    },
    "2007": {
        "#": "2007",
        "Sentence": "She was feeling the pressure of the worldoutside, and she wanted to see him and feel his presence beside herand be reassured that she was doing the right thing after all.",
        "Embedding": "[  1.3430213 -23.106838   22.10122  ]"
    },
    "2008": {
        "#": "2008",
        "Sentence": "For Daisy was young and her artificial world was redolent of orchidsand pleasant, cheerful snobbery and orchestras which set the rhythm ofthe year, summing up the sadness and suggestiveness of life in newtunes.",
        "Embedding": "[18.658363 32.823574 15.467222]"
    },
    "2009": {
        "#": "2009",
        "Sentence": "All night the saxophones wailed the hopeless comment of the\u201cBeale Street Blues\u201d while a hundred pairs of golden and silverslippers shuffled the shining dust.",
        "Embedding": "[21.51013 33.47967 18.10723]"
    },
    "2010": {
        "#": "2010",
        "Sentence": "At the grey tea hour there werealways rooms that throbbed incessantly with this low, sweet fever,while fresh faces drifted here and there like rose petals blown by the sad horns around the floor.",
        "Embedding": "[34.00516    6.7095547 15.657131 ]"
    },
    "2011": {
        "#": "2011",
        "Sentence": "Through this twilight universe Daisy began to move again with theseason; suddenly she was again keeping half a dozen dates a day withhalf a dozen men, and drowsing asleep at dawn with the beads andchiffon of an evening-dress tangled among dying orchids on the floorbeside her bed.",
        "Embedding": "[25.25039   7.482515 28.136028]"
    },
    "2012": {
        "#": "2012",
        "Sentence": "And all the time something within her was crying for adecision.",
        "Embedding": "[-15.920797 -18.65073   20.660246]"
    },
    "2013": {
        "#": "2013",
        "Sentence": "She wanted her life shaped now, immediately\u2014and the decisionmust be made by some force\u2014of love, of money, of unquestionablepracticality\u2014that was close at hand.",
        "Embedding": "[  2.4688225 -20.94108    23.635143 ]"
    },
    "2014": {
        "#": "2014",
        "Sentence": "That force took shape in the middle of spring with the arrival of Tom Buchanan.",
        "Embedding": "[46.792698  6.022584 12.946179]"
    },
    "2015": {
        "#": "2015",
        "Sentence": "There was a wholesome bulkiness about his person and hisposition, and Daisy was flattered.",
        "Embedding": "[-12.889466   9.28363   32.08058 ]"
    },
    "2016": {
        "#": "2016",
        "Sentence": "Doubtless there was a certainstruggle and a certain relief.",
        "Embedding": "[  8.95877  -29.670382 -25.030825]"
    },
    "2017": {
        "#": "2017",
        "Sentence": "The letter reached Gatsby while he wasstill at Oxford.",
        "Embedding": "[-0.16870198 44.603035    3.068483  ]"
    },
    "2018": {
        "#": "2018",
        "Sentence": "It was dawn now on Long Island and we went about opening the rest ofthe windows downstairs, filling the house with grey-turning,gold-turning light.",
        "Embedding": "[38.521317 13.067598  8.355354]"
    },
    "2019": {
        "#": "2019",
        "Sentence": "The shadow of a tree fell abruptly across the dewand ghostly birds began to sing among the blue leaves.",
        "Embedding": "[41.483143   6.7803216 13.3989315]"
    },
    "2020": {
        "#": "2020",
        "Sentence": "There was aslow, pleasant movement in the air, scarcely a wind, promising a cool,lovely day.",
        "Embedding": "[45.524483  -1.875825   7.5613055]"
    },
    "2021": {
        "#": "2021",
        "Sentence": "\u201cI don\u2019t think she ever loved him.\u201d Gatsby turned around from a windowand looked at me challengingly.",
        "Embedding": "[-1.3353736 31.76928    7.195148 ]"
    },
    "2022": {
        "#": "2022",
        "Sentence": "\u201cYou must remember, old sport, she wasvery excited this afternoon.",
        "Embedding": "[-16.101791  23.637558 -20.353943]"
    },
    "2023": {
        "#": "2023",
        "Sentence": "He told her those things in a way thatfrightened her\u2014that made it look as if I was some kind of cheapsharper.",
        "Embedding": "[ -5.8644395 -18.219967    9.389247 ]"
    },
    "2024": {
        "#": "2024",
        "Sentence": "And the result was she hardly knew what she was saying.\u201dHe sat down gloomily.",
        "Embedding": "[-14.167411 -21.498392  19.984371]"
    },
    "2025": {
        "#": "2025",
        "Sentence": "\u201cOf course she might have loved him just for a minute, when they werefirst married\u2014and loved me more even then, do you see?\u201dSuddenly he came out with a curious remark.",
        "Embedding": "[-14.753692  -4.051508  17.93733 ]"
    },
    "2026": {
        "#": "2026",
        "Sentence": "\u201cIn any case,\u201d he said, \u201cit was just personal.\u201dWhat could you make of that, except to suspect some intensity in hisconception of the affair that couldn\u2019t be measured?",
        "Embedding": "[ -0.8535671 -14.377539   13.772873 ]"
    },
    "2027": {
        "#": "2027",
        "Sentence": "He came back from France when Tom and Daisy were still on theirwedding trip, and made a miserable but irresistible journey toLouisville on the last of his army pay.",
        "Embedding": "[ 3.8638802  7.9554043 22.263332 ]"
    },
    "2028": {
        "#": "2028",
        "Sentence": "He stayed there a week,walking the streets where their footsteps had clicked together throughthe November night and revisiting the out-of-the-way places to whichthey had driven in her white car.",
        "Embedding": "[23.773483   2.6815283 -1.7419974]"
    },
    "2029": {
        "#": "2029",
        "Sentence": "Just as Daisy\u2019s house had alwaysseemed to him more mysterious and gay than other houses, so his ideaof the city itself, even though she was gone from it, was pervadedwith a melancholy beauty.",
        "Embedding": "[24.2736   17.503588  9.88834 ]"
    },
    "2030": {
        "#": "2030",
        "Sentence": "He left feeling that if he had searched harder, he might have foundher\u2014that he was leaving her behind.",
        "Embedding": "[ -6.68764  -24.651888  16.66373 ]"
    },
    "2031": {
        "#": "2031",
        "Sentence": "The day-coach\u2014he was pennilessnow\u2014was hot.",
        "Embedding": "[-33.160583  11.160954 -26.284353]"
    },
    "2032": {
        "#": "2032",
        "Sentence": "He went out to the open vestibule and sat down on afolding-chair, and the station slid away and the backs of unfamiliarbuildings moved by.",
        "Embedding": "[27.080212  -7.3669643 18.348623 ]"
    },
    "2033": {
        "#": "2033",
        "Sentence": "Then out into the spring fields, where a yellowtrolley raced them for a minute with people in it who might once haveseen the pale magic of her face along the casual street.",
        "Embedding": "[25.394764   5.122156   7.4588184]"
    },
    "2034": {
        "#": "2034",
        "Sentence": "The track curved and now it was going away from the sun, which, as itsank lower, seemed to spread itself in benediction over the vanishingcity where she had drawn her breath.",
        "Embedding": "[13.368716 -3.840191 21.25547 ]"
    },
    "2035": {
        "#": "2035",
        "Sentence": "He stretched out his handdesperately as if to snatch only a wisp of air, to save a fragment ofthe spot that she had made lovely for him.",
        "Embedding": "[ 14.4297695 -14.708003   16.982534 ]"
    },
    "2036": {
        "#": "2036",
        "Sentence": "But it was all going by toofast now for his blurred eyes and he knew that he had lost that partof it, the freshest and the best, forever.",
        "Embedding": "[ 23.906492  -14.540874   -2.7197087]"
    },
    "2037": {
        "#": "2037",
        "Sentence": "It was nine o\u2019clock when we finished breakfast and went out on theporch.",
        "Embedding": "[ 45.048042  -6.159739 -10.786092]"
    },
    "2038": {
        "#": "2038",
        "Sentence": "The night had made a sharp difference in the weather and therewas an autumn flavour in the air.",
        "Embedding": "[43.924152  -6.5585732  7.5831475]"
    },
    "2039": {
        "#": "2039",
        "Sentence": "The gardener, the last one ofGatsby\u2019s former servants, came to the foot of the steps.",
        "Embedding": "[46.8051    15.5934725  3.6010344]"
    },
    "2040": {
        "#": "2040",
        "Sentence": "\u201cI\u2019m going to drain the pool today, Mr. Gatsby.",
        "Embedding": "[-4.9808764 43.343327  -5.718935 ]"
    },
    "2041": {
        "#": "2041",
        "Sentence": "Leaves\u2019ll startfalling pretty soon, and then there\u2019s always trouble with the pipes.\u201d\u201cDon\u2019t do it today,\u201d Gatsby answered.",
        "Embedding": "[-11.5741     33.662994   -1.5792768]"
    },
    "2042": {
        "#": "2042",
        "Sentence": "He turned to me apologetically.",
        "Embedding": "[-22.287325  -32.06873    -3.3119845]"
    },
    "2043": {
        "#": "2043",
        "Sentence": "\u201cYou know, old sport, I\u2019ve never used that pool all summer?\u201dI looked at my watch and stood up.",
        "Embedding": "[-13.722707  23.304567 -24.018898]"
    },
    "2044": {
        "#": "2044",
        "Sentence": "\u201cTwelve minutes to my train.\u201dI didn\u2019t want to go to the city.",
        "Embedding": "[ -7.3184814  -6.594433  -35.505646 ]"
    },
    "2045": {
        "#": "2045",
        "Sentence": "I wasn\u2019t worth a decent stroke ofwork, but it was more than that\u2014I didn\u2019t want to leave Gatsby.",
        "Embedding": "[ 4.999024   36.15138     0.13787149]"
    },
    "2046": {
        "#": "2046",
        "Sentence": "Imissed that train, and then another, before I could get myself away.",
        "Embedding": "[  4.2672453 -13.214893  -23.775253 ]"
    },
    "2047": {
        "#": "2047",
        "Sentence": "\u201cI\u2019ll call you up,\u201d I said finally.",
        "Embedding": "[-26.812632     0.62546116 -12.940168  ]"
    },
    "2048": {
        "#": "2048",
        "Sentence": "\u201cDo, old sport.\u201d\u201cI\u2019ll call you about noon.\u201dWe walked slowly down the steps.",
        "Embedding": "[-16.147175   7.144103 -31.77673 ]"
    },
    "2049": {
        "#": "2049",
        "Sentence": "\u201cI suppose Daisy\u2019ll call too.\u201d He looked at me anxiously, as if hehoped I\u2019d corroborate this.",
        "Embedding": "[ -3.7554662 -21.49829    -8.502617 ]"
    },
    "2050": {
        "#": "2050",
        "Sentence": "\u201cI suppose so.\u201d\u201cWell, goodbye.\u201dWe shook hands and I started away.",
        "Embedding": "[  8.6515   -32.860924 -10.252601]"
    },
    "2051": {
        "#": "2051",
        "Sentence": "Just before I reached the hedge Iremembered something and turned around.",
        "Embedding": "[  4.317888  -38.537914   -6.2555966]"
    },
    "2052": {
        "#": "2052",
        "Sentence": "\u201cThey\u2019re a rotten crowd,\u201d I shouted across the lawn.",
        "Embedding": "[ 27.84818  -32.48426   10.403761]"
    },
    "2053": {
        "#": "2053",
        "Sentence": "\u201cYou\u2019re worth thewhole damn bunch put together.\u201dI\u2019ve always been glad I said that.",
        "Embedding": "[-18.726276    6.4699626 -21.130037 ]"
    },
    "2054": {
        "#": "2054",
        "Sentence": "It was the only compliment I evergave him, because I disapproved of him from beginning to end.",
        "Embedding": "[  1.6224443 -15.015821  -19.792542 ]"
    },
    "2055": {
        "#": "2055",
        "Sentence": "First henodded politely, and then his face broke into that radiant andunderstanding smile, as if we\u2019d been in ecstatic cahoots on that factall the time.",
        "Embedding": "[ 17.90052   -11.542623    9.7096405]"
    },
    "2056": {
        "#": "2056",
        "Sentence": "His gorgeous pink rag of a suit made a bright spot ofcolour against the white steps, and I thought of the night when Ifirst came to his ancestral home, three months before.",
        "Embedding": "[22.368357 22.838942 -6.437262]"
    },
    "2057": {
        "#": "2057",
        "Sentence": "The lawn anddrive had been crowded with the faces of those who guessed at hiscorruption\u2014and he had stood on those steps, concealing hisincorruptible dream, as he waved them goodbye.",
        "Embedding": "[24.95291    -0.34698486  8.105278  ]"
    },
    "2058": {
        "#": "2058",
        "Sentence": "I thanked him for his hospitality.",
        "Embedding": "[ -9.803801   -43.85904      0.31968608]"
    },
    "2059": {
        "#": "2059",
        "Sentence": "We were always thanking him forthat\u2014I and the others.",
        "Embedding": "[ -7.841057  -44.24029     2.0270052]"
    },
    "2060": {
        "#": "2060",
        "Sentence": "\u201cGoodbye,\u201d I called.",
        "Embedding": "[-29.509544    0.2544348 -10.826041 ]"
    },
    "2061": {
        "#": "2061",
        "Sentence": "\u201cI enjoyed breakfast, Gatsby.\u201d Up in the city, I tried for a while to list the quotations on aninterminable amount of stock, then I fell asleep in my swivel-chair.",
        "Embedding": "[ 17.730635    5.8845553 -15.859811 ]"
    },
    "2062": {
        "#": "2062",
        "Sentence": "Just before noon the phone woke me, and I started up with sweatbreaking out on my forehead.",
        "Embedding": "[ 11.371549    6.6073413 -17.370684 ]"
    },
    "2063": {
        "#": "2063",
        "Sentence": "It was Jordan Baker; she often called meup at this hour because the uncertainty of her own movements betweenhotels and clubs and private houses made her hard to find in any otherway.",
        "Embedding": "[ 2.3278265  3.4545403 16.801401 ]"
    },
    "2064": {
        "#": "2064",
        "Sentence": "Usually her voice came over the wire as something fresh and cool,as if a divot from a green golf-links had come sailing in at theoffice window, but this morning it seemed harsh and dry.",
        "Embedding": "[19.325762  17.935581  -3.8127198]"
    },
    "2065": {
        "#": "2065",
        "Sentence": "\u201cI\u2019ve left Daisy\u2019s house,\u201d she said.",
        "Embedding": "[-18.248922    4.8683743  19.122444 ]"
    },
    "2066": {
        "#": "2066",
        "Sentence": "\u201cI\u2019m at Hempstead, and I\u2019m goingdown to Southampton this afternoon.\u201dProbably it had been tactful to leave Daisy\u2019s house, but the actannoyed me, and her next remark made me rigid.",
        "Embedding": "[ 8.212265 15.665798 -7.162388]"
    },
    "2067": {
        "#": "2067",
        "Sentence": "\u201cYou weren\u2019t so nice to me last night.\u201d\u201cHow could it have mattered then?\u201dSilence for a moment.",
        "Embedding": "[-15.153475    4.4117403 -18.571386 ]"
    },
    "2068": {
        "#": "2068",
        "Sentence": "Then:\u201cHowever\u2014I want to see you.\u201d\u201cI want to see you, too.\u201d\u201cSuppose I don\u2019t go to Southampton, and come into town thisafternoon?\u201d\u201cNo\u2014I don\u2019t think this afternoon.\u201d\u201cVery well.\u201d\u201cIt\u2019s impossible this afternoon.",
        "Embedding": "[ 6.448067 19.692696 -9.430132]"
    },
    "2069": {
        "#": "2069",
        "Sentence": "Various\u2014\u201dWe talked like that for a while, and then abruptly we weren\u2019t talkingany longer.",
        "Embedding": "[-9.322392  -9.186232  -2.6298568]"
    },
    "2070": {
        "#": "2070",
        "Sentence": "I don\u2019t know which of us hung up with a sharp click, but Iknow I didn\u2019t care.",
        "Embedding": "[-7.5348277 -7.931233  -6.617134 ]"
    },
    "2071": {
        "#": "2071",
        "Sentence": "I couldn\u2019t have talked to her across a tea-tablethat day if I never talked to her again in this world.",
        "Embedding": "[-10.29945    -7.7940173  20.864279 ]"
    },
    "2072": {
        "#": "2072",
        "Sentence": "I called Gatsby\u2019s house a few minutes later, but the line was busy.",
        "Embedding": "[ 10.142908  31.206175 -13.211215]"
    },
    "2073": {
        "#": "2073",
        "Sentence": "Itried four times; finally an exasperated central told me the wire wasbeing kept open for long distance from Detroit.",
        "Embedding": "[ 14.663604  39.465374 -10.797916]"
    },
    "2074": {
        "#": "2074",
        "Sentence": "Taking out mytimetable, I drew a small circle around the three-fifty train.",
        "Embedding": "[  7.631996 -14.812442 -26.243526]"
    },
    "2075": {
        "#": "2075",
        "Sentence": "Then Ileaned back in my chair and tried to think.",
        "Embedding": "[  1.1755617 -39.79187     1.3106866]"
    },
    "2076": {
        "#": "2076",
        "Sentence": "It was just noon.",
        "Embedding": "[-26.688997 -22.929848 -16.732119]"
    },
    "2077": {
        "#": "2077",
        "Sentence": "When I passed the ash-heaps on the train that morning I had crosseddeliberately to the other side of the car.",
        "Embedding": "[ 11.5005865  -5.19879   -18.3062   ]"
    },
    "2078": {
        "#": "2078",
        "Sentence": "I supposed there\u2019d be acurious crowd around there all day with little boys searching for darkspots in the dust, and some garrulous man telling over and over whathad happened, until it became less and less real even to him and hecould tell it no longer, and Myrtle Wilson\u2019s tragic achievement wasforgotten.",
        "Embedding": "[13.450388 16.389341  9.430353]"
    },
    "2079": {
        "#": "2079",
        "Sentence": "Now I want to go back a little and tell what happened atthe garage after we left there the night before.",
        "Embedding": "[ 17.88484     -0.07510148 -18.626425  ]"
    },
    "2080": {
        "#": "2080",
        "Sentence": "They had difficulty in locating the sister, Catherine.",
        "Embedding": "[-35.923958    6.0477495  23.795029 ]"
    },
    "2081": {
        "#": "2081",
        "Sentence": "She must havebroken her rule against drinking that night, for when she arrived shewas stupid with liquor and unable to understand that the ambulance hadalready gone to Flushing.",
        "Embedding": "[  2.8147635 -19.902203   31.737411 ]"
    },
    "2082": {
        "#": "2082",
        "Sentence": "When they convinced her of this, sheimmediately fainted, as if that was the intolerable part of theaffair.",
        "Embedding": "[ 11.040448 -19.09599   30.239485]"
    },
    "2083": {
        "#": "2083",
        "Sentence": "Someone, kind or curious, took her in his car and drove her inthe wake of her sister\u2019s body.",
        "Embedding": "[-10.105647  -15.7578945  27.571114 ]"
    },
    "2084": {
        "#": "2084",
        "Sentence": "Until long after midnight a changing crowd lapped up against the frontof the garage, while George Wilson rocked himself back and forth onthe couch inside.",
        "Embedding": "[ 9.723004 19.117418 12.64844 ]"
    },
    "2085": {
        "#": "2085",
        "Sentence": "For a while the door of the office was open, andeveryone who came into the garage glanced irresistibly through it.",
        "Embedding": "[34.49709   -2.1174777 -6.375602 ]"
    },
    "2086": {
        "#": "2086",
        "Sentence": "Finally someone said it was a shame, and closed the door.",
        "Embedding": "[ 12.956528 -21.503807 -14.274613]"
    },
    "2087": {
        "#": "2087",
        "Sentence": "Michaelisand several other men were with him; first, four or five men, latertwo or three men.",
        "Embedding": "[ 27.161953  -37.439518   -5.7735343]"
    },
    "2088": {
        "#": "2088",
        "Sentence": "Still later Michaelis had to ask the last strangerto wait there fifteen minutes longer, while he went back to his ownplace and made a pot of coffee.",
        "Embedding": "[ 16.59311  -10.416648   1.742592]"
    },
    "2089": {
        "#": "2089",
        "Sentence": "After that, he stayed there alone withWilson until dawn.",
        "Embedding": "[-10.541021 -31.733     15.320842]"
    },
    "2090": {
        "#": "2090",
        "Sentence": "About three o\u2019clock the quality of Wilson\u2019s incoherent mutteringchanged\u2014he grew quieter and began to talk about the yellow car.",
        "Embedding": "[ 7.814596 21.836784  9.818677]"
    },
    "2091": {
        "#": "2091",
        "Sentence": "Heannounced that he had a way of finding out whom the yellow carbelonged to, and then he blurted out that a couple of months ago hiswife had come from the city with her face bruised and her noseswollen.",
        "Embedding": "[ 13.8908205 -18.129692   10.011232 ]"
    },
    "2092": {
        "#": "2092",
        "Sentence": "But when he heard himself say this, he flinched and began to cry \u201cOh,my God!\u201d again in his groaning voice.",
        "Embedding": "[ 12.396194 -24.417654  24.118036]"
    },
    "2093": {
        "#": "2093",
        "Sentence": "Michaelis made a clumsy attemptto distract him.",
        "Embedding": "[  2.8427129 -29.53073   -29.233644 ]"
    },
    "2094": {
        "#": "2094",
        "Sentence": "\u201cHow long have you been married, George?",
        "Embedding": "[-11.354734    1.4079243 -38.400246 ]"
    },
    "2095": {
        "#": "2095",
        "Sentence": "Come on there, try and sitstill a minute, and answer my question.",
        "Embedding": "[-22.62651      4.568675    -0.77725106]"
    },
    "2096": {
        "#": "2096",
        "Sentence": "How long have you beenmarried?\u201d\u201cTwelve years.\u201d\u201cEver had any children?",
        "Embedding": "[-11.294593    2.5994282 -36.85348  ]"
    },
    "2097": {
        "#": "2097",
        "Sentence": "Come on, George, sit still\u2014I asked you aquestion.",
        "Embedding": "[-16.998787    2.7789464 -39.706898 ]"
    },
    "2098": {
        "#": "2098",
        "Sentence": "Did you ever have any children?\u201dThe hard brown beetles kept thudding against the dull light, andwhenever Michaelis heard a car go tearing along the road outside itsounded to him like the car that hadn\u2019t stopped a few hours before.",
        "Embedding": "[26.737043   1.0187849 -2.3071163]"
    },
    "2099": {
        "#": "2099",
        "Sentence": "He didn\u2019t like to go into the garage, because the work bench wasstained where the body had been lying, so he moved uncomfortablyaround the office\u2014he knew every object in it before morning\u2014and fromtime to time sat down beside Wilson trying to keep him more quiet.",
        "Embedding": "[ 9.719713 17.330177  8.770807]"
    },
    "2100": {
        "#": "2100",
        "Sentence": "\u201cHave you got a church you go to sometimes, George?",
        "Embedding": "[-16.577051   -1.2906821 -38.152805 ]"
    },
    "2101": {
        "#": "2101",
        "Sentence": "Maybe even if youhaven\u2019t been there for a long time?",
        "Embedding": "[ -3.6970997 -22.50554   -20.980518 ]"
    },
    "2102": {
        "#": "2102",
        "Sentence": "Maybe I could call up the churchand get a priest to come over and he could talk to you, see?\u201d\u201cDon\u2019t belong to any.\u201d\u201cYou ought to have a church, George, for times like this.",
        "Embedding": "[-16.407955   -2.2964554 -40.383923 ]"
    },
    "2103": {
        "#": "2103",
        "Sentence": "You musthave gone to church once.",
        "Embedding": "[-18.856434   -1.1948535 -35.637672 ]"
    },
    "2104": {
        "#": "2104",
        "Sentence": "Didn\u2019t you get married in a church?",
        "Embedding": "[-16.768482   -2.2675874 -35.9557   ]"
    },
    "2105": {
        "#": "2105",
        "Sentence": "Listen,George, listen to me.",
        "Embedding": "[-34.33306   -4.611969 -17.247896]"
    },
    "2106": {
        "#": "2106",
        "Sentence": "Didn\u2019t you get married in a church?\u201d\u201cThat was a long time ago.\u201dThe effort of answering broke the rhythm of his rocking\u2014for a momenthe was silent.",
        "Embedding": "[  8.172922 -11.01304    8.286623]"
    },
    "2107": {
        "#": "2107",
        "Sentence": "Then the same half-knowing, half-bewildered look cameback into his faded eyes.",
        "Embedding": "[ 35.584908  -17.324825    0.9791706]"
    },
    "2108": {
        "#": "2108",
        "Sentence": "\u201cLook in the drawer there,\u201d he said, pointing at the desk.",
        "Embedding": "[-19.009481 -29.682766  26.418009]"
    },
    "2109": {
        "#": "2109",
        "Sentence": "\u201cWhich drawer?\u201d\u201cThat drawer\u2014that one.\u201dMichaelis opened the drawer nearest his hand.",
        "Embedding": "[-17.541143 -31.377722  26.682243]"
    },
    "2110": {
        "#": "2110",
        "Sentence": "There was nothing in itbut a small, expensive dog-leash, made of leather and braidedsilver.",
        "Embedding": "[44.233746   1.1601804 26.567825 ]"
    },
    "2111": {
        "#": "2111",
        "Sentence": "It was apparently new.",
        "Embedding": "[-30.289917 -23.871414 -10.408139]"
    },
    "2112": {
        "#": "2112",
        "Sentence": "\u201cThis?\u201d he inquired, holding it up.",
        "Embedding": "[-27.478214   -24.153345     0.55667114]"
    },
    "2113": {
        "#": "2113",
        "Sentence": "Wilson stared and nodded.",
        "Embedding": "[-11.892802  24.964203  18.798502]"
    },
    "2114": {
        "#": "2114",
        "Sentence": "\u201cI found it yesterday afternoon.",
        "Embedding": "[-24.126513 -22.509878 -18.534422]"
    },
    "2115": {
        "#": "2115",
        "Sentence": "She tried to tell me about it, but Iknew it was something funny.\u201d\u201cYou mean your wife bought it?\u201d\u201cShe had it wrapped in tissue paper on her bureau.\u201dMichaelis didn\u2019t see anything odd in that, and he gave Wilson a dozenreasons why his wife might have bought the dog-leash.",
        "Embedding": "[-6.3828325 16.330044  10.764073 ]"
    },
    "2116": {
        "#": "2116",
        "Sentence": "But conceivablyWilson had heard some of these same explanations before, from Myrtle,because he began saying \u201cOh, my God!\u201d again in a whisper\u2014his comforterleft several explanations in the air.",
        "Embedding": "[ 14.07783  -14.01674    5.974116]"
    },
    "2117": {
        "#": "2117",
        "Sentence": "\u201cThen he killed her,\u201d said Wilson.",
        "Embedding": "[-15.36483   21.663536  15.982712]"
    },
    "2118": {
        "#": "2118",
        "Sentence": "His mouth dropped open suddenly.",
        "Embedding": "[-17.323484  -35.30195     2.1827385]"
    },
    "2119": {
        "#": "2119",
        "Sentence": "\u201cWho did?\u201d\u201cI have a way of finding out.\u201d\u201cYou\u2019re morbid, George,\u201d said his friend.",
        "Embedding": "[ -9.223319     0.10521059 -40.90543   ]"
    },
    "2120": {
        "#": "2120",
        "Sentence": "\u201cThis has been a strain toyou and you don\u2019t know what you\u2019re saying.",
        "Embedding": "[-14.60649    -4.5543084 -26.38755  ]"
    },
    "2121": {
        "#": "2121",
        "Sentence": "You\u2019d better try and sitquiet till morning.\u201d\u201cHe murdered her.\u201d\u201cIt was an accident, George.\u201dWilson shook his head.",
        "Embedding": "[  5.852949 -24.811132 -16.733322]"
    },
    "2122": {
        "#": "2122",
        "Sentence": "His eyes narrowed and his mouth widenedslightly with the ghost of a superior \u201cHm!\u201d\u201cI know,\u201d he said definitely.",
        "Embedding": "[ 31.515076  -16.450573   -4.0940385]"
    },
    "2123": {
        "#": "2123",
        "Sentence": "\u201cI\u2019m one of these trusting fellas and Idon\u2019t think any harm to nobody, but when I get to know a thing I knowit.",
        "Embedding": "[-10.14876    -1.5058773  -2.8940527]"
    },
    "2124": {
        "#": "2124",
        "Sentence": "It was the man in that car.",
        "Embedding": "[-29.823563  -24.512678   -3.9699981]"
    },
    "2125": {
        "#": "2125",
        "Sentence": "She ran out to speak to him and hewouldn\u2019t stop.\u201dMichaelis had seen this too, but it hadn\u2019t occurred to him that therewas any special significance in it.",
        "Embedding": "[ -2.5546   -20.33436   19.592913]"
    },
    "2126": {
        "#": "2126",
        "Sentence": "He believed that Mrs. Wilson hadbeen running away from her husband, rather than trying to stop anyparticular car.",
        "Embedding": "[-2.9809635 16.75559   14.619577 ]"
    },
    "2127": {
        "#": "2127",
        "Sentence": "\u201cHow could she of been like that?\u201d\u201cShe\u2019s a deep one,\u201d said Wilson, as if that answered the question.",
        "Embedding": "[-11.710298  20.635021  14.282933]"
    },
    "2128": {
        "#": "2128",
        "Sentence": "\u201cAh-h-h\u2014\u201dHe began to rock again, and Michaelis stood twisting the leash in hishand.",
        "Embedding": "[ 18.586494 -30.436438   9.444951]"
    },
    "2129": {
        "#": "2129",
        "Sentence": "\u201cMaybe you got some friend that I could telephone for, George?\u201dThis was a forlorn hope\u2014he was almost sure that Wilson had no friend:there was not enough of him for his wife.",
        "Embedding": "[-5.5502896 18.305983  10.0539   ]"
    },
    "2130": {
        "#": "2130",
        "Sentence": "He was glad a little laterwhen he noticed a change in the room, a blue quickening by the window,and realized that dawn wasn\u2019t far off.",
        "Embedding": "[ 19.229813  -17.890162   -1.1287749]"
    },
    "2131": {
        "#": "2131",
        "Sentence": "About five o\u2019clock it was blueenough outside to snap off the light.",
        "Embedding": "[ 41.10189   -8.680226 -11.92608 ]"
    },
    "2132": {
        "#": "2132",
        "Sentence": "Wilson\u2019s glazed eyes turned out to the ash-heaps, where small greyclouds took on fantastic shapes and scurried here and there in thefaint dawn wind.",
        "Embedding": "[26.587114 12.137615 11.064349]"
    },
    "2133": {
        "#": "2133",
        "Sentence": "\u201cI spoke to her,\u201d he muttered, after a long silence.",
        "Embedding": "[ -6.398397 -13.817585  15.912817]"
    },
    "2134": {
        "#": "2134",
        "Sentence": "\u201cI told her shemight fool me but she couldn\u2019t fool God.",
        "Embedding": "[-14.397188   -4.9427476  24.525455 ]"
    },
    "2135": {
        "#": "2135",
        "Sentence": "I took her to thewindow\u201d\u2014with an effort he got up and walked to the rear window andleaned with his face pressed against it\u2014\u201cand I said \u2018God knows whatyou\u2019ve been doing, everything you\u2019ve been doing.",
        "Embedding": "[ 7.386587  -1.9020721  5.0074334]"
    },
    "2136": {
        "#": "2136",
        "Sentence": "You may fool me, butyou can\u2019t fool God!\u2019\u200a\u201dStanding behind him, Michaelis saw with a shock that he was looking atthe eyes of Doctor T. J. Eckleburg, which had just emerged, pale andenormous, from the dissolving night.",
        "Embedding": "[ 35.919926    4.6224174 -15.088588 ]"
    },
    "2137": {
        "#": "2137",
        "Sentence": "\u201cGod sees everything,\u201d repeated Wilson.",
        "Embedding": "[-8.480574 24.584997 18.896326]"
    },
    "2138": {
        "#": "2138",
        "Sentence": "\u201cThat\u2019s an advertisement,\u201d Michaelis assured him.",
        "Embedding": "[-37.880215  -5.188378  10.791654]"
    },
    "2139": {
        "#": "2139",
        "Sentence": "Something made himturn away from the window and look back into the room.",
        "Embedding": "[ 38.739555 -12.13288   -5.368265]"
    },
    "2140": {
        "#": "2140",
        "Sentence": "But Wilsonstood there a long time, his face close to the window pane, noddinginto the twilight.",
        "Embedding": "[ 42.76129   -17.875132   -3.6850789]"
    },
    "2141": {
        "#": "2141",
        "Sentence": "By six o\u2019clock Michaelis was worn out, and grateful for the sound of acar stopping outside.",
        "Embedding": "[44.957466    1.0291377   0.25459138]"
    },
    "2142": {
        "#": "2142",
        "Sentence": "It was one of the watchers of the night beforewho had promised to come back, so he cooked breakfast for three, whichhe and the other man ate together.",
        "Embedding": "[44.360428  -2.8228166 -9.439968 ]"
    },
    "2143": {
        "#": "2143",
        "Sentence": "Wilson was quieter now, andMichaelis went home to sleep; when he awoke four hours later andhurried back to the garage, Wilson was gone.",
        "Embedding": "[ 8.1868105 18.928345  10.745952 ]"
    },
    "2144": {
        "#": "2144",
        "Sentence": "His movements\u2014he was on foot all the time\u2014were afterward traced toPort Roosevelt and then to Gad\u2019s Hill, where he bought a sandwich thathe didn\u2019t eat, and a cup of coffee.",
        "Embedding": "[17.482445    8.404459    0.10311911]"
    },
    "2145": {
        "#": "2145",
        "Sentence": "He must have been tired andwalking slowly, for he didn\u2019t reach Gad\u2019s Hill until noon.",
        "Embedding": "[ 18.509892  -13.357907   -3.2451022]"
    },
    "2146": {
        "#": "2146",
        "Sentence": "Thus farthere was no difficulty in accounting for his time\u2014there were boys whohad seen a man \u201cacting sort of crazy,\u201d and motorists at whom he staredoddly from the side of the road.",
        "Embedding": "[26.432901  -3.6403098 -5.384426 ]"
    },
    "2147": {
        "#": "2147",
        "Sentence": "Then for three hours he disappearedfrom view.",
        "Embedding": "[ -8.858006 -31.857388  10.051177]"
    },
    "2148": {
        "#": "2148",
        "Sentence": "The police, on the strength of what he said to Michaelis,that he \u201chad a way of finding out,\u201d supposed that he spent that timegoing from garage to garage thereabout, inquiring for a yellow car.",
        "Embedding": "[ 22.667162  -5.866117 -20.379372]"
    },
    "2149": {
        "#": "2149",
        "Sentence": "Onthe other hand, no garage man who had seen him ever came forward, andperhaps he had an easier, surer way of finding out what he wanted toknow.",
        "Embedding": "[ 23.243593  -5.51213  -17.680296]"
    },
    "2150": {
        "#": "2150",
        "Sentence": "By half-past two he was in West Egg, where he asked someone theway to Gatsby\u2019s house.",
        "Embedding": "[  5.2199373  20.363636  -24.566492 ]"
    },
    "2151": {
        "#": "2151",
        "Sentence": "So by that time he knew Gatsby\u2019s name.",
        "Embedding": "[ -8.191327 -24.54009  -21.73559 ]"
    },
    "2152": {
        "#": "2152",
        "Sentence": "At two o\u2019clock Gatsby put on his bathing-suit and left word with thebutler that if anyone phoned word was to be brought to him at thepool.",
        "Embedding": "[10.44868   28.65437   -2.9704955]"
    },
    "2153": {
        "#": "2153",
        "Sentence": "He stopped at the garage for a pneumatic mattress that hadamused his guests during the summer, and the chauffeur helped him topump it up.",
        "Embedding": "[ 21.872196 -11.079015 -19.584354]"
    },
    "2154": {
        "#": "2154",
        "Sentence": "Then he gave instructions that the open car wasn\u2019t to betaken out under any circumstances\u2014and this was strange, because thefront right fender needed repair.",
        "Embedding": "[ 23.214266   -3.4148679 -21.479542 ]"
    },
    "2155": {
        "#": "2155",
        "Sentence": "Gatsby shouldered the mattress and started for the pool.",
        "Embedding": "[-4.852619 45.736492 -5.344855]"
    },
    "2156": {
        "#": "2156",
        "Sentence": "Once hestopped and shifted it a little, and the chauffeur asked him if heneeded help, but he shook his head and in a moment disappeared amongthe yellowing trees.",
        "Embedding": "[24.550907 -8.037873 13.846155]"
    },
    "2157": {
        "#": "2157",
        "Sentence": "No telephone message arrived, but the butler went without his sleepand waited for it until four o\u2019clock\u2014until long after there was anyoneto give it to if it came.",
        "Embedding": "[  3.5344477  12.25615   -18.183662 ]"
    },
    "2158": {
        "#": "2158",
        "Sentence": "I have an idea that Gatsby himself didn\u2019tbelieve it would come, and perhaps he no longer cared.",
        "Embedding": "[ 3.661495  34.52206   -2.3370783]"
    },
    "2159": {
        "#": "2159",
        "Sentence": "If that wastrue he must have felt that he had lost the old warm world, paid ahigh price for living too long with a single dream.",
        "Embedding": "[ 24.519165  -11.470417   -8.2401705]"
    },
    "2160": {
        "#": "2160",
        "Sentence": "He must havelooked up at an unfamiliar sky through frightening leaves and shiveredas he found what a grotesque thing a rose is and how raw the sunlightwas upon the scarcely created grass.",
        "Embedding": "[23.559444 12.644562  8.986068]"
    },
    "2161": {
        "#": "2161",
        "Sentence": "A new world, material withoutbeing real, where poor ghosts, breathing dreams like air, driftedfortuitously about \u2026 like that ashen, fantastic figure gliding towardhim through the amorphous trees.",
        "Embedding": "[21.955578 10.063115 11.976488]"
    },
    "2162": {
        "#": "2162",
        "Sentence": "The chauffeur\u2014he was one of Wolfshiem\u2019s prot\u00e9g\u00e9s\u2014heard theshots\u2014afterwards he could only say that he hadn\u2019t thought anythingmuch about them.",
        "Embedding": "[  1.0779424 -17.818914   15.397154 ]"
    },
    "2163": {
        "#": "2163",
        "Sentence": "I drove from the station directly to Gatsby\u2019s houseand my rushing anxiously up the front steps was the first thing thatalarmed anyone.",
        "Embedding": "[ 17.571753 -27.664186   2.746792]"
    },
    "2164": {
        "#": "2164",
        "Sentence": "But they knew then, I firmly believe.",
        "Embedding": "[-30.39166  -38.71012    4.501614]"
    },
    "2165": {
        "#": "2165",
        "Sentence": "With scarcely aword said, four of us, the chauffeur, butler, gardener, and I hurrieddown to the pool.",
        "Embedding": "[ 16.387005  22.613396 -11.951491]"
    },
    "2166": {
        "#": "2166",
        "Sentence": "There was a faint, barely perceptible movement of the water as thefresh flow from one end urged its way toward the drain at the other.",
        "Embedding": "[42.540104  -2.3267791 13.886223 ]"
    },
    "2167": {
        "#": "2167",
        "Sentence": "With little ripples that were hardly the shadows of waves, the ladenmattress moved irregularly down the pool.",
        "Embedding": "[40.706066  -2.7748234 12.128259 ]"
    },
    "2168": {
        "#": "2168",
        "Sentence": "A small gust of wind thatscarcely corrugated the surface was enough to disturb its accidentalcourse with its accidental burden.",
        "Embedding": "[31.701557  -7.3290935  4.3120127]"
    },
    "2169": {
        "#": "2169",
        "Sentence": "The touch of a cluster of leavesrevolved it slowly, tracing, like the leg of transit, a thin redcircle in the water.",
        "Embedding": "[43.97171  -4.36323  15.263896]"
    },
    "2170": {
        "#": "2170",
        "Sentence": "It was after we started with Gatsby toward the house that the gardenersaw Wilson\u2019s body a little way off in the grass, and the holocaust wascomplete.",
        "Embedding": "[14.837264  31.648096  -1.5524487]"
    },
    "2171": {
        "#": "2171",
        "Sentence": "IXAfter two years I remember the rest of that day, and that night andthe next day, only as an endless drill of police and photographers andnewspaper men in and out of Gatsby\u2019s front door.",
        "Embedding": "[ 23.230837  28.868946 -18.043652]"
    },
    "2172": {
        "#": "2172",
        "Sentence": "A rope stretchedacross the main gate and a policeman by it kept out the curious, butlittle boys soon discovered that they could enter through my yard, andthere were always a few of them clustered open-mouthed about thepool.",
        "Embedding": "[ 29.315456  10.001199 -13.325584]"
    },
    "2173": {
        "#": "2173",
        "Sentence": "Someone with a positive manner, perhaps a detective, used theexpression \u201cmadman\u201d as he bent over Wilson\u2019s body that afternoon, andthe adventitious authority of his voice set the key for the newspaperreports next morning.",
        "Embedding": "[19.60208   -0.9435192  1.0188475]"
    },
    "2174": {
        "#": "2174",
        "Sentence": "Most of those reports were a nightmare\u2014grotesque, circumstantial,eager, and untrue.",
        "Embedding": "[ 10.266291 -32.106133 -24.2676  ]"
    },
    "2175": {
        "#": "2175",
        "Sentence": "When Michaelis\u2019s testimony at the inquest broughtto light Wilson\u2019s suspicions of his wife I thought the whole talewould shortly be served up in racy pasquinade\u2014but Catherine, who mighthave said anything, didn\u2019t say a word.",
        "Embedding": "[-5.259026 14.113858 11.231401]"
    },
    "2176": {
        "#": "2176",
        "Sentence": "She showed a surprising amountof character about it too\u2014looked at the coroner with determined eyesunder that corrected brow of hers, and swore that her sister had neverseen Gatsby, that her sister was completely happy with her husband,that her sister had been into no mischief whatever.",
        "Embedding": "[ 3.4400444 27.465227  12.871892 ]"
    },
    "2177": {
        "#": "2177",
        "Sentence": "She convincedherself of it, and cried into her handkerchief, as if the verysuggestion was more than she could endure.",
        "Embedding": "[ 11.47271  -14.196957  27.031542]"
    },
    "2178": {
        "#": "2178",
        "Sentence": "So Wilson was reduced to aman \u201cderanged by grief\u201d in order that the case might remain in itssimplest form.",
        "Embedding": "[-3.2696314 23.858006  16.80652  ]"
    },
    "2179": {
        "#": "2179",
        "Sentence": "And it rested there.",
        "Embedding": "[-29.132444 -31.693975   9.277498]"
    },
    "2180": {
        "#": "2180",
        "Sentence": "But all this part of it seemed remote and unessential.",
        "Embedding": "[-17.003012  -41.897476    7.7431483]"
    },
    "2181": {
        "#": "2181",
        "Sentence": "I found myselfon Gatsby\u2019s side, and alone.",
        "Embedding": "[-24.043236 -21.634481 -29.970173]"
    },
    "2182": {
        "#": "2182",
        "Sentence": "From the moment I telephoned news of thecatastrophe to West Egg village, every surmise about him, and everypractical question, was referred to me.",
        "Embedding": "[  6.24685   17.735418 -25.287716]"
    },
    "2183": {
        "#": "2183",
        "Sentence": "At first I was surprised andconfused; then, as he lay in his house and didn\u2019t move or breathe orspeak, hour upon hour, it grew upon me that I was responsible, becauseno one else was interested\u2014interested, I mean, with that intensepersonal interest to which everyone has some vague right at the end.",
        "Embedding": "[ 2.4551346 -5.0995526  3.8084776]"
    },
    "2184": {
        "#": "2184",
        "Sentence": "I called up Daisy half an hour after we found him, called herinstinctively and without hesitation.",
        "Embedding": "[-0.9006563 14.698895  31.210897 ]"
    },
    "2185": {
        "#": "2185",
        "Sentence": "But she and Tom had gone awayearly that afternoon, and taken baggage with them.",
        "Embedding": "[-12.480848 -13.766117  35.328007]"
    },
    "2186": {
        "#": "2186",
        "Sentence": "\u201cLeft no address?\u201d\u201cNo.\u201d\u201cSay when they\u2019d be back?\u201d\u201cNo.\u201d\u201cAny idea where they are?",
        "Embedding": "[-29.78545     1.6799765   5.6497645]"
    },
    "2187": {
        "#": "2187",
        "Sentence": "How I could reach them?\u201d\u201cI don\u2019t know.",
        "Embedding": "[-34.753613   7.29923  -12.1183  ]"
    },
    "2188": {
        "#": "2188",
        "Sentence": "Can\u2019t say.\u201dI wanted to get somebody for him.",
        "Embedding": "[ -7.9820747 -24.15453   -16.5576   ]"
    },
    "2189": {
        "#": "2189",
        "Sentence": "I wanted to go into the room wherehe lay and reassure him: \u201cI\u2019ll get somebody for you, Gatsby.",
        "Embedding": "[-2.1668272 26.04018   -2.9625208]"
    },
    "2190": {
        "#": "2190",
        "Sentence": "Don\u2019tworry.",
        "Embedding": "[-48.150005   -7.9859905 -17.51579  ]"
    },
    "2191": {
        "#": "2191",
        "Sentence": "Just trust me and I\u2019ll get somebody for you\u2014\u201dMeyer Wolfshiem\u2019s name wasn\u2019t in the phone book.",
        "Embedding": "[  5.4112835   6.603023  -20.065386 ]"
    },
    "2192": {
        "#": "2192",
        "Sentence": "The butler gave mehis office address on Broadway, and I called Information, but by thetime I had the number it was long after five, and no one answered thephone.",
        "Embedding": "[  0.88228405  11.720443   -18.993448  ]"
    },
    "2193": {
        "#": "2193",
        "Sentence": "\u201cWill you ring again?\u201d\u201cI\u2019ve rung three times.\u201d\u201cIt\u2019s very important.\u201d\u201cSorry.",
        "Embedding": "[-13.78886    6.893716 -33.667763]"
    },
    "2194": {
        "#": "2194",
        "Sentence": "I\u2019m afraid no one\u2019s there.\u201dI went back to the drawing-room and thought for an instant that theywere chance visitors, all these official people who suddenly filledit.",
        "Embedding": "[ 22.745512   -2.5238736 -11.864812 ]"
    },
    "2195": {
        "#": "2195",
        "Sentence": "But, though they drew back the sheet and looked at Gatsby withshocked eyes, his protest continued in my brain:\u201cLook here, old sport, you\u2019ve got to get somebody for me.",
        "Embedding": "[ -2.8284018  28.456577  -11.654847 ]"
    },
    "2196": {
        "#": "2196",
        "Sentence": "You\u2019ve gotto try hard.",
        "Embedding": "[-31.941334  -1.110363 -26.0201  ]"
    },
    "2197": {
        "#": "2197",
        "Sentence": "I can\u2019t go through this alone.\u201dSomeone started to ask me questions, but I broke away and goingupstairs looked hastily through the unlocked parts of his desk\u2014he\u2019dnever told me definitely that his parents were dead.",
        "Embedding": "[ 8.450965   -0.42892256 -6.8299475 ]"
    },
    "2198": {
        "#": "2198",
        "Sentence": "But there wasnothing\u2014only the picture of Dan Cody, a token of forgotten violence,staring down from the wall.",
        "Embedding": "[ 10.236732  20.853792 -37.41923 ]"
    },
    "2199": {
        "#": "2199",
        "Sentence": "Next morning I sent the butler to New York with a letter to Wolfshiem,which asked for information and urged him to come out on the nexttrain.",
        "Embedding": "[ -0.10511591  10.857985   -21.017294  ]"
    },
    "2200": {
        "#": "2200",
        "Sentence": "That request seemed superfluous when I wrote it.",
        "Embedding": "[ -5.6607943 -23.080685    4.506541 ]"
    },
    "2201": {
        "#": "2201",
        "Sentence": "I was surehe\u2019d start when he saw the newspapers, just as I was sure there\u2019d be awire from Daisy before noon\u2014but neither a wire nor Mr. Wolfshiemarrived; no one arrived except more police and photographers andnewspaper men.",
        "Embedding": "[ 21.64946   28.783861 -19.47116 ]"
    },
    "2202": {
        "#": "2202",
        "Sentence": "When the butler brought back Wolfshiem\u2019s answer I beganto have a feeling of defiance, of scornful solidarity between Gatsbyand me against them all.",
        "Embedding": "[ 31.069174  14.190499 -18.016851]"
    },
    "2203": {
        "#": "2203",
        "Sentence": "Dear Mr. Carraway.",
        "Embedding": "[-36.158127  17.487726 -14.032058]"
    },
    "2204": {
        "#": "2204",
        "Sentence": "This has been one of the most terrible shocks of my life to me I hardly can believe it that it is true at all.",
        "Embedding": "[ -4.802473  -12.780494   -2.9547803]"
    },
    "2205": {
        "#": "2205",
        "Sentence": "Such a mad act as that man did should make us all think.",
        "Embedding": "[ -4.9584694 -30.536896  -18.394083 ]"
    },
    "2206": {
        "#": "2206",
        "Sentence": "I cannot come down now as I am tied up in some very important business and cannot get mixed up in this thing now.",
        "Embedding": "[-4.5188084 -8.814205  -7.6394873]"
    },
    "2207": {
        "#": "2207",
        "Sentence": "If there is anything I can do a little later let me know in a letter by Edgar.",
        "Embedding": "[-19.318819    5.3683043  -8.167602 ]"
    },
    "2208": {
        "#": "2208",
        "Sentence": "I hardly know where I am when I hear about a thing like this and am completely knocked down and out.",
        "Embedding": "[ -4.741228 -12.767259  -5.696259]"
    },
    "2209": {
        "#": "2209",
        "Sentence": "Yours truly                             Meyer Wolfshiemand then hasty addenda beneath: Let me know about the funeral etc do not know his family at all.",
        "Embedding": "[-33.602955   8.635314   9.596376]"
    },
    "2210": {
        "#": "2210",
        "Sentence": "When the phone rang that afternoon and Long Distance said Chicago wascalling I thought this would be Daisy at last.",
        "Embedding": "[ 12.9308195  36.115234  -10.498489 ]"
    },
    "2211": {
        "#": "2211",
        "Sentence": "But the connection camethrough as a man\u2019s voice, very thin and far away.",
        "Embedding": "[-18.01037  -41.661137   4.708744]"
    },
    "2212": {
        "#": "2212",
        "Sentence": "\u201cThis is Slagle speaking \u2026\u201d\u201cYes?\u201d The name was unfamiliar.",
        "Embedding": "[-12.37119  -26.104797 -20.731926]"
    },
    "2213": {
        "#": "2213",
        "Sentence": "\u201cHell of a note, isn\u2019t it?",
        "Embedding": "[-37.414253  -14.116425   -0.5753522]"
    },
    "2214": {
        "#": "2214",
        "Sentence": "Get my wire?\u201d\u201cThere haven\u2019t been any wires.\u201d\u201cYoung Parke\u2019s in trouble,\u201d he said rapidly.",
        "Embedding": "[-18.598995  11.14292   -5.550186]"
    },
    "2215": {
        "#": "2215",
        "Sentence": "\u201cThey picked him up whenhe handed the bonds over the counter.",
        "Embedding": "[-16.631788 -28.756704   4.89934 ]"
    },
    "2216": {
        "#": "2216",
        "Sentence": "They got a circular from NewYork giving \u2019em the numbers just five minutes before.",
        "Embedding": "[-15.704127 -36.084347 -19.452166]"
    },
    "2217": {
        "#": "2217",
        "Sentence": "What d\u2019you knowabout that, hey?",
        "Embedding": "[-20.128551  -6.578254 -10.106303]"
    },
    "2218": {
        "#": "2218",
        "Sentence": "You never can tell in these hick towns\u2014\u201d\u201cHello!\u201d I interrupted breathlessly.",
        "Embedding": "[-10.834847  -5.792101 -19.447618]"
    },
    "2219": {
        "#": "2219",
        "Sentence": "\u201cLook here\u2014this isn\u2019t Mr.Gatsby.",
        "Embedding": "[-27.63692  -2.32332 -30.39853]"
    },
    "2220": {
        "#": "2220",
        "Sentence": "Mr. Gatsby\u2019s dead.\u201dThere was a long silence on the other end of the wire, followed by anexclamation \u2026 then a quick squawk as the connection was broken.",
        "Embedding": "[11.049632 23.56464   6.914842]"
    },
    "2221": {
        "#": "2221",
        "Sentence": "I think it was on the third day that a telegram signed Henry C. Gatzarrived from a town in Minnesota.",
        "Embedding": "[ 39.93818    -1.9055792 -13.007074 ]"
    },
    "2222": {
        "#": "2222",
        "Sentence": "It said only that the sender wasleaving immediately and to postpone the funeral until he came.",
        "Embedding": "[ 13.651337 -11.514653 -19.084143]"
    },
    "2223": {
        "#": "2223",
        "Sentence": "It was Gatsby\u2019s father, a solemn old man, very helpless and dismayed,bundled up in a long cheap ulster against the warm September day.",
        "Embedding": "[17.734108 24.117115  3.8013  ]"
    },
    "2224": {
        "#": "2224",
        "Sentence": "Hiseyes leaked continuously with excitement, and when I took the bag andumbrella from his hands he began to pull so incessantly at his sparsegrey beard that I had difficulty in getting off his coat.",
        "Embedding": "[16.102564    0.80241495 14.089652  ]"
    },
    "2225": {
        "#": "2225",
        "Sentence": "He was onthe point of collapse, so I took him into the music-room and made himsit down while I sent for something to eat.",
        "Embedding": "[ 7.9014363 -6.237239  -8.067193 ]"
    },
    "2226": {
        "#": "2226",
        "Sentence": "But he wouldn\u2019t eat, andthe glass of milk spilled from his trembling hand.",
        "Embedding": "[ 18.035803 -22.573727  24.702578]"
    },
    "2227": {
        "#": "2227",
        "Sentence": "\u201cI saw it in the Chicago newspaper,\u201d he said.",
        "Embedding": "[-37.13256   -30.87432    -1.6642553]"
    },
    "2228": {
        "#": "2228",
        "Sentence": "\u201cIt was all in theChicago newspaper.",
        "Embedding": "[-35.49679    -29.913002     0.43874624]"
    },
    "2229": {
        "#": "2229",
        "Sentence": "I started right away.\u201d\u201cI didn\u2019t know how to reach you.\u201dHis eyes, seeing nothing, moved ceaselessly about the room.",
        "Embedding": "[ 25.410923  -28.315435   -0.9218675]"
    },
    "2230": {
        "#": "2230",
        "Sentence": "\u201cIt was a madman,\u201d he said.",
        "Embedding": "[-26.028202  -20.650105   -1.3686243]"
    },
    "2231": {
        "#": "2231",
        "Sentence": "\u201cHe must have been mad.\u201d\u201cWouldn\u2019t you like some coffee?\u201d I urged him.",
        "Embedding": "[-15.636866  -20.448267   -3.8247797]"
    },
    "2232": {
        "#": "2232",
        "Sentence": "\u201cI don\u2019t want anything.",
        "Embedding": "[-42.878143    2.2158272  -9.305124 ]"
    },
    "2233": {
        "#": "2233",
        "Sentence": "I\u2019m all right now, Mr.\u2014\u201d\u201cCarraway.\u201d\u201cWell, I\u2019m all right now.",
        "Embedding": "[-34.635326    -0.60628057  -4.3826814 ]"
    },
    "2234": {
        "#": "2234",
        "Sentence": "Where have they got Jimmy?\u201dI took him into the drawing-room, where his son lay, and left himthere.",
        "Embedding": "[ 33.26941  -21.459387  18.63201 ]"
    },
    "2235": {
        "#": "2235",
        "Sentence": "Some little boys had come up on the steps and were looking into the hall; when I told them who had arrived, they went reluctantlyaway.",
        "Embedding": "[ 14.511896  -9.293063 -10.245539]"
    },
    "2236": {
        "#": "2236",
        "Sentence": "After a little while Mr. Gatz opened the door and came out, his mouthajar, his face flushed slightly, his eyes leaking isolated andunpunctual tears.",
        "Embedding": "[23.384295  -0.9735137 16.927582 ]"
    },
    "2237": {
        "#": "2237",
        "Sentence": "He had reached an age where death no longer has thequality of ghastly surprise, and when he looked around him now for thefirst time and saw the height and splendour of the hall and the greatrooms opening out from it into other rooms, his grief began to bemixed with an awed pride.",
        "Embedding": "[23.858318  -5.8342214 16.109287 ]"
    },
    "2238": {
        "#": "2238",
        "Sentence": "I helped him to a bedroom upstairs; while hetook off his coat and vest I told him that all arrangements had beendeferred until he came.",
        "Embedding": "[12.077141  -6.0035734 -7.412402 ]"
    },
    "2239": {
        "#": "2239",
        "Sentence": "\u201cI didn\u2019t know what you\u2019d want, Mr. Gatsby\u2014\u201d\u201cGatz is my name.\u201d\u201c\u2014Mr.",
        "Embedding": "[-15.519782   4.64231  -10.312658]"
    },
    "2240": {
        "#": "2240",
        "Sentence": "Gatz.",
        "Embedding": "[-48.746502 -13.368401 -18.072607]"
    },
    "2241": {
        "#": "2241",
        "Sentence": "I thought you might want to take the body West.\u201dHe shook his head.",
        "Embedding": "[  5.6332197 -27.777458  -16.40143  ]"
    },
    "2242": {
        "#": "2242",
        "Sentence": "\u201cJimmy always liked it better down East.",
        "Embedding": "[-20.207308  33.80264   -9.594479]"
    },
    "2243": {
        "#": "2243",
        "Sentence": "He rose up to his position inthe East.",
        "Embedding": "[-22.459455 -30.361557   4.644457]"
    },
    "2244": {
        "#": "2244",
        "Sentence": "Were you a friend of my boy\u2019s, Mr.\u2014?\u201d\u201cWe were close friends.\u201d\u201cHe had a big future before him, you know.",
        "Embedding": "[-12.451318  -5.68823   -9.153805]"
    },
    "2245": {
        "#": "2245",
        "Sentence": "He was only a young man,but he had a lot of brain power here.\u201dHe touched his head impressively, and I nodded.",
        "Embedding": "[  7.693106 -25.972635 -12.298344]"
    },
    "2246": {
        "#": "2246",
        "Sentence": "\u201cIf he\u2019d of lived, he\u2019d of been a great man.",
        "Embedding": "[ -5.22903  -27.258076 -19.349644]"
    },
    "2247": {
        "#": "2247",
        "Sentence": "A man like James J.Hill.",
        "Embedding": "[ -8.054432 -20.764507 -27.37502 ]"
    },
    "2248": {
        "#": "2248",
        "Sentence": "He\u2019d of helped build up the country.\u201d\u201cThat\u2019s true,\u201d I said, uncomfortably.",
        "Embedding": "[-10.335373 -20.495502   5.874564]"
    },
    "2249": {
        "#": "2249",
        "Sentence": "He fumbled at the embroidered coverlet, trying to take it from thebed, and lay down stiffly\u2014was instantly asleep.",
        "Embedding": "[ 18.609589 -24.445833  10.671569]"
    },
    "2250": {
        "#": "2250",
        "Sentence": "That night an obviously frightened person called up, and demanded toknow who I was before he would give his name.",
        "Embedding": "[ -7.8091893 -19.6449    -19.838804 ]"
    },
    "2251": {
        "#": "2251",
        "Sentence": "\u201cThis is Mr. Carraway,\u201d I said.",
        "Embedding": "[-33.931084  17.199547 -15.740972]"
    },
    "2252": {
        "#": "2252",
        "Sentence": "\u201cOh!\u201d He sounded relieved.",
        "Embedding": "[-32.087807  -8.733201  -5.410439]"
    },
    "2253": {
        "#": "2253",
        "Sentence": "\u201cThis is Klipspringer.\u201dI was relieved too, for that seemed to promise another friend atGatsby\u2019s grave.",
        "Embedding": "[-15.129979  -5.045188   3.656895]"
    },
    "2254": {
        "#": "2254",
        "Sentence": "I didn\u2019t want it to be in the papers and draw asightseeing crowd, so I\u2019d been calling up a few people myself.",
        "Embedding": "[  7.820142   8.057433 -21.370459]"
    },
    "2255": {
        "#": "2255",
        "Sentence": "Theywere hard to find.",
        "Embedding": "[-31.146425  -4.645464 -26.062683]"
    },
    "2256": {
        "#": "2256",
        "Sentence": "\u201cThe funeral\u2019s tomorrow,\u201d I said.",
        "Embedding": "[-34.045887    5.7130446  11.395981 ]"
    },
    "2257": {
        "#": "2257",
        "Sentence": "\u201cThree o\u2019clock, here at the house.",
        "Embedding": "[-27.917437 -23.113605 -22.65505 ]"
    },
    "2258": {
        "#": "2258",
        "Sentence": "I wish you\u2019d tell anybody who\u2019d be interested.\u201d\u201cOh, I will,\u201d he broke out hastily.",
        "Embedding": "[-21.632092    9.1920185  -8.169869 ]"
    },
    "2259": {
        "#": "2259",
        "Sentence": "\u201cOf course I\u2019m not likely to seeanybody, but if I do.\u201dHis tone made me suspicious.",
        "Embedding": "[-8.061198 -2.035113 -6.784092]"
    },
    "2260": {
        "#": "2260",
        "Sentence": "\u201cOf course you\u2019ll be there yourself.\u201d\u201cWell, I\u2019ll certainly try.",
        "Embedding": "[-35.02106     2.8710024  -4.4735703]"
    },
    "2261": {
        "#": "2261",
        "Sentence": "What I called up about is\u2014\u201d\u201cWait a minute,\u201d I interrupted.",
        "Embedding": "[ -3.5645773  -9.416393  -22.61103  ]"
    },
    "2262": {
        "#": "2262",
        "Sentence": "\u201cHow about saying you\u2019ll come?\u201d\u201cWell, the fact is\u2014the truth of the matter is that I\u2019m staying withsome people up here in Greenwich, and they rather expect me to be withthem tomorrow.",
        "Embedding": "[ -8.238903    1.0861745 -12.529785 ]"
    },
    "2263": {
        "#": "2263",
        "Sentence": "In fact, there\u2019s a sort of picnic or something.",
        "Embedding": "[-14.869193 -36.864246  -6.136331]"
    },
    "2264": {
        "#": "2264",
        "Sentence": "Ofcourse I\u2019ll do my best to get away.\u201dI ejaculated an unrestrained \u201cHuh!\u201d and he must have heard me, for hewent on nervously:\u201cWhat I called up about was a pair of shoes I left there.",
        "Embedding": "[  0.5790671   5.208655  -13.612648 ]"
    },
    "2265": {
        "#": "2265",
        "Sentence": "I wonder ifit\u2019d be too much trouble to have the butler send them on.",
        "Embedding": "[ -3.1257093   9.993372  -23.088505 ]"
    },
    "2266": {
        "#": "2266",
        "Sentence": "You see,they\u2019re tennis shoes, and I\u2019m sort of helpless without them.",
        "Embedding": "[ -0.7657417   6.7016754 -15.641313 ]"
    },
    "2267": {
        "#": "2267",
        "Sentence": "Myaddress is care of B. F.\u2014\u201dI didn\u2019t hear the rest of the name, because I hung up the receiver.",
        "Embedding": "[  1.7182128   9.742008  -10.339148 ]"
    },
    "2268": {
        "#": "2268",
        "Sentence": "After that I felt a certain shame for Gatsby\u2014one gentleman to whom Itelephoned implied that he had got what he deserved.",
        "Embedding": "[  7.044626  -12.469436   -3.3476574]"
    },
    "2269": {
        "#": "2269",
        "Sentence": "However, that wasmy fault, for he was one of those who used to sneer most bitterly atGatsby on the courage of Gatsby\u2019s liquor, and I should have knownbetter than to call him.",
        "Embedding": "[  5.5857015  39.789986  -10.004167 ]"
    },
    "2270": {
        "#": "2270",
        "Sentence": "The morning of the funeral I went up to New York to see MeyerWolfshiem; I couldn\u2019t seem to reach him any other way.",
        "Embedding": "[ 14.552518  -9.264526 -17.747385]"
    },
    "2271": {
        "#": "2271",
        "Sentence": "The door that Ipushed open, on the advice of an elevator boy, was marked \u201cTheSwastika Holding Company,\u201d and at first there didn\u2019t seem to be anyoneinside.",
        "Embedding": "[32.292416  -3.2995155 -6.9107804]"
    },
    "2272": {
        "#": "2272",
        "Sentence": "But when I\u2019d shouted \u201chello\u201d several times in vain, anargument broke out behind a partition, and presently a lovely Jewessappeared at an interior door and scrutinized me with black hostileeyes.",
        "Embedding": "[ 25.419252    5.4706216 -13.577435 ]"
    },
    "2273": {
        "#": "2273",
        "Sentence": "\u201cNobody\u2019s in,\u201d she said.",
        "Embedding": "[-26.59663   -16.185879    6.4889483]"
    },
    "2274": {
        "#": "2274",
        "Sentence": "\u201cMr.",
        "Embedding": "[-42.632507 -12.855596 -16.221254]"
    },
    "2275": {
        "#": "2275",
        "Sentence": "Wolfshiem\u2019s gone to Chicago.\u201dThe first part of this was obviously untrue, for someone had begun towhistle \u201cThe Rosary,\u201d tunelessly, inside.",
        "Embedding": "[-8.09138  -4.982083  5.62163 ]"
    },
    "2276": {
        "#": "2276",
        "Sentence": "\u201cPlease say that Mr. Carraway wants to see him.\u201d\u201cI can\u2019t get him back from Chicago, can I?\u201dAt this moment a voice, unmistakably Wolfshiem\u2019s, called \u201cStella!\u201dfrom the other side of the door.",
        "Embedding": "[  3.4221094  19.001535  -13.353887 ]"
    },
    "2277": {
        "#": "2277",
        "Sentence": "\u201cLeave your name on the desk,\u201d she said quickly.",
        "Embedding": "[-20.42425  -27.949488  26.150536]"
    },
    "2278": {
        "#": "2278",
        "Sentence": "\u201cI\u2019ll give it to himwhen he gets back.\u201d\u201cBut I know he\u2019s there.\u201dShe took a step toward me and began to slide her hands indignantly upand down her hips.",
        "Embedding": "[ 9.654998  -3.4913878  5.550577 ]"
    },
    "2279": {
        "#": "2279",
        "Sentence": "\u201cYou young men think you can force your way in here any time,\u201d shescolded.",
        "Embedding": "[-14.866547  13.662355 -29.495964]"
    },
    "2280": {
        "#": "2280",
        "Sentence": "\u201cWe\u2019re getting sickantired of it.",
        "Embedding": "[-35.32278  -24.939938 -16.906658]"
    },
    "2281": {
        "#": "2281",
        "Sentence": "When I say he\u2019s in Chicago,he\u2019s in Chicago.\u201dI mentioned Gatsby.",
        "Embedding": "[ 2.0532458 39.712284  -1.3444268]"
    },
    "2282": {
        "#": "2282",
        "Sentence": "\u201cOh-h!\u201d She looked at me over again.",
        "Embedding": "[-29.279781  -8.719011   9.01585 ]"
    },
    "2283": {
        "#": "2283",
        "Sentence": "\u201cWill you just\u2014What was yourname?\u201dShe vanished.",
        "Embedding": "[-19.077837    0.7526145 -13.880605 ]"
    },
    "2284": {
        "#": "2284",
        "Sentence": "In a moment Meyer Wolfshiem stood solemnly in thedoorway, holding out both hands.",
        "Embedding": "[  6.5173845 -39.48947     8.6349   ]"
    },
    "2285": {
        "#": "2285",
        "Sentence": "He drew me into his office, remarkingin a reverent voice that it was a sad time for all of us, and offeredme a cigar.",
        "Embedding": "[14.028159   -0.88668215  2.072388  ]"
    },
    "2286": {
        "#": "2286",
        "Sentence": "\u201cMy memory goes back to when first I met him,\u201d he said.",
        "Embedding": "[ -0.29732585 -12.825291   -34.75939   ]"
    },
    "2287": {
        "#": "2287",
        "Sentence": "\u201cA young majorjust out of the army and covered over with medals he got in the war.",
        "Embedding": "[ 19.155106 -31.032795 -26.916683]"
    },
    "2288": {
        "#": "2288",
        "Sentence": "He was so hard up he had to keep on wearing his uniform because hecouldn\u2019t buy some regular clothes.",
        "Embedding": "[ 18.516018 -12.907708 -10.621854]"
    },
    "2289": {
        "#": "2289",
        "Sentence": "First time I saw him was when hecame into Winebrenner\u2019s poolroom at Forty-third Street and asked for ajob.",
        "Embedding": "[ 10.316886   -18.07335     -0.20785986]"
    },
    "2290": {
        "#": "2290",
        "Sentence": "He hadn\u2019t eat anything for a couple of days.",
        "Embedding": "[-15.727955 -32.162704  -4.572697]"
    },
    "2291": {
        "#": "2291",
        "Sentence": "\u2018Come on have somelunch with me,\u2019 I said.",
        "Embedding": "[-26.152132    -0.08399199 -14.996144  ]"
    },
    "2292": {
        "#": "2292",
        "Sentence": "He ate more than four dollars\u2019 worth of foodin half an hour.\u201d\u201cDid you start him in business?\u201d I inquired.",
        "Embedding": "[ 24.22179  -20.768232 -21.381506]"
    },
    "2293": {
        "#": "2293",
        "Sentence": "\u201cStart him!",
        "Embedding": "[-37.508377   -7.9922967 -23.954376 ]"
    },
    "2294": {
        "#": "2294",
        "Sentence": "I made him.\u201d\u201cOh.\u201d\u201cI raised him up out of nothing, right out of the gutter.",
        "Embedding": "[-14.09722   -15.031736    1.9001169]"
    },
    "2295": {
        "#": "2295",
        "Sentence": "I saw rightaway he was a fine-appearing, gentlemanly young man, and when he toldme he was at Oggsford I knew I could use him good.",
        "Embedding": "[  8.58434   -14.528894   -1.9313961]"
    },
    "2296": {
        "#": "2296",
        "Sentence": "I got him to jointhe American Legion and he used to stand high there.",
        "Embedding": "[ 11.545533 -15.437528  -7.324923]"
    },
    "2297": {
        "#": "2297",
        "Sentence": "Right off he didsome work for a client of mine up to Albany.",
        "Embedding": "[  2.119068  32.44266  -24.993265]"
    },
    "2298": {
        "#": "2298",
        "Sentence": "We were so thick likethat in everything\u201d\u2014he held up two bulbous fingers\u2014\u201calways together.\u201dI wondered if this partnership had included the World\u2019s Seriestransaction in 1919.",
        "Embedding": "[16.280214  9.286436 16.963158]"
    },
    "2299": {
        "#": "2299",
        "Sentence": "\u201cNow he\u2019s dead,\u201d I said after a moment.",
        "Embedding": "[ -5.5780225 -38.5257    -16.245766 ]"
    },
    "2300": {
        "#": "2300",
        "Sentence": "\u201cYou were his closest friend,so I know you\u2019ll want to come to his funeral this afternoon.\u201d\u201cI\u2019d like to come.\u201d\u201cWell, come then.\u201dThe hair in his nostrils quivered slightly, and as he shook his headhis eyes filled with tears.",
        "Embedding": "[20.977497  -1.2821229 17.941608 ]"
    },
    "2301": {
        "#": "2301",
        "Sentence": "\u201cI can\u2019t do it\u2014I can\u2019t get mixed up in it,\u201d he said.",
        "Embedding": "[-17.310503  -19.085814    1.6257241]"
    },
    "2302": {
        "#": "2302",
        "Sentence": "\u201cThere\u2019s nothing to get mixed up in.",
        "Embedding": "[-28.219078  -4.246436 -30.789309]"
    },
    "2303": {
        "#": "2303",
        "Sentence": "It\u2019s all over now.\u201d\u201cWhen a man gets killed I never like to get mixed up in it in anyway.",
        "Embedding": "[ -4.085748 -10.918564  -9.90679 ]"
    },
    "2304": {
        "#": "2304",
        "Sentence": "I keep out.",
        "Embedding": "[-35.196186  -9.833655 -16.986324]"
    },
    "2305": {
        "#": "2305",
        "Sentence": "When I was a young man it was different\u2014if a friendof mine died, no matter how, I stuck with them to the end.",
        "Embedding": "[  2.7981927  -18.013988    -0.14687613]"
    },
    "2306": {
        "#": "2306",
        "Sentence": "You maythink that\u2019s sentimental, but I mean it\u2014to the bitter end.\u201dI saw that for some reason of his own he was determined not to come,so I stood up.",
        "Embedding": "[ 2.042106  -9.992641  -1.4460188]"
    },
    "2307": {
        "#": "2307",
        "Sentence": "\u201cAre you a college man?\u201d he inquired suddenly.",
        "Embedding": "[-13.247357 -10.887233 -11.988292]"
    },
    "2308": {
        "#": "2308",
        "Sentence": "For a moment I thought he was going to suggest a \u201cgonnegtion,\u201d but heonly nodded and shook my hand.",
        "Embedding": "[  6.8370976 -28.037172  -11.562771 ]"
    },
    "2309": {
        "#": "2309",
        "Sentence": "\u201cLet us learn to show our friendship for a man when he is alive andnot after he is dead,\u201d he suggested.",
        "Embedding": "[ -7.0243053 -40.805187  -15.002856 ]"
    },
    "2310": {
        "#": "2310",
        "Sentence": "\u201cAfter that my own rule is to leteverything alone.\u201dWhen I left his office the sky had turned dark and I got back to WestEgg in a drizzle.",
        "Embedding": "[10.300352  9.46572  -7.824091]"
    },
    "2311": {
        "#": "2311",
        "Sentence": "After changing my clothes I went next door and foundMr. Gatz walking up and down excitedly in the hall.",
        "Embedding": "[ 11.930162 -12.262498 -12.364814]"
    },
    "2312": {
        "#": "2312",
        "Sentence": "His pride in hisson and in his son\u2019s possessions was continually increasing and now he had something to show me.",
        "Embedding": "[20.083174    0.11115023 -5.835793  ]"
    },
    "2313": {
        "#": "2313",
        "Sentence": "\u201cJimmy sent me this picture.\u201d He took out his wallet with tremblingfingers.",
        "Embedding": "[-18.564045  30.270615 -10.578096]"
    },
    "2314": {
        "#": "2314",
        "Sentence": "\u201cLook there.\u201dIt was a photograph of the house, cracked in the corners and dirtywith many hands.",
        "Embedding": "[ 37.57819    9.679205 -20.488066]"
    },
    "2315": {
        "#": "2315",
        "Sentence": "He pointed out every detail to me eagerly.",
        "Embedding": "[ -9.6646385 -26.366497   -1.3048315]"
    },
    "2316": {
        "#": "2316",
        "Sentence": "\u201cLookthere!\u201d and then sought admiration from my eyes.",
        "Embedding": "[  1.4992267 -28.103569    1.4708654]"
    },
    "2317": {
        "#": "2317",
        "Sentence": "He had shown it sooften that I think it was more real to him now than the house itself.",
        "Embedding": "[ -9.832613 -33.677513  19.678679]"
    },
    "2318": {
        "#": "2318",
        "Sentence": "\u201cJimmy sent it to me.",
        "Embedding": "[-19.31253   32.10794  -10.973024]"
    },
    "2319": {
        "#": "2319",
        "Sentence": "I think it\u2019s a very pretty picture.",
        "Embedding": "[-37.959576 -20.90593    8.020308]"
    },
    "2320": {
        "#": "2320",
        "Sentence": "It shows upwell.\u201d\u201cVery well.",
        "Embedding": "[-34.283672  -22.866684    5.7347283]"
    },
    "2321": {
        "#": "2321",
        "Sentence": "Had you seen him lately?\u201d\u201cHe come out to see me two years ago and bought me the house I live innow.",
        "Embedding": "[  8.619177  -18.283623   -2.6721442]"
    },
    "2322": {
        "#": "2322",
        "Sentence": "Of course we was broke up when he run off from home, but I seenow there was a reason for it.",
        "Embedding": "[ 1.9800079 -8.814659  -5.01511  ]"
    },
    "2323": {
        "#": "2323",
        "Sentence": "He knew he had a big future in front ofhim.",
        "Embedding": "[-16.603167  -27.993256   -3.2953084]"
    },
    "2324": {
        "#": "2324",
        "Sentence": "And ever since he made a success he was very generous with me.\u201dHe seemed reluctant to put away the picture, held it for anotherminute, lingeringly, before my eyes.",
        "Embedding": "[ 22.735641   -13.049857     0.21462658]"
    },
    "2325": {
        "#": "2325",
        "Sentence": "Then he returned the wallet andpulled from his pocket a ragged old copy of a book called HopalongCassidy.",
        "Embedding": "[ 25.493036 -27.868982  19.269812]"
    },
    "2326": {
        "#": "2326",
        "Sentence": "\u201cLook here, this is a book he had when he was a boy.",
        "Embedding": "[-14.7375765  -4.493764   -7.2893863]"
    },
    "2327": {
        "#": "2327",
        "Sentence": "It just showsyou.\u201dHe opened it at the back cover and turned it around for me to see.",
        "Embedding": "[-30.35019  -14.803312 -22.82026 ]"
    },
    "2328": {
        "#": "2328",
        "Sentence": "Onthe last flyleaf was printed the word schedule, and the date September12, 1906.",
        "Embedding": "[43.10944   -2.2111235 -1.160649 ]"
    },
    "2329": {
        "#": "2329",
        "Sentence": "And underneath:    Rise from bed                                  6:00      a.m.    Dumbell exercise and wall-scaling              6:15-6:30 \u201d    Study electricity, etc.",
        "Embedding": "[34.909233 30.37775   3.750114]"
    },
    "2330": {
        "#": "2330",
        "Sentence": "7:15-8:15 \u201d    Work                                           8:30-4:30 p.m.",
        "Embedding": "[-10.415282 -11.168692 -28.541548]"
    },
    "2331": {
        "#": "2331",
        "Sentence": "Baseball and sports                            4:30-5:00 \u201d    Practise elocution, poise and how to attain it 5:00-6:00 \u201d    Study needed inventions                        7:00-9:00 \u201d               General Resolves  * No wasting time at Shafters or [a name, indecipherable]  * No more smokeing or chewing.",
        "Embedding": "[39.492893 12.880764 26.37918 ]"
    },
    "2332": {
        "#": "2332",
        "Sentence": "* Bath every other day  * Read one improving book or magazine per week  * Save $5.00 [crossed out] $3.00 per week  * Be better to parents\u201cI came across this book by accident,\u201d said the old man.",
        "Embedding": "[ 19.223694  28.124666 -23.832071]"
    },
    "2333": {
        "#": "2333",
        "Sentence": "\u201cIt justshows you, don\u2019t it?\u201d\u201cIt just shows you.\u201d\u201cJimmy was bound to get ahead.",
        "Embedding": "[-16.664854   8.397022 -23.328653]"
    },
    "2334": {
        "#": "2334",
        "Sentence": "He always had some resolves like thisor something.",
        "Embedding": "[-12.963435 -34.551323  -6.587097]"
    },
    "2335": {
        "#": "2335",
        "Sentence": "Do you notice what he\u2019s got about improving his mind?",
        "Embedding": "[ -8.681837 -22.997612 -10.830245]"
    },
    "2336": {
        "#": "2336",
        "Sentence": "Hewas always great for that.",
        "Embedding": "[-37.36445    -1.2588557   4.000825 ]"
    },
    "2337": {
        "#": "2337",
        "Sentence": "He told me I et like a hog once, and I beathim for it.\u201dHe was reluctant to close the book, reading each item aloud and thenlooking eagerly at me.",
        "Embedding": "[ 5.280558  -4.4080467 -7.772506 ]"
    },
    "2338": {
        "#": "2338",
        "Sentence": "I think he rather expected me to copy down thelist for my own use.",
        "Embedding": "[ -5.6793346 -21.29598     8.107551 ]"
    },
    "2339": {
        "#": "2339",
        "Sentence": "A little before three the Lutheran minister arrived from Flushing, andI began to look involuntarily out the windows for other cars.",
        "Embedding": "[28.774664   2.7955723 -4.888068 ]"
    },
    "2340": {
        "#": "2340",
        "Sentence": "So didGatsby\u2019s father.",
        "Embedding": "[-34.672173 -13.679606 -28.36576 ]"
    },
    "2341": {
        "#": "2341",
        "Sentence": "And as the time passed and the servants came in andstood waiting in the hall, his eyes began to blink anxiously, and hespoke of the rain in a worried, uncertain way.",
        "Embedding": "[25.575943 -3.329569 16.635635]"
    },
    "2342": {
        "#": "2342",
        "Sentence": "The minister glancedseveral times at his watch, so I took him aside and asked him to waitfor half an hour.",
        "Embedding": "[13.927878  -1.4015478 -8.590199 ]"
    },
    "2343": {
        "#": "2343",
        "Sentence": "But it wasn\u2019t any use.",
        "Embedding": "[-26.07243   -39.13174     2.4372652]"
    },
    "2344": {
        "#": "2344",
        "Sentence": "Nobody came.",
        "Embedding": "[-21.511772  -5.303952 -27.415346]"
    },
    "2345": {
        "#": "2345",
        "Sentence": "About five o\u2019clock our procession of three cars reached the cemeteryand stopped in a thick drizzle beside the gate\u2014first a motor hearse,horribly black and wet, then Mr. Gatz and the minister and me in thelimousine, and a little later four or five servants and the postmanfrom West Egg, in Gatsby\u2019s station wagon, all wet to the skin.",
        "Embedding": "[31.875626 22.20701   5.025483]"
    },
    "2346": {
        "#": "2346",
        "Sentence": "As westarted through the gate into the cemetery I heard a car stop and thenthe sound of someone splashing after us over the soggy ground.",
        "Embedding": "[31.954191 13.609773 -7.617848]"
    },
    "2347": {
        "#": "2347",
        "Sentence": "Ilooked around.",
        "Embedding": "[-37.0587   -11.587213 -21.645592]"
    },
    "2348": {
        "#": "2348",
        "Sentence": "It was the man with owl-eyed glasses whom I had foundmarvelling over Gatsby\u2019s books in the library one night three monthsbefore.",
        "Embedding": "[ 9.1890135 31.743612  15.969095 ]"
    },
    "2349": {
        "#": "2349",
        "Sentence": "I\u2019d never seen him since then.",
        "Embedding": "[-17.44763  -18.812569 -23.247131]"
    },
    "2350": {
        "#": "2350",
        "Sentence": "I don\u2019t know how he knew about thefuneral, or even his name.",
        "Embedding": "[ -9.007591 -21.733646 -22.129002]"
    },
    "2351": {
        "#": "2351",
        "Sentence": "The rain poured down his thick glasses, andhe took them off and wiped them to see the protecting canvas unrolledfrom Gatsby\u2019s grave.",
        "Embedding": "[ 33.201656 -15.961715  17.615208]"
    },
    "2352": {
        "#": "2352",
        "Sentence": "I tried to think about Gatsby then for a moment, but he was alreadytoo far away, and I could only remember, without resentment, thatDaisy hadn\u2019t sent a message or a flower.",
        "Embedding": "[ 6.0788474  33.288868   -0.29575986]"
    },
    "2353": {
        "#": "2353",
        "Sentence": "Dimly I heard someone murmur\u201cBlessed are the dead that the rain falls on,\u201d and then the owl-eyedman said \u201cAmen to that,\u201d in a brave voice.",
        "Embedding": "[40.1961    -7.3390503  3.576212 ]"
    },
    "2354": {
        "#": "2354",
        "Sentence": "We straggled down quickly through the rain to the cars.",
        "Embedding": "[ 41.375698   -11.920349    -0.04885636]"
    },
    "2355": {
        "#": "2355",
        "Sentence": "Owl-eyes spoketo me by the gate.",
        "Embedding": "[ -2.6464517 -19.032072  -34.03066  ]"
    },
    "2356": {
        "#": "2356",
        "Sentence": "\u201cI couldn\u2019t get to the house,\u201d he remarked.",
        "Embedding": "[-16.89312    -14.400023    -0.37090653]"
    },
    "2357": {
        "#": "2357",
        "Sentence": "\u201cNeither could anybody else.\u201d\u201cGo on!\u201d He started.",
        "Embedding": "[-15.575354 -24.190475 -27.122675]"
    },
    "2358": {
        "#": "2358",
        "Sentence": "\u201cWhy, my God!",
        "Embedding": "[-35.78799    2.303725 -16.815184]"
    },
    "2359": {
        "#": "2359",
        "Sentence": "they used to go there by thehundreds.\u201dHe took off his glasses and wiped them again, outside and in.",
        "Embedding": "[ 32.43242  -17.157932  18.9765  ]"
    },
    "2360": {
        "#": "2360",
        "Sentence": "\u201cThe poor son-of-a-bitch,\u201d he said.",
        "Embedding": "[-22.829105  -17.383299   -2.2521157]"
    },
    "2361": {
        "#": "2361",
        "Sentence": "One of my most vivid memories is of coming back West from prep schooland later from college at Christmas time.",
        "Embedding": "[ 26.71352   12.231432 -20.25342 ]"
    },
    "2362": {
        "#": "2362",
        "Sentence": "Those who went farther thanChicago would gather in the old dim Union Station at six o\u2019clock of aDecember evening, with a few Chicago friends, already caught up into their own holiday gaieties, to bid them a hasty goodbye.",
        "Embedding": "[29.954884  24.574497  -5.0946355]"
    },
    "2363": {
        "#": "2363",
        "Sentence": "I rememberthe fur coats of the girls returning from Miss This-or-That\u2019s and thechatter of frozen breath and the hands waving overhead as we caughtsight of old acquaintances, and the matchings of invitations: \u201cAre yougoing to the Ordways\u2019?",
        "Embedding": "[23.915237   -0.35031423 27.221354  ]"
    },
    "2364": {
        "#": "2364",
        "Sentence": "the Herseys\u2019?",
        "Embedding": "[-46.59178  -14.191668 -25.008999]"
    },
    "2365": {
        "#": "2365",
        "Sentence": "the Schultzes\u2019?\u201d and the longgreen tickets clasped tight in our gloved hands.",
        "Embedding": "[23.221708  -7.2085423 25.613888 ]"
    },
    "2366": {
        "#": "2366",
        "Sentence": "And last the murkyyellow cars of the Chicago, Milwaukee and St. Paul railroad lookingcheerful as Christmas itself on the tracks beside the gate.",
        "Embedding": "[30.186913 21.625671 -5.616425]"
    },
    "2367": {
        "#": "2367",
        "Sentence": "When we pulled out into the winter night and the real snow, our snow,began to stretch out beside us and twinkle against the windows, andthe dim lights of small Wisconsin stations moved by, a sharp wildbrace came suddenly into the air.",
        "Embedding": "[36.146282  12.416253  10.2557335]"
    },
    "2368": {
        "#": "2368",
        "Sentence": "We drew in deep breaths of it as wewalked back from dinner through the cold vestibules, unutterably awareof our identity with this country for one strange hour, before wemelted indistinguishably into it again.",
        "Embedding": "[14.503214 13.874186 18.999653]"
    },
    "2369": {
        "#": "2369",
        "Sentence": "That\u2019s my Middle West\u2014not the wheat or the prairies or the lost Swedetowns, but the thrilling returning trains of my youth, and the streetlamps and sleigh bells in the frosty dark and the shadows of hollywreaths thrown by lighted windows on the snow.",
        "Embedding": "[34.27372  13.883201 12.010393]"
    },
    "2370": {
        "#": "2370",
        "Sentence": "I am part of that, alittle solemn with the feel of those long winters, a little complacentfrom growing up in the Carraway house in a city where dwellings arestill called through decades by a family\u2019s name.",
        "Embedding": "[19.60451  18.27169  12.144566]"
    },
    "2371": {
        "#": "2371",
        "Sentence": "I see now that thishas been a story of the West, after all\u2014Tom and Gatsby, Daisy andJordan and I, were all Westerners, and perhaps we possessed somedeficiency in common which made us subtly unadaptable to Eastern life.",
        "Embedding": "[ 6.392549 30.97158   8.661242]"
    },
    "2372": {
        "#": "2372",
        "Sentence": "Even when the East excited me most, even when I was most keenly awareof its superiority to the bored, sprawling, swollen towns beyond theOhio, with their interminable inquisitions which spared only thechildren and the very old\u2014even then it had always for me a quality ofdistortion.",
        "Embedding": "[ 6.2745523 -4.8541527 14.281023 ]"
    },
    "2373": {
        "#": "2373",
        "Sentence": "West Egg, especially, still figures in my more fantasticdreams.",
        "Embedding": "[ -0.05155383  20.079412   -28.089859  ]"
    },
    "2374": {
        "#": "2374",
        "Sentence": "I see it as a night scene by El Greco: a hundred houses, atonce conventional and grotesque, crouching under a sullen, overhangingsky and a lustreless moon.",
        "Embedding": "[37.093513 13.232182 17.131458]"
    },
    "2375": {
        "#": "2375",
        "Sentence": "In the foreground four solemn men in dresssuits are walking along the sidewalk with a stretcher on which lies adrunken woman in a white evening dress.",
        "Embedding": "[19.662514 17.840607 30.04802 ]"
    },
    "2376": {
        "#": "2376",
        "Sentence": "Her hand, which dangles overthe side, sparkles cold with jewels.",
        "Embedding": "[49.703346 -7.075123  9.43669 ]"
    },
    "2377": {
        "#": "2377",
        "Sentence": "Gravely the men turn in at ahouse\u2014the wrong house.",
        "Embedding": "[ 16.043762 -23.232668 -21.34434 ]"
    },
    "2378": {
        "#": "2378",
        "Sentence": "But no one knows the woman\u2019s name, and no onecares.",
        "Embedding": "[-11.841446 -21.2357   -21.633707]"
    },
    "2379": {
        "#": "2379",
        "Sentence": "After Gatsby\u2019s death the East was haunted for me like that, distortedbeyond my eyes\u2019 power of correction.",
        "Embedding": "[ 33.208782 -18.507019  -9.964576]"
    },
    "2380": {
        "#": "2380",
        "Sentence": "So when the blue smoke of brittleleaves was in the air and the wind blew the wet laundry stiff on theline I decided to come back home.",
        "Embedding": "[19.47897  16.349514 -6.287313]"
    },
    "2381": {
        "#": "2381",
        "Sentence": "There was one thing to be done before I left, an awkward, unpleasantthing that perhaps had better have been let alone.",
        "Embedding": "[ -0.5417851 -15.113319  -12.53367  ]"
    },
    "2382": {
        "#": "2382",
        "Sentence": "But I wanted toleave things in order and not just trust that obliging and indifferentsea to sweep my refuse away.",
        "Embedding": "[ -1.664923 -33.620182  14.817087]"
    },
    "2383": {
        "#": "2383",
        "Sentence": "I saw Jordan Baker and talked over andaround what had happened to us together, and what had happenedafterward to me, and she lay perfectly still, listening, in a bigchair.",
        "Embedding": "[-0.25597274 10.432509    0.7621512 ]"
    },
    "2384": {
        "#": "2384",
        "Sentence": "She was dressed to play golf, and I remember thinking she looked likea good illustration, her chin raised a little jauntily, her hair thecolour of an autumn leaf, her face the same brown tint as thefingerless glove on her knee.",
        "Embedding": "[13.397301   3.3406317 22.969818 ]"
    },
    "2385": {
        "#": "2385",
        "Sentence": "When I had finished she told me withoutcomment that she was engaged to another man.",
        "Embedding": "[-17.233503   -2.2477076  26.138212 ]"
    },
    "2386": {
        "#": "2386",
        "Sentence": "I doubted that, thoughthere were several she could have married at a nod of her head, but Ipretended to be surprised.",
        "Embedding": "[-2.1290824   0.69960344 15.232153  ]"
    },
    "2387": {
        "#": "2387",
        "Sentence": "For just a minute I wondered if I wasn\u2019tmaking a mistake, then I thought it all over again quickly and got upto say goodbye.",
        "Embedding": "[-11.480048   -8.752718   -0.5563787]"
    },
    "2388": {
        "#": "2388",
        "Sentence": "\u201cNevertheless you did throw me over,\u201d said Jordan suddenly.",
        "Embedding": "[-5.9652543 13.352043  -4.6336207]"
    },
    "2389": {
        "#": "2389",
        "Sentence": "\u201cYou threwme over on the telephone.",
        "Embedding": "[-39.60578     4.8371277  18.492651 ]"
    },
    "2390": {
        "#": "2390",
        "Sentence": "I don\u2019t give a damn about you now, but it was a new experience for me, and I felt a little dizzy for a while.\u201dWe shook hands.",
        "Embedding": "[  9.740009 -30.872921 -12.277238]"
    },
    "2391": {
        "#": "2391",
        "Sentence": "\u201cOh, and do you remember\u201d\u2014she added\u2014\u201ca conversation we had once aboutdriving a car?\u201d\u201cWhy\u2014not exactly.\u201d\u201cYou said a bad driver was only safe until she met another bad driver?",
        "Embedding": "[  5.381337   -1.3865466 -27.495245 ]"
    },
    "2392": {
        "#": "2392",
        "Sentence": "Well, I met another bad driver, didn\u2019t I?",
        "Embedding": "[  6.6806     -2.6173081 -26.426687 ]"
    },
    "2393": {
        "#": "2393",
        "Sentence": "I mean it was careless of meto make such a wrong guess.",
        "Embedding": "[-12.167088   -9.555046    4.4309416]"
    },
    "2394": {
        "#": "2394",
        "Sentence": "I thought you were rather an honest,straightforward person.",
        "Embedding": "[-17.6328       0.42873663 -25.291231  ]"
    },
    "2395": {
        "#": "2395",
        "Sentence": "I thought it was your secret pride.\u201d\u201cI\u2019m thirty,\u201d I said.",
        "Embedding": "[-22.068085    7.0972524 -24.199842 ]"
    },
    "2396": {
        "#": "2396",
        "Sentence": "\u201cI\u2019m five years too old to lie to myself andcall it honour.\u201dShe didn\u2019t answer.",
        "Embedding": "[-24.792505   7.536323 -29.812613]"
    },
    "2397": {
        "#": "2397",
        "Sentence": "Angry, and half in love with her, and tremendouslysorry, I turned away.",
        "Embedding": "[-20.792158   -5.0874944  20.202814 ]"
    },
    "2398": {
        "#": "2398",
        "Sentence": "One afternoon late in October I saw Tom Buchanan.",
        "Embedding": "[-21.451548  30.449575   5.820232]"
    },
    "2399": {
        "#": "2399",
        "Sentence": "He was walking aheadof me along Fifth Avenue in his alert, aggressive way, his hands out alittle from his body as if to fight off interference, his head movingsharply here and there, adapting itself to his restless eyes.",
        "Embedding": "[ 19.693169 -12.455243  18.749632]"
    },
    "2400": {
        "#": "2400",
        "Sentence": "Just asI slowed up to avoid overtaking him he stopped and began frowning into the windows of a jewellery store.",
        "Embedding": "[26.667393  -3.4140036  5.4072895]"
    },
    "2401": {
        "#": "2401",
        "Sentence": "Suddenly he saw me and walked back,holding out his hand.",
        "Embedding": "[  4.2895126 -32.14299    -2.5894914]"
    },
    "2402": {
        "#": "2402",
        "Sentence": "\u201cWhat\u2019s the matter, Nick?",
        "Embedding": "[-26.17082   14.443919  12.420182]"
    },
    "2403": {
        "#": "2403",
        "Sentence": "Do you object to shaking hands with me?\u201d\u201cYes.",
        "Embedding": "[  7.704886 -36.16633  -14.049436]"
    },
    "2404": {
        "#": "2404",
        "Sentence": "You know what I think of you.\u201d\u201cYou\u2019re crazy, Nick,\u201d he said quickly.",
        "Embedding": "[-21.959005  14.705186  12.225501]"
    },
    "2405": {
        "#": "2405",
        "Sentence": "\u201cCrazy as hell.",
        "Embedding": "[-41.793606    0.7909729 -16.666702 ]"
    },
    "2406": {
        "#": "2406",
        "Sentence": "I don\u2019t knowwhat\u2019s the matter with you.\u201d\u201cTom,\u201d I inquired, \u201cwhat did you say to Wilson that afternoon?\u201dHe stared at me without a word, and I knew I had guessed right aboutthose missing hours.",
        "Embedding": "[ 3.6837294  4.663265  -6.065453 ]"
    },
    "2407": {
        "#": "2407",
        "Sentence": "I started to turn away, but he took a step afterme and grabbed my arm.",
        "Embedding": "[  6.642173  -32.388557   -1.1797945]"
    },
    "2408": {
        "#": "2408",
        "Sentence": "\u201cI told him the truth,\u201d he said.",
        "Embedding": "[-26.462852  -13.9027815  -1.3252223]"
    },
    "2409": {
        "#": "2409",
        "Sentence": "\u201cHe came to the door while we weregetting ready to leave, and when I sent down word that we weren\u2019t inhe tried to force his way upstairs.",
        "Embedding": "[10.034694 -8.066153 -8.101416]"
    },
    "2410": {
        "#": "2410",
        "Sentence": "He was crazy enough to kill me ifI hadn\u2019t told him who owned the car.",
        "Embedding": "[ -1.9998977 -10.316997  -15.55598  ]"
    },
    "2411": {
        "#": "2411",
        "Sentence": "His hand was on a revolver in hispocket every minute he was in the house\u2014\u201d He broke off defiantly.",
        "Embedding": "[ -8.24134  -36.36683   21.175503]"
    },
    "2412": {
        "#": "2412",
        "Sentence": "\u201cWhat if I did tell him?",
        "Embedding": "[-26.663065  -9.430223  -0.540761]"
    },
    "2413": {
        "#": "2413",
        "Sentence": "That fellow had it coming to him.",
        "Embedding": "[-30.764736  -22.525091   -0.6465816]"
    },
    "2414": {
        "#": "2414",
        "Sentence": "He threwdust into your eyes just like he did in Daisy\u2019s, but he was a toughone.",
        "Embedding": "[-10.759346    4.3283615  30.616238 ]"
    },
    "2415": {
        "#": "2415",
        "Sentence": "He ran over Myrtle like you\u2019d run over a dog and never evenstopped his car.\u201dThere was nothing I could say, except the one unutterable fact that it wasn\u2019t true.",
        "Embedding": "[  6.8729186  -1.2078989 -34.600903 ]"
    },
    "2416": {
        "#": "2416",
        "Sentence": "\u201cAnd if you think I didn\u2019t have my share of suffering\u2014look here, whenI went to give up that flat and saw that damn box of dog biscuitssitting there on the sideboard, I sat down and cried like a baby.",
        "Embedding": "[  1.3170527 -31.763227   16.878654 ]"
    },
    "2417": {
        "#": "2417",
        "Sentence": "ByGod it was awful\u2014\u201dI couldn\u2019t forgive him or like him, but I saw that what he had donewas, to him, entirely justified.",
        "Embedding": "[-3.1129677 -5.924243  -2.7248635]"
    },
    "2418": {
        "#": "2418",
        "Sentence": "It was all very careless andconfused.",
        "Embedding": "[-32.418877 -28.86254    2.080719]"
    },
    "2419": {
        "#": "2419",
        "Sentence": "They were careless people, Tom and Daisy\u2014they smashed upthings and creatures and then retreated back into their money or theirvast carelessness, or whatever it was that kept them together, and letother people clean up the mess they had made \u2026I shook hands with him; it seemed silly not to, for I felt suddenly asthough I were talking to a child.",
        "Embedding": "[ 25.725069 -10.908379  14.247168]"
    },
    "2420": {
        "#": "2420",
        "Sentence": "Then he went into the jewellerystore to buy a pearl necklace\u2014or perhaps only a pair of cuffbuttons\u2014rid of my provincial squeamishness forever.",
        "Embedding": "[  5.1924343 -27.330551   13.188538 ]"
    },
    "2421": {
        "#": "2421",
        "Sentence": "Gatsby\u2019s house was still empty when I left\u2014the grass on his lawn hadgrown as long as mine.",
        "Embedding": "[ 11.768556  25.130606 -15.613686]"
    },
    "2422": {
        "#": "2422",
        "Sentence": "One of the taxi drivers in the village nevertook a fare past the entrance gate without stopping for a minute andpointing inside; perhaps it was he who drove Daisy and Gatsby over toEast Egg the night of the accident, and perhaps he had made a storyabout it all his own.",
        "Embedding": "[14.956058 25.616816 -6.962974]"
    },
    "2423": {
        "#": "2423",
        "Sentence": "I didn\u2019t want to hear it and I avoided him whenI got off the train.",
        "Embedding": "[  3.4151618 -13.905991  -21.683403 ]"
    },
    "2424": {
        "#": "2424",
        "Sentence": "I spent my Saturday nights in New York because those gleaming,dazzling parties of his were with me so vividly that I could stillhear the music and the laughter, faint and incessant, from his garden,and the cars going up and down his drive.",
        "Embedding": "[ 13.310134   -2.8246613 -14.760747 ]"
    },
    "2425": {
        "#": "2425",
        "Sentence": "One night I did hear amaterial car there, and saw its lights stop at his front steps.",
        "Embedding": "[ 16.79681    -1.8234186 -14.770138 ]"
    },
    "2426": {
        "#": "2426",
        "Sentence": "But Ididn\u2019t investigate.",
        "Embedding": "[-29.952238  -39.099937   -4.9241815]"
    },
    "2427": {
        "#": "2427",
        "Sentence": "Probably it was some final guest who had been awayat the ends of the earth and didn\u2019t know that the party was over.",
        "Embedding": "[ -2.197485    1.5202436 -20.1454   ]"
    },
    "2428": {
        "#": "2428",
        "Sentence": "On the last night, with my trunk packed and my car sold to the grocer,I went over and looked at that huge incoherent failure of a house oncemore.",
        "Embedding": "[ 15.037441    -0.98564726 -20.264349  ]"
    },
    "2429": {
        "#": "2429",
        "Sentence": "On the white steps an obscene word, scrawled by some boy with apiece of brick, stood out clearly in the moonlight, and I erased it,drawing my shoe raspingly along the stone.",
        "Embedding": "[18.119852 19.815502 33.82261 ]"
    },
    "2430": {
        "#": "2430",
        "Sentence": "Then I wandered down to thebeach and sprawled out on the sand.",
        "Embedding": "[  0.82864636 -40.196873    -1.4063019 ]"
    },
    "2431": {
        "#": "2431",
        "Sentence": "Most of the big shore places were closed now and there were hardly anylights except the shadowy, moving glow of a ferryboat across theSound.",
        "Embedding": "[43.06069   -1.0004588 11.190972 ]"
    },
    "2432": {
        "#": "2432",
        "Sentence": "And as the moon rose higher the inessential houses began tomelt away until gradually I became aware of the old island here thatflowered once for Dutch sailors\u2019 eyes\u2014a fresh, green breast of the newworld.",
        "Embedding": "[39.6081    18.166536  12.4175825]"
    },
    "2433": {
        "#": "2433",
        "Sentence": "Its vanished trees, the trees that had made way for Gatsby\u2019shouse, had once pandered in whispers to the last and greatest of allhuman dreams; for a transitory enchanted moment man must have held hisbreath in the presence of this continent, compelled into an aestheticcontemplation he neither understood nor desired, face to face for thelast time in history with something commensurate to his capacity forwonder.",
        "Embedding": "[20.645    11.281325  9.876119]"
    },
    "2434": {
        "#": "2434",
        "Sentence": "And as I sat there brooding on the old, unknown world, I thought ofGatsby\u2019s wonder when he first picked out the green light at the end ofDaisy\u2019s dock.",
        "Embedding": "[ 25.51773  -29.277557 -18.530869]"
    },
    "2435": {
        "#": "2435",
        "Sentence": "He had come a long way to this blue lawn, and his dream must have seemed so close that he could hardly fail to grasp it.",
        "Embedding": "[ 19.10282   -16.455442   -2.7611814]"
    },
    "2436": {
        "#": "2436",
        "Sentence": "He did not know that it was already behind him, somewhere back in that tvast obscurity beyond the city, where the dark fields of the republicrolled on under the night.",
        "Embedding": "[ 30.846191     0.08668758 -13.381778  ]"
    },
    "2437": {
        "#": "2437",
        "Sentence": "Gatsby believed in the green light, the orgastic future that year by year recedes before us.",
        "Embedding": "[-13.087253    39.86215      0.48185858]"
    },
    "2438": {
        "#": "2438",
        "Sentence": "It eluded us then, but that\u2019s no matter\u2014tomorrow we will run faster, stretch out our arms further \u2026 Andone fine morning\u2014So we beat on, boats against the current, borne back ceaselessly into the past.",
        "Embedding": "[26.71311   12.170975  -7.7584033]"
    }
};
      const embeddingJson = await response.json();
      for (const key in embeddingJson) {
        if (Object.hasOwnProperty.call(embeddingJson, key)) {
          const item = embeddingJson[key];
          for (const property in item) {
            if (Object.hasOwnProperty.call(item, property)) {
              if (property === "Embedding") {
                const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
                const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
                const cube = new THREE.Mesh(geometry, material);
                const embeddingNumbers = item[property].match(/-?\d+\.?\d*/g).map(Number);
                cube.position.set(embeddingNumbers[0], embeddingNumbers[1], embeddingNumbers[2]);
                cubes.push(cube); // Add each cube to the array
                scene.add(cube);
                embeddingLookup[[embeddingNumbers[0], embeddingNumbers[1], embeddingNumbers[2]]] = item["Sentence"]
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching JSON:', error);
    }
  }

  fetchData();

  // Set up camera and controls
  camera.position.z = 100;
  const controls = new PointerLockControls(camera, document.body);

  // Enable pointer lock and add event listeners for mouse movement
  document.addEventListener('click', () => {
    controls.lock();
  });

  document.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      // Adjust the camera rotation based on mouse movement
      camera.rotation.y += deltaMove.x * 0.002;
      camera.rotation.x += deltaMove.y * 0.002;

      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    }
  });

  document.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  });

  document.addEventListener('mouseup', () => {
    isMouseDown = false;
  });

  // Create a red crosshair
  const crosshairGeometry = new THREE.BoxGeometry(0.02, 0.2, 0.02);
  const crosshairMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
  const crosshairVert = new THREE.Mesh(crosshairGeometry, crosshairMaterial);
  crosshairVert.position.z = -5; // Adjust the position to be in front of the camera
  const crosshairHor = new THREE.Mesh(crosshairGeometry, crosshairMaterial);
  crosshairHor.position.z = -5; // Adjust the position to be in front of the camera
  crosshairHor.rotateZ(1.5708);
  camera.add(crosshairHor);
  camera.add(crosshairVert);

  scene.add(camera); // Add the camera to the scene

  function onKeyDown(event) {
    switch (event.code) {
      case 'ArrowUp':
        moveForward = true;
        break;
      case 'ArrowDown':
        moveBackward = true;
        break;
      case 'ArrowLeft':
        moveLeft = true;
        break;
      case 'ArrowRight':
        moveRight = true;
        break;
    }
  }

  function onKeyUp(event) {
    switch (event.code) {
      case 'ArrowUp':
        moveForward = false;
        break;
      case 'ArrowDown':
        moveBackward = false;
        break;
      case 'ArrowLeft':
        moveLeft = false;
        break;
      case 'ArrowRight':
        moveRight = false;
        break;
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    // Handle arrow key movement based on camera rotation
    const speed = 0.5;
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    if (moveForward) camera.position.add(direction.multiplyScalar(speed));
    if (moveBackward) camera.position.add(direction.multiplyScalar(-speed));
    if (moveLeft) camera.position.add(direction.clone().cross(new THREE.Vector3(0, 1, 0)).multiplyScalar(-speed));
    if (moveRight) camera.position.add(direction.clone().cross(new THREE.Vector3(0, 1, 0)).multiplyScalar(speed));

    // Update raycaster and check for intersections
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cubes);

    // reset the color/text
    for (const cube of cubes) {
      cube.material.color.set(0xFFFFFF);
      modalContent.innerHTML = '<h2>The Latent Library: <i>The Great Gatsby</i></h2><body>Each cube in the constellation represents a sentence in <i>The Great Gatsby</i> by F. Scott Fitzgerald. They are arranged by their latent embedding (reduced to three dimensions by SKLearn&apos;s TSNE algorithm) in the Google Universal Sentence Encoder. In effect, this means similar sentences are near each other. Use the arrow keys to move and the mouse to change the camera angle. Sentences in the crosshairs will be displayed here. Built by <a href="https://willallstetter.com">Will Allstetter</a>.</body>';

    }
    // Change color of intersected cubes to red
    if(intersects != []){
      for (const intersectedObject of intersects) {
        intersectedObject.object.material.color.set(0xFF0000);
        modalContent.innerHTML = embeddingLookup[[intersectedObject.object.position.x,intersectedObject.object.position.y,intersectedObject.object.position.z]]
      }
    } 

    /*for (const cube of cubes) {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }*/

    renderer.render(scene, camera);
  }

  animate();
}
