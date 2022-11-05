import { Box, Typography,   } from "@mui/material"


const Aboutus = () => {
    const ch = navigator.language || navigator.userLanguage
    return <>
        <Box sx={{ padding: { md: 5, xs: 3 }, display: 'flex', flexDirection: 'column', alignItems: 'center', background: "#059c" }}>
                <Typography component="h4" sx={{ color: '#fff', fontSize: { md: '40px', md: '30px', xs: '22px' }, fontWeight: 'bold', }} variant="h4">LARGEST SABRE ONLY FENCING CLUB IN CANADA</Typography>
                <Typography component="h5" sx={{ color: '#fff', fontSize: { md: '28px', md: '24px', xs: '18px' }, fontWeight: '400', marginTop: 2 }} variant="h5">State of the Art Fencing Facilities and Equipment. Learn from World Level Coaches</Typography>
        </Box>
        
        <Box sx={{padding:{xs:2,md:4},display:ch.indexOf('ch')>=0?'none':'block'}}>
            <Typography component="h5" variant="h5" sx={{ fontWeight: 'bold', mb: {xs:2,md:4} }}>About Fencing</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">Fencing, known as “the ballet in battle” is an elegant battle art form and one of the oldest aristocratic sports in Europe. Fencing combines graceful movements, and skillful tactics, demanding of an athletes’ strong concentration and coordination.</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">Fencing is not only an Olympic sport, but it is an inter league sport for the world’s top schools, including Ivy League universities. Many colleges and universities list fencing as an asset, with many students being accepted with this advantage into schools such as Harvard, Yale, Princeton, Pennsylvania, Cornell, and Penn State. Every year, these universities will specially admit talented fencers. During the competitive admission process, many academically talented students may even be rejected, however, this exceptional skill will greatly increase your chance of admission. Additionally, specially admitted athletes who are accepted into varsity teams may also be rewarded exceptional scholarships!</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">Not only will fencing increase your chances of entering world ranked universities, through attending various global competitions, there are opportunities to travel the world! This is the perfect opportunity to make diverse friends and explore different cultures around the world, broadening their horizons and knowledge. </Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">Everyone is under the impression that fencing merely has the benefits of a physical activity, however after combat lessons, fencers will realize that fencing requires extensive knowledge and tactics, reasons why fencing is a well known aristocratic sport.  What’s even more wonderful is that fencing will help children develop elegant, confident, aristocratic etiquette from an early age, an exquisite skill that can be applied to other areas of students’ lives. </Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">Moreover, self defense, etiquette, and physical development are benefits for life! If you continue fencing, this sport will become a key aspect and experience in a child’s life!</Typography>
        </Box>
        <Box sx={{padding:{xs:2,md:4},display:ch.indexOf('ch')<0?'none':'block'}}>
            <Typography component="h5" variant="h5" sx={{ fontWeight: 'bold', mb: {xs:2,md:4} }}>什么是击剑</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">击剑被誉为“战斗中的芭蕾”，是一项高雅的战斗艺术，是欧洲最古老的贵族运动之一。击剑运动结合优雅的动作和灵活的战术，要求运动员精神的高度集中和身体的良好协调能力。</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">击剑运动不仅是奥运会运动项目，也是包括常春藤盟校在内的世界顶尖名校校际联赛项目之一。 很多高校将击剑列为加分或是推荐项目，美国每年都有学生因为击剑特长而被特招进入大学，如哈佛，耶鲁，普林斯顿，宾夕法尼亚，康奈尔，宾州州立大学都会特招一些国外优秀击剑学生。常春藤盟校的申请者不计其数，因录取人数有限，有些申请学生即使学业优秀，也有可能被拒之门外。但是，一名兼具击剑术的优秀学生更会受到常春藤盟校的欢迎。而且体育特长生若是因国外院校想纳其进校队代表参赛而被录取，还有可能获得丰富的奖学金！</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">练习击剑不但可以帮助孩子进入常青藤大学，而且通过参加比赛，还有机会去到世界各地，交到更多不同国家的朋友。同时，在不同文化的洗礼下，孩子的视野可以更加开阔，学到更多知识。击剑的好处，很多人都认为只有强身健体这样最直接的益处。但一旦开始打实战，学员就会发现击剑是一项非常动脑的体育运动，这也是击剑被誉为贵族运动的原因之一。</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">更加妙不可言的是，练习击剑会让孩子从小培养优雅、自信等贵族气质，无论是对孩子将来的为人处世上都有极大的帮助。而练习击剑的幼年同伴，也是孩子童年的一笔珍贵财富。除此之外，防身、培养高雅气质、促进孩子身体发育等等益处都是受益终身，如果坚持练剑，并取得一定的成绩，在孩子人生的关键节点上，击剑将成为人生路上的“垫脚石”！ </Typography>            
        </Box>       
        <Box sx={{ height:100,overflow:"hidden",display:{xs:'block',md:'none'}}}>
            <img src='/header.png' width="100%" style={{marginTop:-150}}></img>
        </Box>
        <Box sx={{ height:200,overflow:"hidden",display:{xs:'none',md:'block'}}}>
            <img src='/header.png' width="100%" style={{marginTop:-500}}></img>
        </Box>
        <Box sx={{padding:{xs:2,md:4},mt:1,display:ch.indexOf('ch')>=0?'block':'none'}}>
            <Typography component="h5" variant="h5" sx={{ fontWeight: 'bold', mb: {xs:2,md:4} }}>About Axis Fencing Club</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">Axis Fencing Club 作为专业的佩剑馆，不仅把击剑成绩作为培养目标，同时兼顾孩子的意志力培养和文化课学习的引导。“身心健康、意志坚强”是每个父母对孩子的殷切期望，剑馆坚持 “稳定、公平、专业、快乐” 的教育宗旨，通过独特的体能训练和技术训练以及竞技经验的结合，旨在打造多伦多孩子们的击剑圣地和精神乐园，成为一流的击剑俱乐部。</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">俱乐部有幸拥有来自欧洲和亚洲的教练。 法国和乌克兰是著名的击剑强国。 法国在上一届开罗世锦赛上获得国家第一名。 来自台北的中国教练和华裔经理促进了所有中国学生的融合。 俱乐部很幸运有会说多种语言的教练。</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">Axis Fencing Club 一直是加拿大国家男女佩剑队员的重要培养基地，连续培养过3届加拿大国家男女佩剑队员，目前也是现役国家青少年队员中占比最大的俱乐部。就在2021年12月份的North American Cup比赛中，俱乐部年仅15岁的Charles Wang 获得了青少年组第三名，为加拿大男子佩剑史增添了新的高度与荣耀。除了运动成绩优秀外，剑馆的学员在学业上也是你追我赶，发扬了“拼搏不止”的击剑精神。截止目前剑馆学员被耶鲁、芝加哥大学、哥伦比亚大学，纽约大学商学院等著名大学录取。教练组也一直坚持Axis的宗旨，We build champion with sportsmanship. </Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">Axis Fencing Club 于2021年9月份开始运营。由于发展迅速，今年三月底启动扩馆工程，由原来的四千多尺到现在的一万尺多尺。新增7条剑道，共14条剑道，包括两条金属剑道。此外，还增加了两个独立的男女更衣室，健身区，会议室，咖啡厅，目前是加拿大最大且唯一的佩剑专属击剑馆。</Typography>
        </Box>
        <Box sx={{padding:{xs:2,md:4},mt:1,display:ch.indexOf('ch')<0?'block':'none'}}>
            <Typography component="h5" variant="h5" sx={{ fontWeight: 'bold', mb: {xs:2,md:4} }}>About Axis Fencing Club</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">Axis Fencing Club, as a professional Saber only club, not only makes fencing performance our only goal, but also works to provide guidance for resilience development and cultural study. ”Strong physical and mental health” is every parent&#39;s wish for their children. Axis firmly adheres to our motto of “stable, fair, professional, and happy” through unique physical and technical training and competition, with hopes to become a fencing haven in Toronto, with goals to become a top tier fencing club. Our club is fortunate to welcome coaches from Europe and Asia! France and Ukraine are known to be strong countries in the art of fencing. France won the previous World championships in Cairo! Coaches from China will promote integration of Chinese students and world level coaches! Our club is lucky to have multilingual and diverse coaches!</Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">Axis Fencing Club has always been a crucial training base for Canadian national male and female saber fencers, producing national team members consistently for the past 3 years. Currently, we are currently the club with the largest portion of active national youth fencers! In the 2021 December North America Cup, Axis’ fencer Charles Wang (15) won third place in the junior category, adding new heights to the Canadian men’s saber history and paving the road for future Canadian fencers! </Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">In addition to exceptional sports achievements, our students continuously challenge each other, working towards collective improvement with excellent sportsmanship. Our fencer’s have been accepted to various renowned universities including Yale, Chicago, Columbia, and the New York Business School amongst others. Our coaches have always been adhering to the principles of Axis’: “We build Champions with Sportsmanship.” </Typography>
            <Typography sx={{mb:2}} component="p" variant="body1">Axis’ Fencing Club was founded in September 2021. Due to our rapid development, we have expanded our club in March 2022, expanding to be currently 10,000 sq ft from the original 4,000 sq ft. We have added 7 new pistes, bringing the total to 14 pistes along with 2 gold pistes. Additionally, we have included two individual male and female locker rooms, physical training areas, a meeting room and a cafeteria, currently the largest Canadian Saber only fencing club. </Typography>
        </Box>        
    </>
}

export default Aboutus