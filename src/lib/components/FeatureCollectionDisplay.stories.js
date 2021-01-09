import React, { useState, useRef, useEffect, useCallback } from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { RoutedMap, MappingConstants, FeatureCollectionDisplayWithTooltipLabels } from '../index';
import EditControl from './editcontrols/NewPolygonControl';
import 'leaflet-editable';
import 'leaflet.path.drag';
import '@fortawesome/fontawesome-free/js/all.js';
import L from 'leaflet';
const uwz = [
	{
		type: 'Feature',
		id: 1,
		properties: {},
		geometry: {
			type: 'Polygon',
			coordinates: [
				[
					[ 366747.128729786607437, 5678233.382666619494557 ],
					[ 366773.931335046887398, 5678191.206285187974572 ],
					[ 366797.260648019728251, 5678144.345115869306028 ],
					[ 366780.17984526604414, 5678113.411931809037924 ],
					[ 366775.953094884753227, 5678048.739744569174945 ],
					[ 366765.575523648352828, 5678027.021969672292471 ],
					[ 366483.934390610607807, 5677869.309240938164294 ],
					[ 366573.895355216227472, 5677748.594678484834731 ],
					[ 366596.675419057835825, 5677725.52128538209945 ],
					[ 366670.755362312775105, 5677600.48864340595901 ],
					[ 366708.08729631791357, 5677510.61719215195626 ],
					[ 366680.443095683585852, 5677453.228821038268507 ],
					[ 366619.418500161962584, 5677430.418352090753615 ],
					[ 366510.542734036862385, 5677513.949157838709652 ],
					[ 366253.688921657681931, 5677227.117142651230097 ],
					[ 366198.76917854801286, 5677121.815835441462696 ],
					[ 366138.861654885869939, 5677087.887886168435216 ],
					[ 366037.870826024794951, 5677093.594602427445352 ],
					[ 365999.494139425456524, 5677122.048430569469929 ],
					[ 365952.281960252439603, 5677089.182573706842959 ],
					[ 365903.721295054536313, 5677100.655499932356179 ],
					[ 365675.516341558017302, 5677089.419800341129303 ],
					[ 365639.975274836877361, 5677109.850519390776753 ],
					[ 365563.027777774026617, 5677007.035199741832912 ],
					[ 365617.602976901456714, 5676639.472960770130157 ],
					[ 365557.185445209732279, 5676592.913305948488414 ],
					[ 365533.278174763196148, 5676627.102849945425987 ],
					[ 365471.7671152438852, 5676631.197899606078863 ],
					[ 365420.441440843977034, 5676729.770444921217859 ],
					[ 365361.959351406083442, 5676730.579355280846357 ],
					[ 365306.377052329888102, 5676724.943699004128575 ],
					[ 365231.365457963198423, 5676746.989155465736985 ],
					[ 365196.791248500172514, 5676713.608377936296165 ],
					[ 365149.844189267256297, 5676687.059747558087111 ],
					[ 365119.137040878995322, 5676670.918107563629746 ],
					[ 364998.29756040382199, 5676732.796276478096843 ],
					[ 364944.898053175304085, 5676850.957189932465553 ],
					[ 364857.114828078134451, 5677071.493467803113163 ],
					[ 364922.569982773158699, 5677108.37509904615581 ],
					[ 364905.024785904446617, 5677177.500419598072767 ],
					[ 365077.454906224447768, 5677230.761067968793213 ],
					[ 365227.952823426574469, 5677322.028123232536018 ],
					[ 365227.721600815653801, 5677347.3430140838027 ],
					[ 365308.323803045204841, 5677389.078487223945558 ],
					[ 365309.414458137413021, 5677457.871520903892815 ],
					[ 365419.84454585344065, 5677497.635794825851917 ],
					[ 365450.996437487308867, 5677478.173064982518554 ],
					[ 365828.925983312656172, 5677747.414005083963275 ],
					[ 365964.397900193813257, 5677811.468452108092606 ],
					[ 366048.278407789999619, 5677890.282928015105426 ],
					[ 366072.576482922188006, 5677943.06366481538862 ],
					[ 366033.781450428301468, 5678000.005068022757769 ],
					[ 366404.977158261637669, 5678220.486840351484716 ],
					[ 366543.026645908888895, 5678270.197681149467826 ],
					[ 366747.128729786607437, 5678233.382666619494557 ]
				]
			]
		},
		crs: {
			type: 'name',
			properties: {
				name: 'urn:ogc:def:crs:EPSG::25832'
			}
		}
	},
	{
		type: 'Feature',
		id: 2,
		properties: {},
		geometry: {
			type: 'Polygon',
			coordinates: [
				[
					[ 372654.775271910708398, 5683014.238344241864979 ],
					[ 372640.991925686015747, 5682968.804473297670484 ],
					[ 372606.900336473598145, 5682885.017834117636085 ],
					[ 372743.582502212258987, 5682811.289238243363798 ],
					[ 372839.079618472838774, 5682938.565082512795925 ],
					[ 372907.489637394086458, 5682903.402268153615296 ],
					[ 373106.030267251073383, 5683034.778704101219773 ],
					[ 373154.301190742815379, 5682970.814617954194546 ],
					[ 373130.188594551291317, 5682933.487236077897251 ],
					[ 373133.681741794105619, 5682810.685222552157938 ],
					[ 373175.743303971074056, 5682756.154867755249143 ],
					[ 373168.274899633252062, 5682698.537858539260924 ],
					[ 373129.157454864587635, 5682691.788703655824065 ],
					[ 373080.285402716486715, 5682671.468462707474828 ],
					[ 373021.130503465421498, 5682558.040575687773526 ],
					[ 372975.955675587814767, 5682578.114299497567117 ],
					[ 372882.186787192244083, 5682584.67011443618685 ],
					[ 372802.882824637054, 5682578.369307649321854 ],
					[ 372445.01782838877989, 5682467.440175577066839 ],
					[ 372398.685163850372192, 5682542.588458097539842 ],
					[ 372252.27298473729752, 5682461.691953250207007 ],
					[ 372045.703701616090257, 5682284.449490539729595 ],
					[ 371812.409268364135642, 5682120.222817690111697 ],
					[ 371611.774924612662289, 5681963.173878658562899 ],
					[ 371752.379523079493083, 5681860.323441901244223 ],
					[ 371988.646439038799144, 5681930.731500271707773 ],
					[ 372061.732048396894243, 5681801.676281386055052 ],
					[ 372229.802143020264339, 5681912.351862089708447 ],
					[ 372507.439828286762349, 5682202.536065142601728 ],
					[ 372845.006350010866299, 5682417.021276955492795 ],
					[ 372869.615268271765672, 5682367.15754436980933 ],
					[ 372964.29029730783077, 5682259.676841237582266 ],
					[ 373066.78327143297065, 5682333.174953624606133 ],
					[ 373177.990328544401564, 5682353.164445995353162 ],
					[ 373188.731917401542887, 5682315.928190125152469 ],
					[ 373205.463104689260945, 5682276.644958150573075 ],
					[ 373256.031468411849346, 5682228.680212562903762 ],
					[ 373429.702284688828513, 5682342.876705829054117 ],
					[ 373364.008862445596606, 5682402.802586587145925 ],
					[ 373296.288452932785731, 5682446.456509239971638 ],
					[ 373299.246603137056809, 5682585.347960812039673 ],
					[ 373404.074481094896328, 5682649.206234933808446 ],
					[ 373653.925228986539878, 5682812.52681487519294 ],
					[ 373691.784860484127421, 5682785.994794493541121 ],
					[ 373775.090180482773576, 5682823.47412075009197 ],
					[ 374041.350748461904004, 5682835.755020470358431 ],
					[ 374122.550408096634783, 5682900.894559854641557 ],
					[ 374152.812193201505579, 5682865.044891365803778 ],
					[ 374096.771381666359957, 5682799.554448693059385 ],
					[ 374156.502999556949362, 5682743.751676674932241 ],
					[ 374211.483535455481615, 5682783.326353660784662 ],
					[ 374336.554787921253592, 5682949.83388153091073 ],
					[ 374398.347939933417365, 5682944.423277483321726 ],
					[ 374618.256197399925441, 5682961.393075215630233 ],
					[ 374650.814992729283404, 5682981.695380514487624 ],
					[ 374711.463036771805491, 5682983.54263514559716 ],
					[ 374793.504996102536097, 5683014.802003853023052 ],
					[ 374835.730265289952513, 5683024.613547035492957 ],
					[ 374874.755099066125695, 5683061.958421173505485 ],
					[ 374872.084590819198638, 5683102.450160792097449 ],
					[ 374849.904534392524511, 5683159.603953802026808 ],
					[ 374836.566433758009225, 5683186.109362976625562 ],
					[ 374810.649999022833072, 5683187.168793656863272 ],
					[ 374669.105225283419713, 5683146.80370057374239 ],
					[ 374597.554224367719144, 5683125.210792076773942 ],
					[ 374572.695877234800719, 5683131.788730322383344 ],
					[ 374513.709154012729414, 5683331.992360304109752 ],
					[ 374548.355244904116262, 5683368.073990931734443 ],
					[ 374680.78463807317894, 5683326.604728147387505 ],
					[ 374722.035642553062644, 5683277.324936966411769 ],
					[ 374805.694069568417035, 5683312.845338935963809 ],
					[ 374844.65432098187739, 5683278.081482286565006 ],
					[ 374905.885968324553687, 5683223.658197821117938 ],
					[ 374929.32928583107423, 5683162.126090602017939 ],
					[ 375008.721786924812477, 5683128.593614727258682 ],
					[ 375080.685906419006642, 5683160.265667709521949 ],
					[ 375100.699110788700636, 5683191.17703221552074 ],
					[ 375156.151376915862784, 5683201.769314810633659 ],
					[ 375234.176750337763224, 5683176.774153965525329 ],
					[ 375306.708463119633961, 5683204.798924321308732 ],
					[ 375409.815137381432578, 5683305.879101801663637 ],
					[ 375489.230201720260084, 5683314.896977931261063 ],
					[ 375795.939448915596586, 5683216.491565443575382 ],
					[ 375859.118443511833902, 5683328.391656095162034 ],
					[ 375965.007420179317705, 5683306.489608820527792 ],
					[ 376128.766468291578349, 5683306.273102035745978 ],
					[ 376149.478962936904281, 5683247.135934120975435 ],
					[ 376315.568930061766878, 5683168.177141799591482 ],
					[ 376351.579843251383863, 5683234.247722477652133 ],
					[ 376423.979690066131297, 5683177.190640704706311 ],
					[ 376342.833495488739572, 5683059.211965332739055 ],
					[ 376414.747766664717346, 5683018.111442676745355 ],
					[ 376469.196820239303634, 5682983.176427821628749 ],
					[ 376499.803247897827532, 5683065.060490033589303 ],
					[ 376572.137595861335285, 5683067.554439266212285 ],
					[ 376665.554387688171118, 5683152.320922394283116 ],
					[ 376734.480509303277358, 5683238.08837980683893 ],
					[ 376776.238839887082577, 5683192.76869516260922 ],
					[ 377006.080633439763915, 5683314.200562009587884 ],
					[ 377091.258713738177903, 5683266.909454481676221 ],
					[ 377291.621815765101928, 5682962.644852683879435 ],
					[ 377428.581450509198476, 5682827.513145480304956 ],
					[ 377533.311803913442418, 5682776.118432026356459 ],
					[ 377496.85924867040012, 5682619.320445624180138 ],
					[ 377502.272620859206654, 5682517.081494000740349 ],
					[ 377543.461815761984326, 5682324.596220002509654 ],
					[ 377471.376580110285431, 5682294.834971369244158 ],
					[ 377455.51991794857895, 5682273.677466668188572 ],
					[ 377479.831950711552054, 5682135.033494054339826 ],
					[ 377477.272182940039784, 5682072.44605418574065 ],
					[ 377494.614636937738396, 5681929.998197572305799 ],
					[ 377399.096916565846186, 5681927.089326401241124 ],
					[ 377302.84127465065103, 5682072.764146625995636 ],
					[ 377250.026730073383078, 5682047.666324011981487 ],
					[ 377197.070383188838605, 5681985.776444014161825 ],
					[ 377102.047351085639093, 5681928.332044570706785 ],
					[ 377027.629930169146974, 5681908.205503711476922 ],
					[ 376916.062094014545437, 5681912.767252679914236 ],
					[ 376948.506769240368158, 5681739.715201586484909 ],
					[ 376990.795446634932887, 5681737.902684504166245 ],
					[ 377027.580235537840053, 5681596.68401303794235 ],
					[ 377031.171241053205449, 5681480.878766003064811 ],
					[ 376896.164728846692014, 5681392.949938817881048 ],
					[ 376983.382943325384986, 5681217.278450196608901 ],
					[ 376897.679283742210828, 5681112.525353786535561 ],
					[ 376764.815191283763852, 5681325.222546451725066 ],
					[ 376668.475264034641441, 5681424.07016383856535 ],
					[ 376609.662412817880977, 5681445.378608172759414 ],
					[ 376450.724238338530995, 5681382.486697259359062 ],
					[ 376416.703205401543528, 5681366.225663502700627 ],
					[ 376344.026330771215726, 5681352.616297716274858 ],
					[ 376324.456745060335379, 5681310.031939570792019 ],
					[ 376273.143928287492599, 5681321.670447458513081 ],
					[ 376261.308860154706053, 5681232.204733566381037 ],
					[ 376233.288263851543888, 5681180.198280425742269 ],
					[ 376177.128533599548973, 5681185.496086951345205 ],
					[ 375923.257775210426189, 5681063.56616151984781 ],
					[ 375872.434946198482066, 5681042.512880884110928 ],
					[ 375816.862786758982111, 5681041.084048746153712 ],
					[ 375620.938581700844225, 5681169.802319418638945 ],
					[ 375503.782745393982623, 5681281.499173157848418 ],
					[ 375286.298845825833268, 5681280.217545684427023 ],
					[ 375032.279518363240641, 5681154.587640051729977 ],
					[ 374908.883684702916071, 5681123.542741456069052 ],
					[ 374860.452430170553271, 5681102.76202901545912 ],
					[ 374825.882146857969929, 5681090.545210652053356 ],
					[ 374775.040733479137998, 5681080.356528555043042 ],
					[ 374601.051300365012139, 5681024.773786635138094 ],
					[ 374636.752316049824003, 5680897.927943245507777 ],
					[ 374586.797131943982095, 5680842.728711121715605 ],
					[ 374562.995033528073691, 5680764.799613170325756 ],
					[ 374544.916890531079844, 5680684.982759140431881 ],
					[ 374495.102494265069254, 5680666.575945823453367 ],
					[ 374338.140294502023607, 5680727.508888267911971 ],
					[ 374355.738933319633361, 5680624.572587887756526 ],
					[ 374339.26761642692145, 5680587.971059648320079 ],
					[ 374168.659198870649561, 5680415.522920025512576 ],
					[ 374117.983320792729501, 5680409.417880307883024 ],
					[ 374126.694285971636418, 5680289.127581043168902 ],
					[ 373941.181003794830758, 5680318.520343270152807 ],
					[ 373896.619555313664023, 5680395.301338666118681 ],
					[ 373699.163040239189286, 5680399.28717181365937 ],
					[ 373716.122617713932414, 5680314.09507310949266 ],
					[ 373663.806782841391396, 5680301.242718824185431 ],
					[ 373525.017474888882134, 5680240.137032543309033 ],
					[ 373500.055694079957902, 5680262.96381143014878 ],
					[ 373477.17785379558336, 5680303.422607977874577 ],
					[ 373323.395890584448352, 5680275.638636198826134 ],
					[ 373298.997959336382337, 5680012.236444046720862 ],
					[ 373135.580064581125043, 5679982.123523504473269 ],
					[ 373011.398801439441741, 5679944.948799929581583 ],
					[ 372951.562137310160324, 5680048.251761548221111 ],
					[ 372900.439609192777425, 5680031.260557468049228 ],
					[ 372913.847983945626765, 5679925.764920151792467 ],
					[ 372869.974149924120866, 5679919.380257190205157 ],
					[ 372815.192646999028511, 5680079.721621652133763 ],
					[ 372719.539851266599726, 5680240.363714870065451 ],
					[ 372560.866568151046522, 5680159.629415053874254 ],
					[ 372626.231361135200132, 5680091.535678398795426 ],
					[ 372473.733490998507477, 5680028.260236428119242 ],
					[ 372484.533352209837176, 5679925.596938070841134 ],
					[ 372486.472075610188767, 5679772.86617433372885 ],
					[ 372427.266769225243479, 5679658.072478507645428 ],
					[ 372372.312656792113557, 5679613.979220151901245 ],
					[ 372307.41856425802689, 5679593.463105265051126 ],
					[ 372212.260196933115367, 5679632.791318843141198 ],
					[ 372049.790406399173662, 5679625.806249144487083 ],
					[ 371940.302457936399151, 5679648.001963008195162 ],
					[ 371879.960795074759517, 5679605.492414898239076 ],
					[ 371848.830392870993819, 5679544.070283174514771 ],
					[ 371831.999843753757887, 5679465.708534312434494 ],
					[ 371765.106927111337427, 5679462.991960056126118 ],
					[ 371735.173235196154565, 5679464.215863068588078 ],
					[ 371706.298186085419729, 5679558.076027006842196 ],
					[ 371677.725088156003039, 5679559.244331508874893 ],
					[ 371652.453292663325556, 5679474.412613777443767 ],
					[ 371657.419412843009923, 5679362.449551153928041 ],
					[ 371591.053597814228851, 5679339.267217913642526 ],
					[ 371424.997838972252794, 5679211.126303156837821 ],
					[ 371340.830373516131658, 5679119.162399887107313 ],
					[ 371333.096306616149377, 5679070.386583420448005 ],
					[ 371354.234673039754853, 5678946.888089327141643 ],
					[ 371269.56961517536547, 5678909.460946999490261 ],
					[ 371219.717291285400279, 5678877.013843204826117 ],
					[ 371197.287579213269055, 5678841.543715486302972 ],
					[ 371196.924666424281895, 5678799.308697831816971 ],
					[ 371268.889355046092533, 5678653.868730884976685 ],
					[ 371276.788060562103055, 5678634.115686235949397 ],
					[ 371281.479219344852027, 5678599.689678040333092 ],
					[ 371267.45029431709554, 5678528.093248744495213 ],
					[ 371203.035077129548881, 5678514.070498456247151 ],
					[ 371061.758094605465885, 5678747.454909146763384 ],
					[ 371098.820381977246143, 5678766.518785796128213 ],
					[ 371067.778274454642087, 5678807.311087530106306 ],
					[ 371057.651487816532608, 5678993.080138408578932 ],
					[ 371011.978694297606125, 5679109.431560422293842 ],
					[ 370939.477221894892864, 5679102.853561215102673 ],
					[ 370915.955237313930411, 5679027.490631248801947 ],
					[ 370856.032692092994694, 5679028.576066911220551 ],
					[ 370825.100655339076184, 5679072.091199801303446 ],
					[ 370758.122971675533336, 5679033.939669918268919 ],
					[ 370694.977756562526338, 5679022.890151850879192 ],
					[ 370629.415918993297964, 5678986.043889709748328 ],
					[ 370586.817767376429401, 5678944.170986386947334 ],
					[ 370502.706117318943143, 5678920.349764786660671 ],
					[ 370488.680949637549929, 5678877.309412500821054 ],
					[ 370453.02600906585576, 5678871.951817031018436 ],
					[ 370446.801340305886697, 5678786.342100888490677 ],
					[ 370528.744335519208107, 5678757.098178563639522 ],
					[ 370654.30512835708214, 5678627.943177580833435 ],
					[ 370699.63299130165251, 5678557.764826871454716 ],
					[ 370755.065223786106799, 5678458.916004761122167 ],
					[ 370664.984898010909092, 5678455.780805987305939 ],
					[ 370616.588001741445623, 5678505.459482491016388 ],
					[ 370547.30649518041173, 5678511.015547977760434 ],
					[ 370549.608531063538976, 5678467.308377233333886 ],
					[ 370519.56316158734262, 5678465.80995755828917 ],
					[ 370509.367056204006076, 5678383.088888161815703 ],
					[ 370483.985594050842337, 5678362.319153607822955 ],
					[ 370454.760967382870149, 5678614.289134302176535 ],
					[ 370323.831142370705493, 5678578.751181648112833 ],
					[ 370279.719682649651077, 5678799.984195967204869 ],
					[ 370245.981568575603887, 5678808.177454309538007 ],
					[ 370220.907822594628669, 5678828.282985378056765 ],
					[ 370155.596836407086812, 5678830.951782672666013 ],
					[ 370143.454975583008491, 5678700.607069450430572 ],
					[ 370071.340815167932305, 5678703.553772542625666 ],
					[ 370085.23606937751174, 5678910.15079961065203 ],
					[ 370030.535698640916962, 5678972.354835637845099 ],
					[ 370007.972907274612226, 5678998.697161199524999 ],
					[ 369967.200439598062076, 5679056.718627597205341 ],
					[ 369854.208238347433507, 5678993.189625991508365 ],
					[ 369758.822534801904112, 5678960.288390191271901 ],
					[ 369545.171210454369429, 5678934.946124073117971 ],
					[ 369530.393108149408363, 5678840.144481261260808 ],
					[ 369555.411353515111841, 5678818.678053313866258 ],
					[ 369441.219749112613499, 5678692.457275928929448 ],
					[ 369365.556928508623969, 5678808.718434786424041 ],
					[ 369293.170145664713345, 5678938.430696888826787 ],
					[ 368826.800710616807919, 5679032.454466452822089 ],
					[ 368831.133468905696645, 5679071.803489574231207 ],
					[ 368891.970874527934939, 5679199.760737366974354 ],
					[ 368952.174524954345543, 5679199.066746750846505 ],
					[ 368997.18647152086487, 5679199.953401715494692 ],
					[ 369050.113734408456367, 5679227.77553591504693 ],
					[ 369074.857817213400267, 5679266.289542940445244 ],
					[ 369097.092042561096605, 5679476.631853502243757 ],
					[ 369050.835407897131518, 5679545.306406705640256 ],
					[ 369104.794310576806311, 5679864.743786447681487 ],
					[ 369030.060900553246029, 5680103.583961997181177 ],
					[ 368997.011487266980112, 5680386.887672446668148 ],
					[ 368938.84488574671559, 5680472.573884169571102 ],
					[ 368856.73769910109695, 5680497.737346795387566 ],
					[ 368867.071931293583475, 5680550.468379224650562 ],
					[ 368775.607504358515143, 5680580.103198730386794 ],
					[ 368795.168108703568578, 5680700.090760199353099 ],
					[ 368771.049122078344226, 5680735.149272243492305 ],
					[ 368725.656584249576554, 5680791.520737090148032 ],
					[ 368815.039307629864197, 5680852.603164110332727 ],
					[ 368820.375913007301278, 5680908.092870658263564 ],
					[ 368829.834694670746103, 5680964.436445904895663 ],
					[ 368775.620915466919541, 5680971.763219687156379 ],
					[ 368694.348503602319397, 5680973.244656129740179 ],
					[ 368673.478679330495652, 5681015.121185821481049 ],
					[ 368696.386571561568417, 5681075.51511190738529 ],
					[ 368642.75937584915664, 5681139.037701774388552 ],
					[ 368579.828682673163712, 5681141.610444807447493 ],
					[ 368575.800875497050583, 5681209.919877015054226 ],
					[ 368583.9915009746328, 5681243.657575799152255 ],
					[ 368598.499895722721703, 5681265.211615064181387 ],
					[ 368629.25371499476023, 5681267.361628346145153 ],
					[ 368708.428528537624516, 5681245.385087415575981 ],
					[ 368812.765131862950511, 5681130.385060966946185 ],
					[ 368940.426522913156077, 5681169.461982436478138 ],
					[ 368909.12026944255922, 5681237.18262642249465 ],
					[ 368934.008367678849027, 5681304.310405668802559 ],
					[ 369067.639577693655156, 5681239.223426836542785 ],
					[ 369082.496453623694833, 5681269.28175341244787 ],
					[ 369074.515004392189439, 5681324.123828925192356 ],
					[ 369103.673076170962304, 5681370.634039072319865 ],
					[ 369083.057386494649108, 5681449.842239665798843 ],
					[ 368978.128423075191677, 5681508.644024710170925 ],
					[ 368799.370149018359371, 5681553.429710770025849 ],
					[ 368778.617533417418599, 5681629.236972250044346 ],
					[ 368761.647359957918525, 5681672.520982841029763 ],
					[ 368763.316343085782137, 5681713.339432674460113 ],
					[ 368739.459767380554695, 5681775.886593630537391 ],
					[ 368845.37720818282105, 5681803.683291886933148 ],
					[ 368820.251178397098556, 5681855.818815320730209 ],
					[ 368866.317757321929093, 5681940.819680234417319 ],
					[ 368819.638018539350014, 5682007.465424427762628 ],
					[ 368813.985721958975773, 5682077.544736814685166 ],
					[ 368824.43708494520979, 5682124.818712500855327 ],
					[ 368835.963265410042368, 5682156.716209110803902 ],
					[ 368795.359778458368964, 5682246.964444063603878 ],
					[ 368950.554484761261847, 5682334.318450617603958 ],
					[ 368994.426913636736572, 5682324.006502575241029 ],
					[ 369025.736393845814746, 5682339.762543260119855 ],
					[ 369070.898632302298211, 5682402.653651661239564 ],
					[ 369119.323130201199092, 5682462.004159563221037 ],
					[ 369182.295165479066782, 5682585.497851081192493 ],
					[ 369189.761818189173937, 5682643.116082458756864 ],
					[ 369167.481523275317159, 5682681.507074802182615 ],
					[ 369187.371905140520539, 5682709.655572136864066 ],
					[ 369223.782462865288835, 5682725.203134869225323 ],
					[ 369263.658064276271034, 5682658.834437353536487 ],
					[ 369265.112823259376455, 5682611.073124866932631 ],
					[ 369247.581334974849597, 5682557.273708460852504 ],
					[ 369154.027858666901011, 5682394.143564866855741 ],
					[ 369179.950726009847131, 5682319.82753886282444 ],
					[ 369142.837338864686899, 5682203.795159200206399 ],
					[ 369205.450414042919874, 5682151.82951451651752 ],
					[ 369470.157272124022711, 5682209.146076208911836 ],
					[ 369461.551266343565658, 5682248.682007275521755 ],
					[ 369267.974145539454184, 5682306.005988689139485 ],
					[ 369257.876585729653016, 5682350.71331316139549 ],
					[ 369391.449542597751133, 5682534.353864394128323 ],
					[ 369394.089335673430469, 5682598.984360178001225 ],
					[ 369402.488769979216158, 5682637.010843675583601 ],
					[ 369565.487608020834159, 5682624.346862144768238 ],
					[ 369726.752395535353571, 5682568.347674326039851 ],
					[ 369791.973931974498555, 5682538.421619992703199 ],
					[ 369873.466999272990506, 5682531.687874376773834 ],
					[ 369921.815259608905762, 5682505.860556139610708 ],
					[ 369949.060293204616755, 5682463.858073115348816 ],
					[ 369987.687508880801033, 5682366.87231264449656 ],
					[ 370032.426429957093205, 5682336.08103962149471 ],
					[ 370293.339951426722109, 5682425.932094761170447 ],
					[ 370389.174673774745315, 5682561.715592521242797 ],
					[ 370416.596123614988755, 5682649.18504579551518 ],
					[ 370446.238874813308939, 5682707.600731082260609 ],
					[ 370401.989358609193005, 5682833.775873140431941 ],
					[ 370559.049869934446178, 5682883.573922500945628 ],
					[ 370667.691130081948359, 5682917.18658756185323 ],
					[ 370794.606809194548987, 5682894.374976844526827 ],
					[ 371067.439815022633411, 5682900.243941282853484 ],
					[ 371111.0456685021054, 5682865.575152794830501 ],
					[ 371178.436240383482073, 5682865.03972868155688 ],
					[ 371197.244882018479984, 5682825.088321362622082 ],
					[ 371287.733763554715551, 5682829.904652598313987 ],
					[ 371365.109008686500601, 5682930.657617777585983 ],
					[ 371478.300110998097807, 5683074.257159994915128 ],
					[ 371817.472653206321411, 5683160.905997508205473 ],
					[ 371882.450546588923316, 5683166.7660873234272 ],
					[ 372040.286186721990816, 5683154.168821055442095 ],
					[ 372118.999545888276771, 5683160.497069468721747 ],
					[ 372155.892038950056303, 5683104.472899020649493 ],
					[ 372090.945663930033334, 5683057.724020537920296 ],
					[ 372121.174330354842823, 5683005.380053968168795 ],
					[ 372125.638915610732511, 5682822.913869733922184 ],
					[ 372260.343974670220632, 5682742.451225535944104 ],
					[ 372421.583413070533425, 5682894.294371332041919 ],
					[ 372481.874617746798322, 5682946.864577519707382 ],
					[ 372586.016391790704802, 5683038.389563742093742 ],
					[ 372654.775271910708398, 5683014.238344241864979 ]
				]
			]
		},
		crs: {
			type: 'name',
			properties: {
				name: 'urn:ogc:def:crs:EPSG::25832'
			}
		}
	}
];

