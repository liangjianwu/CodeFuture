
import { Box, Typography,} from "@mui/material"

const Qa = () => {
    const ch = navigator.language || navigator.userLanguage
    return <>
        <Box sx={{ padding: { md: 5, xs: 3 }, display: 'flex', flexDirection: 'column', alignItems: 'center', background: "#059c" }}>
                <Typography component="h4" sx={{ color: '#fff', fontSize: { md: '40px', md: '30px', xs: '22px' }, fontWeight: 'bold', }} variant="h4">LARGEST SABRE ONLY FENCING CLUB IN CANADA</Typography>
                <Typography component="h5" sx={{ color: '#fff', fontSize: { md: '28px', md: '24px', xs: '18px' }, fontWeight: '400', marginTop: 2 }} variant="h5">State of the Art Fencing Facilities and Equipment. Learn from World Level Coaches</Typography>
        </Box>       
        <Box sx={{padding:{xs:2,md:4}}}>
            <Typography component="h5" variant="h5" sx={{ fontWeight: 'bold', mb: {xs:2,md:4} }}>Q & A</Typography>
            <Typography sx={{mb:2,fontWeight:'bold'}} component="p" variant="subtitle1">Q:大课采取大班制，分级别，主要是初级班，中级班和高级班</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">初级班主要是针对击剑一无所知的初学者，最小的年龄5岁半，主要是启蒙孩子对于击剑的认识，通过趣味性的游戏与体能结合，讲解基本的佩剑知识，和实战的动作与战术，规范动作，协调，步法衔接，连贯性，打好佩剑基础。有了稳定的基础，后面的路才会走的更远。</Typography>            
            <Typography sx={{mb:2}} component="p" variant="body1">中级班的学员具备了一定的佩剑基础和身体能力，对击剑有了较好的了解，能够自主分析比赛双方的得失，同时有了实战经验。</Typography>            
            <Typography sx={{mb:2}} component="p" variant="body1">高级班的学员有了很强的身体能力，战术方面属于比较高的级别，部分学员是国家队成员，大部分都参加北美的比赛，和世界性的比赛。</Typography>
            <Typography sx={{mb:2,fontWeight:'bold'}} component="p" variant="subtitle1">Q:大班课主要分成体能，战术，和实战相互融合。</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">• 体能课：分为基础体能和专项体能，这两项会同时在体能课中进行训练，主要是训练学员的基础力量、协调性、灵活性，还有专项所需要的小肌肉力量。</Typography>            
            <Typography sx={{mb:2}} component="p" variant="body1">• 实战课：条件实战和计分实战，条件实战是通过设定不同的条件，来达到训练学员在实战中运用技术的能力；计分实战是训练学员对比赛的比分感觉，技术战术的分配运用。实战是体能和战术的综合运用。只有在一次一次的实战中，才能锻炼出速度，掌握主动权，提高场控能力和心里受挫能力。</Typography>            
            <Typography sx={{mb:2}} component="p" variant="body1">• 战术课：主要是训练进攻，防守，反攻，转换，培养距离感，时机感，剑感，应变能力，通过一些教练指导、双人练习等手段加以熟练。</Typography>
            <Typography sx={{mb:2,fontWeight:'bold'}} component="p" variant="subtitle1">Q:私教课（小课）一般时长是30分钟-1小时</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">小课是教练与学员进行一对一教学，针对学员的技术动作、专项力量以及实战比赛经验的提高，是学员提高技战术能力的有效途径。主要目的是多组合技术动作的训练，结合比赛各人运用技术的情况，进行有针对性的单独训练。</Typography>     
            <Typography sx={{mb:2,fontWeight:'bold'}} component="p" variant="subtitle1">Q:击剑运动员应该知道的美国击剑赛事</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">美国击剑赛季可分为全国性赛事和地区巡回赛</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">全国赛事有北美杯，全美锦标赛暨七月挑战赛和青少年奥林匹克击剑锦标赛。</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">地区巡回赛有：</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">[一]超级青年巡回赛（SYC Super Youth）</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">[二]超级少年巡回赛（SJCC）</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">[三]区域少年巡回赛（RJCC Regional Junior Cadet）</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">[四]区域青年巡回赛（RYC）</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">[五]区域公开赛（ROC Regional Open）</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">[六]国际区域巡回赛（IRC）</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">北美杯：每年十月至次年4月会举办六次北美杯，对于亚洲的运动员需要在本赛季期间，参与同个级别，性别及剑种的国际区域巡回赛，并符合北美杯的积分要求。其中三月的北美杯暨全国青少年年锦标赛。</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">青少年奥林匹克击剑锦标赛：参赛的运动员需为美国公民或代表美国的永久居民，需要在全国少年/青年滚动积分榜上有名，或获得110分或以上的青少年积分。</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">全美锦标赛暨七月挑战赛：这场比赛是青少年积分周期/赛季的开始，亚洲运动员需要在国际区域巡回赛最终排名前32名，还需符合美国击剑“A”，“B”或“C”类标准。</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">七月挑战赛将与美国击剑全国锦标赛同时举行，这两个比赛的组别设定也不一样。</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">全美锦标赛：II级，III级，1A级，老将组，Y14，Y12和Y10</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">七月挑战赛：I级，青年，少年，成年团体，老将组团体</Typography>     
            <Typography sx={{mb:2,fontWeight:'bold'}} component="p" variant="subtitle1">Q:跟升学相关的北美赛事</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">要想通过击剑进入美国好的大学，最好是在美国的击剑比赛中打出好成绩。那么最重要的比赛就是针对10岁组到14岁组为主的3月北美杯和全年龄段代表美国最高水平的美国锦标赛和7月挑战赛。</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">但参加3月的北美杯和美国锦标赛及7月挑战赛是需要资格要求的。这主要是由于参加人数不断膨胀导致美国击剑协会越来越难以管理这样的大型赛事。例如，疫情前的2019年的美国锦标赛及7月挑战赛参加人数超过1.4万人，整个比赛的组织、后勤和赛程管理都让击剑协会感到压力非常大。</Typography>
            <Typography sx={{mb:2,fontWeight:'bold'}} component="p" variant="subtitle1">Q:3月北美杯(MARCH NAC)参赛资格</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">满足以下要求的选手将会获得参加3月份北美杯对应剑种/性别/年龄组的比赛资格：</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">1. 满足比赛的参赛年龄要求并且</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">2. 选手在国际区域赛参加10岁组、12岁组和14岁组的比赛或</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">3. 选手在美国击剑协会10岁/12岁/14岁的国家积分榜列表中或</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">4. 选手参加美国举行的超级儿童赛或者区域儿童赛或</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">5. 如果选手在美国10岁组的国家积分榜列表中，将可以跨年龄组参加12岁组的比赛。如果选手在美国12岁组的国家积分榜列表中，将可以跨年龄组参加14岁组的比赛。</Typography>
            <Typography sx={{mb:2,fontWeight:'bold'}} component="p" variant="subtitle1">Q:美国锦标赛及7月挑战赛参赛资格</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">首先对于10岁组、12岁组和14岁组以及Div IA，Div II, Div III仅限于美国籍剑手参赛，外国剑手不可以参加。外国剑手可以参加的比赛是少年组、青年组及Div I这三个比赛。</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">满足以下要求的选手将会获得参加美国国家锦标赛和7月挑战赛的对应武器/性别/年龄组的比赛资格：</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">A. 少年组Cadet组参赛资格要求：</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">1.年龄在14-17岁(或在美国14岁国家积分榜中)</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">2.在美国击剑协会少年组Cadet国家积分榜列表中或</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">3.在美国击剑协会14岁组国家积分榜前50%中或</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">4.在美国区域少年Cadet或青年Junior积分榜中拿到65分(最好两场比赛)或</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">5.在国际区域赛中排名前32位或</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">6.外国运动员满足美国击剑协会对于等级"A"、"B"、或者"C"的标准。</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">B. 青年组Junior组参赛资格要求：</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">1.年龄在17-19岁(或在美国国家少年积分榜中)</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">2.在美国国家少年组Cadet或/青年组Junior积分榜列表中或</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">3.在美国区域青年Junior积分榜中拿到65分(最好两场比赛)或</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">4.在美国14岁国家积分榜前25%中或</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">5.在国际区域赛中排名前32位或</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">6.外国运动员满足美国击剑协会对于等级"A"或者"B"的标准。</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">C. Div I组参赛资格要求：</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">1.年龄至少16岁(或在美国青年国家积分榜中)</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">2.在美国成人国家积分榜中或</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">3.在美国青年国家积分榜中或</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">4.在美国少年国家积分榜中前24位或</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">5.在美国Div IA区域积分榜中前16位或</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">6.在美国Div II区域积分榜中前4位或</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">7.是2020年NCAA国家锦标赛个人参赛选手或</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">8.外国选手满足美国击剑协会对于等级"A"或者"B"的要求</Typography>
            <Typography sx={{mb:2,fontWeight:'bold'}} component="p" variant="subtitle1">Q:美国击剑协会跨年龄组参赛要求：</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">美国击剑协会正常的比赛一个剑手是同时可以参加两场比赛的。例如一个10岁的小剑手一般可以同时参加10岁组和12岁组的比赛。但是如果这个小剑手可以在对他而言高一级的年龄组(12岁组)打入美国国家积分榜，那么他就可以跨组参加更高一级年龄组的比赛(14岁组)。这样每次比赛这个小剑手就可以同时报名10岁、12岁和14岁的比赛。跨年龄组参赛在美国是很常见的情况，这样一些小剑手就可以更早适应高级别/高难度的比赛，但是这样是否合适还是取决于各个孩子的自身情况。</Typography>
        </Box>
    </>
}

export default Qa