storiesOf('Deprecated/FeatureCollectionDisplayWithTooltipLabels', module)
	// .addDecorator(withInfo) // At your stories directly.
	.add('Simple FCD in 25832', () =>
		React.createElement(() => {
			const mapStyle = {
				height: window.innerHeight - 100,
				cursor: 'pointer',
				clear: 'both'
			};

			let urlSearchParams = new URLSearchParams('');

			return (
				<div>
					<div>Simple small FeatureCollection in a metric reference system</div>
					<br />

					<RoutedMap
						style={mapStyle}
						key={'leafletRoutedMap'}
						referenceSystem={MappingConstants.crs25832}
						referenceSystemDefinition={MappingConstants.proj4crs25832def}
						layers=''
						doubleClickZoom={false}
						onclick={(e) => console.log('click', e)}
						ondblclick={(e) => console.log('doubleclick', e)}
						autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
						backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10'}
						urlSearchParams={urlSearchParams}
						fullScreenControlEnabled={false}
						locateControlEnabled={false}
						minZoom={7}
						maxZoom={18}
						zoomSnap={0.5}
						zoomDelta={0.5}
						fallbackZoom={8}
					>
						<FeatureCollectionDisplayWithTooltipLabels
							key={'ds'}
							featureCollection={uwz}
							boundingBox={{
								left: 343647.19856823067,
								top: 5695957.177980389,
								right: 398987.6070465423,
								bottom: 5652273.416315537
							}}
							style={(feature) => {
								// console.log('feature styler', feature);

								const style = {
									color: '#155317',
									weight: 3,
									opacity: 0.5,
									fillColor: '#155317',
									fillOpacity: 0.15
								};
								return style;
							}}
							labeler={(feature) => {
								// console.log('feature labeler', feature);

								return (
									<h3
										style={{
											color: '#155317',
											opacity: 0.7,
											textShadow:
												'1px 1px 0px  #000000,-1px 1px 0px  #000000, 1px -1px 0px  #000000, -1px -1px 0px  #000000, 2px 2px 15px #000000'
										}}
									>
										Umweltzone
									</h3>
								);
							}}
						/>
					</RoutedMap>
				</div>
			);
		})
	)
	.add('Simple editable FCD in 25832 ', () =>
		React.createElement(() => {
			const [ editable, setEditable ] = useState(false);
			const map = useRef();
			const fc = useRef();
			const mapStyle = {
				height: window.innerHeight - 100,
				cursor: 'pointer',
				clear: 'both'
			};

			// useEffect(() => {
			// 	// Update the document title using the browser API
			// 	console.log('map ref', map);
			// 	console.log('fc  ref', fc);
			// });

			let urlSearchParams = new URLSearchParams('');

			return (
				<div>
					<div>
						Simple small editable FeatureCollection in a metric reference system (Start
						editing with double-click)
					</div>
					<br />
					<button onClick={() => setEditable(!editable)}>
						{editable === true ? 'Turn off EditMode' : 'Turn on EditMode'}
					</button>
					<br />
					<br />

					<RoutedMap
						ref={map}
						editable={editable}
						style={mapStyle}
						key={'leafletRoutedMap' + editable}
						referenceSystem={MappingConstants.crs25832}
						referenceSystemDefinition={MappingConstants.proj4crs25832def}
						layers=''
						doubleClickZoom={false}
						onclick={(e) => console.log('click', e)}
						ondblclick={(e) => console.log('doubleclick', e)}
						autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
						backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10'}
						urlSearchParams={urlSearchParams}
						fullScreenControlEnabled={false}
						locateControlEnabled={false}
						minZoom={7}
						maxZoom={18}
						zoomSnap={0.5}
						zoomDelta={0.5}
						fallbackZoom={8}
					>
						<FeatureCollectionDisplayWithTooltipLabels
							ref={fc}
							editable={editable}
							key={'ds'}
							featureCollection={uwz}
							boundingBox={{
								left: 343647.19856823067,
								top: 5695957.177980389,
								right: 398987.6070465423,
								bottom: 5652273.416315537
							}}
							style={(feature) => {
								// console.log('feature styler', feature);

								const style = {
									color: '#155317',
									weight: 3,
									opacity: 0.5,
									fillColor: '#155317',
									fillOpacity: 0.15
								};
								return style;
							}}
							labeler={(feature) => {
								// console.log('feature labeler', feature);

								return (
									<h3
										style={{
											color: '#155317',
											opacity: 0.7,
											textShadow:
												'1px 1px 0px  #000000,-1px 1px 0px  #000000, 1px -1px 0px  #000000, -1px -1px 0px  #000000, 2px 2px 15px #000000'
										}}
									>
										Umweltzone
									</h3>
								);
							}}
						/>
					</RoutedMap>
				</div>
			);
		})
	);
