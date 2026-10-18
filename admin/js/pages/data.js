// Dữ liệu mẫu (mock) cho các trang admin — nạp trước page js
// Mỗi trang chỉ dùng phần dữ liệu của mình

// ===== Dữ liệu trang Dashboard =====
const KPI = [
  {label:'Người dùng mới (tháng này)', val:'1.284', delta:'+12,5%', up:true, icon:'person_add', tone:'bg-surface-container-low text-primary'},
  {label:'Listing mới chờ duyệt', val:'312', delta:'+8,1%', up:true, icon:'inventory', tone:'bg-primary-fixed text-on-primary-fixed'},
  {label:'Brief tùy biến mới', val:'96', delta:'-3,2%', up:false, icon:'request_quote', tone:'bg-tertiary-fixed text-on-tertiary-fixed'},
  {label:'Tổng giá trị giao dịch', val:'2,84 tỷ đ', delta:'+18,4%', up:true, icon:'payments', tone:'bg-secondary-fixed text-on-secondary-fixed'},
];

const REVENUE = [
  {m:'T11/25',v:142},{m:'T12/25',v:168},{m:'T1/26',v:121},{m:'T2/26',v:98},
  {m:'T3/26',v:156},{m:'T4/26',v:172},{m:'T5/26',v:189},{m:'T6/26',v:205},
  {m:'T7/26',v:178},{m:'T8/26',v:196},{m:'T9/26',v:224},{m:'T10/26',v:251},
];

const CAT_ORDERS = [
  {name:'Thổ cẩm', pct:86, orders:342, color:'#9a4526'},
  {name:'Gốm & Sành', pct:64, orders:254, color:'#2a3b32'},
  {name:'Mây tre đan', pct:52, orders:206, color:'#b8cbbf'},
  {name:'Trang sức', pct:38, orders:151, color:'#f2be71'},
  {name:'Sơn mài', pct:14, orders:56, color:'#737874'},
];

const INSIGHTS = [
  {icon:'analytics', title:'Dự báo doanh thu Q4/2026', body:'Mô hình dự báo doanh thu tháng 12 đạt 268–284 triệu đ (+12% so với trung bình 3 tháng). Đề xuất chuẩn bị thêm nguồn hàng Thổ cẩm H\'Mông trước lễ hội cuối năm.', tag:'Dự báo', tagTone:'bg-tertiary-container text-on-tertiary-container'},
  {icon:'warning', title:'Rủi ro tồn kho Gốm Bát Tràng', body:'Tỷ lệ hủy đơn nhóm "Gốm Bát Tràng mộc" tăng 2,3× sau khi đổi nhà vận chuyển. Gợi ý rà soát đóng gói hoặc bổ sung bảo hiểm vận chuyển cho mặt hàng dễ vỡ.', tag:'Cảnh báo', tagTone:'bg-secondary text-on-secondary'},
  {icon:'smart_button', title:'AI matching chính xác hơn 9,2%', body:'Sau khi chuẩn hóa taxonomy danh mục, độ chính xác gợi ý Maker cho brief tăng từ 81% lên 90,2%. Cần bổ sung mô tả cho 14 danh mục lá đang thiếu ngữ cảnh.', tag:'Cải tiến', tagTone:'bg-tertiary-container text-on-tertiary-container'},
  {icon:'groups', title:'Xu hướng khách hàng mới', body:'63% người dùng đăng ký tháng 9 đến từ chiến dịch "Câu chuyện nghệ nhân". Thời gian xem trang nghệ nhân dài gấp 2,1 lần trung bình — gợi ý đẩy mạnh nội dung storytelling.', tag:'Hành vi', tagTone:'bg-tertiary-container text-on-tertiary-container'},
];

let disputes = [
  {id:'BR-104', title:'Bộ bàn ghế mây 6 món — phong cách Indochine', customer:'Trần Minh Quân', maker:'Lê Văn Hùng', value:'24.500.000đ', issue:'Khách tố giao thiếu 1 ghế đôn, Maker khẳng định đã giao đủ theo biên bản. Moderator xử lý 2 lần không thành.', days:6, status:'pending'},
  {id:'BR-097', title:'Bình gốm nung củi 45L men tro trấu', customer:'Đỗ Lan Anh', maker:'Vũ Đức Thịnh', value:'8.900.000đ', issue:'Bình vỡ khi nhận hàng; bên vận chuyển từ chối bồi thường do "đóng gói không đạt chuẩn" — hai bên tranh cãi trách nhiệm.', days:4, status:'pending'},
  {id:'BR-088', title:'Thảm thổ cẩm kỹ hoa 2m×3m đặt riêng', customer:'Phạm Hồng Sơn', maker:'Lò Thị Mai Hoa', value:'16.200.000đ', issue:'Maker tố khách từ chối nhận hàng sau khi hoàn thành đúng mẫu duyệt; khách nói màu thực tế lệch ảnh.', days:9, status:'pending'},
];

const LOG_TEMPLATES = [
  {icon:'shopping_bag', tone:'text-primary', text:'Đơn #CL-9842 hoàn tất thanh toán — 3.450.000đ'},
  {icon:'person_add', tone:'text-primary', text:'Người dùng mới đăng ký qua chiến dịch Storytelling'},
  {icon:'inventory', tone:'text-tertiary-container', text:'Maker đăng listing mới chờ kiểm duyệt'},
  {icon:'request_quote', tone:'text-secondary', text:'Brief tùy biến mới được gửi tới 3 Maker'},
  {icon:'gavel', tone:'text-error', text:'Moderator từ chối listing #LS-455 (vi phạm ảnh mô tả)'},
  {icon:'verified', tone:'text-primary', text:'Tài khoản Maker được cấp tích xanh'},
  {icon:'payments', tone:'text-primary', text:'Chu kỳ đối soát Maker được xử lý — 147 giao dịch'},
  {icon:'category', tone:'text-tertiary-container', text:'AI matching gán đúng danh mục cho 18 listing'},
];

// ===== Dữ liệu trang Content (danh mục) =====
const ICONS = ['category','texture','water_drop','emoji_food_beverage','chair','diamond','palette','shopping_bag','backpack','eco','local_florist','deployed_code','brush','checkroom','home_storage','flatware'];

let categories = [
  {id:1, name:"Dệt & Thêu dân tộc", slug:"det-theu-dan-toc", icon:"texture", desc:"Các dòng sản phẩm dệt thổ cẩm, thêu tay truyền thống của đồng bào dân tộc thiểu số.", parentId:null, order:1, status:"active", products:0, listings:0, orders:0},
  {id:2, name:"Gốm & Sành mộc", slug:"gom-sanh-moc", icon:"emoji_food_beverage", desc:"Gốm Chăm Bàu Trúc, gốm Phù Lãng và dòng gốm nung củi không tráng men.", parentId:null, order:2, status:"active", products:0, listings:0, orders:0},
  {id:3, name:"Mây tre đan", slug:"may-tre-dan", icon:"chair", desc:"Đồ gia dụng và thời trang đan từ mây, tre, lá buông — làng nghề Bao La, Kim Bồng.", parentId:null, order:3, status:"active", products:0, listings:0, orders:0},
  {id:4, name:"Trang sức thủ công", slug:"trang-suc-thu-cong", icon:"diamond", desc:"Trang sức bạc Thái, vòng đá, hạt gỗ đàn hương chế tác thủ công.", parentId:null, order:4, status:"active", products:0, listings:0, orders:0},
  {id:5, name:"Sơn mài & Khảm trai", slug:"son-mai-kham-trai", icon:"brush", desc:"Sản phẩm sơn mài Cẩm Châu, khảm trai Chuôn Ngọ — dòng di sản nghệ thuật.", parentId:null, order:5, status:"hidden", products:0, listings:0, orders:0},
  {id:11, name:"Thổ cẩm H'Mông & Dao", slug:"tho-cam-hmong-dao", icon:"texture", desc:"Vải thổ cẩm dệt bằng khung cửi vải, hoa văn kỹ hoa, màu nhuộm chàm cổ truyền.", parentId:1, order:1, status:"active", products:128, listings:96, orders:342},
  {id:12, name:"Khăn lụa chàm Tây Bắc", slug:"khan-lua-cham-tay-bac", icon:"water_drop", desc:"Khăn lụa tơ tằm nhuộm chàm hữu cơ, kỹ thuật chắp vá wax-resist.", parentId:1, order:2, status:"active", products:64, listings:51, orders:187},
  {id:13, name:"Thêu tay cao cấp", slug:"theu-tay-cao-cap", icon:"palette", desc:"Tranh thêu tay, khăn thêu lụa — ký họa thêu của nghệ nhân làng Văn Lâm.", parentId:1, order:3, status:"active", products:37, listings:29, orders:95},
  {id:21, name:"Gốm Chăm Bàu Trúc", slug:"gom-cham-bau-truc", icon:"deployed_code", desc:"Gốm nung củi không men, tạo hình bằng kỹ thuật dải cuộn — một trong 2 làng gốm cổ nhất VN.", parentId:2, order:1, status:"active", products:82, listings:60, orders:210},
  {id:22, name:"Gốm Phù Lãng", slug:"gom-phu-lang", icon:"emoji_food_beverage", desc:"Men tro trấu đặc trưng, nung gỗ 72 giờ — bình trà, bát đĩa gia dụng.", parentId:2, order:2, status:"active", products:74, listings:55, orders:168},
  {id:23, name:"Gốm Bát Tràng mộc", slug:"gom-bat-trang-moc", icon:"flatware", desc:"Dòng gốm hoa mộc men chàm, khắc âm nổi tinh xảo của nghệ nhân Bát Tràng.", parentId:2, order:3, status:"hidden", products:45, listings:0, orders:52},
  {id:31, name:"Đồ gia dụng mây tre", slug:"do-gia-dung-may-tre", icon:"chair", desc:"Giỏ, sọt, khay, thảm mây đan kín — bền đẹp thân thiện môi trường.", parentId:3, order:1, status:"active", products:93, listings:71, orders:264},
  {id:32, name:"Túi xách tre & lá buông", slug:"tui-xach-tre-la-buong", icon:"shopping_bag", desc:"Túi đan thời trang xuất khẩu, phối da thuộc thảo mộc cao cấp.", parentId:3, order:2, status:"active", products:41, listings:33, orders:88},
  {id:41, name:"Bạc Thái Cẩm Đường", slug:"bac-thai-cam-duong", icon:"diamond", desc:"Trang sức bạc nguyên chất chạm khắc hoa văn dân tộc Thái đen.", parentId:4, order:1, status:"active", products:58, listings:44, orders:132},
  {id:42, name:"Vòng tay & phụ kiện đá", slug:"vong-tay-phu-kien-da", icon:"local_florist", desc:"Vòng đá tự nhiên, hạt gỗ bách xanh mix charm bạc thủ công.", parentId:4, order:2, status:"active", products:69, listings:50, orders:141},
  {id:51, name:"Hộp khảm trai cổ", slug:"hop-kham-trai-co", icon:"brush", desc:"Hộp trang sức, tranh khảm trai xà cừ — nghệ thuật đòi hỏi kỹ thuật cao.", parentId:5, order:1, status:"active", products:12, listings:9, orders:23},
];

// ===== Dữ liệu trang Users =====
const ROLE_META = {
  customer:{label:'Khách hàng', badge:'bg-surface-container-high text-on-surface', icon:'person'},
  maker:{label:'Maker', badge:'bg-primary-fixed text-on-primary-fixed', icon:'workspace_premium'},
  moderator:{label:'Kiểm duyệt viên', badge:'bg-tertiary-fixed text-on-tertiary-fixed', icon:'shield_person'},
  admin:{label:'Admin', badge:'bg-secondary text-on-secondary', icon:'admin_panel_settings'},
};
const ROLE_RANK = {customer:1, maker:2, moderator:3, admin:4};

let users = [
  {id:1, name:'Lò Thị Mai Hoa', email:'hoa.mai@luuthycam.vn', phone:'0901 234 567', role:'maker', status:'active', joined:'12/03/2021', violations:0, verified:true, location:'Hà Giang', craft:'Thổ cẩm H\'Mông', orders:214, revenue:'486.500.000đ', activity:['Đăng 3 sản phẩm mới — Thổ cẩm H\'Mông','Hoàn thành đơn #CL-9821 (12.400.000đ)','Nhận đánh giá 5★ từ khách hàng','Cập nhật bộ sưu tập mùa thu hoạch']},
  {id:2, name:'Trần Minh Quân', email:'quan.tm@gmail.com', phone:'0912 876 543', role:'customer', status:'active', joined:'28/07/2023', violations:0, verified:false, location:'Hà Nội', craft:'—', orders:12, revenue:'24.800.000đ', activity:['Gửi brief tùy biến #BR-118','Hoàn tất thanh toán đơn #CL-9702','Đánh giá 5★ sản phẩm Gốm Phù Lãng']},
  {id:3, name:'Nguyễn Thị Thu Trang', email:'trang.ntt@craftlink.vn', phone:'0933 445 566', role:'moderator', status:'active', joined:'15/01/2022', violations:0, verified:false, location:'Hà Nội', craft:'—', orders:0, revenue:'—', activity:['Duyệt 24 tin đăng hôm nay','Từ chối listing #LS-441 (ảnh mờ)','Xử lý 3 báo cáo vi phạm']},
  {id:4, name:'Vũ Đức Thịnh', email:'thinh.vu@baotrangceramics.vn', phone:'0977 123 456', role:'maker', status:'active', joined:'05/11/2020', violations:1, verified:true, location:'Ninh Thuận', craft:'Gốm Chăm Bàu Trúc', orders:388, revenue:'912.300.000đ', activity:['Đăng bình gốm nung củi 45L','Hoàn thành đơn #CL-9817','Phản hồi đánh giá 4★ của khách']},
  {id:5, name:'Phạm Hồng Sơn', email:'sonph.88@gmail.com', phone:'0905 999 111', role:'customer', status:'banned', joined:'19/02/2023', violations:4, verified:false, location:'TP.HCM', craft:'—', orders:6, revenue:'9.200.000đ', banInfo:{until:'Vĩnh viễn', reason:'Spam brief quảng cáo ngoài sàn, quấy rối Maker'}, activity:['Bị khóa bởi Admin Nam — spam brief','Tạo 8 brief vi phạm trong 1 ngày']},
  {id:6, name:'Bùi Thanh Tâm', email:'tam.bui@moderator.craftlink.vn', phone:'0988 222 333', role:'moderator', status:'active', joined:'22/09/2022', violations:0, verified:false, location:'Đà Nẵng', craft:'—', orders:0, revenue:'—', activity:['Kiểm duyệt 41 listing ngành Mây tre','Cập nhật từ khóa cấm nhóm gốm sứ']},
  {id:7, name:'Mã A Sử', email:'su.ma@thocamsapa.coop', phone:'0961 777 888', role:'maker', status:'pending', joined:'02/10/2024', violations:0, verified:false, location:'Lào Cai', craft:'Thổ cẩm & Khăn chàm', orders:0, revenue:'—', activity:['Đăng ký Maker — chờ xác minh hồ sơ','Tải lên giấy xác nhận HTX Lùng Tám']},
  {id:8, name:'Đỗ Lan Anh', email:'lananh.do@gmail.com', phone:'0945 345 678', role:'customer', status:'active', joined:'11/06/2024', violations:0, verified:false, location:'Hải Phòng', craft:'—', orders:3, revenue:'6.750.000đ', activity:['Gửi brief #BR-121 — túi tre đan','Thanh toán đơn #CL-9840 qua MoMo']},
  {id:9, name:'Lê Văn Hùng', email:'hung.lv@noithatmay.vn', phone:'0903 111 222', role:'maker', status:'active', joined:'30/04/2021', violations:2, verified:true, location:'Huế', craft:'Mây tre đan', orders:167, revenue:'352.100.000đ', activity:['Bị cảnh báo: ảnh listing trùng lặp','Đăng bộ bàn ghế mây 6 món','Hoàn thành đơn #CL-9798']},
  {id:10, name:'Admin Nam', email:'nam.admin@craftlink.vn', phone:'0904 000 001', role:'admin', status:'active', joined:'01/01/2020', violations:0, verified:false, location:'Hà Nội', craft:'—', orders:0, revenue:'—', activity:['Điều chỉnh phí hoa hồng 8% → 7,5%','Ép hoàn tiền brief #BR-104','Xuất báo cáo doanh thu Q3']},
  {id:11, name:'Hoàng Thị Thuỳ Dung', email:'dung.ht@maytrekimhong.vn', phone:'0919 555 666', role:'maker', status:'banned', joined:'14/08/2022', violations:3, verified:false, location:'Quảng Nam', craft:'Mây tre đan', orders:92, revenue:'187.400.000đ', banInfo:{until:'Còn 12 ngày (khóa 30 ngày)', reason:'Giao hàng không đúng chất liệu cam kết (3 lần)'}, activity:['Bị khóa 30 ngày bởi Moderator Trang','Đơn khiếu nại #CMP-77 đang mở']},
  {id:12, name:'Trịnh Công Sơn', email:'son.tc@gmail.com', phone:'0928 444 555', role:'customer', status:'active', joined:'25/12/2023', violations:1, verified:false, location:'Cần Thơ', craft:'—', orders:2, revenue:'3.100.000đ', activity:['Bị cảnh báo vì đánh giá sai thực tế','Hoàn tất đơn #CL-9833']},
];

// ===== Dữ liệu trang Moderation =====
const SEV_META = {
  warn:{label:'Cảnh báo', badge:'bg-secondary-fixed text-on-secondary-fixed', dot:'#D4A359'},
  block:{label:'Chặn cứng', badge:'bg-error-container text-on-error-container', dot:'#ba1a1a'},
};

let appeals = [
  {id:'APL-12', listing:'LS-441 — Túi xách mây đan phối da thuộc', maker:'Lê Văn Hùng', makerTier:'Maker tích xanh', submitted:'04/10/2026', originalDecision:'Từ chối bởi Moderator Trang — ảnh chụp mờ, nghi sử dụng ảnh có sẵn trên mạng thay ảnh thật.', appealReason:'Toàn bộ ảnh do tôi tự chụp tại xưởng Huế, ánh sáng xế chiều nên hơi tối. Tôi đã bổ sung ảnh chụp kèm báo cát-phê để chứng minh bản quyền.', status:'pending', severity:'high'},
  {id:'APL-13', listing:'LS-455 — Bình gốm men tro trấu 20L', maker:'Hoàng Thị Thuỳ Dung', makerTier:'Maker', submitted:'05/10/2026', originalDecision:'Bị khóa bởi Moderator Tâm — mô tả chứa cụm từ cấm "thần dược", vi phạm chính sách quảng cáo.', appealReason:'Tôi chỉ trích dẫn câu chuyện dân gian làng nghề, không hề quảng cáo công dụng chữa bệnh. Xin phép sửa lại mô tả.', status:'pending', severity:'medium'},
  {id:'APL-09', listing:'LS-402 — Khăn lụa chàm nhuộm tay', maker:'Mã A Sử', makerTier:'Maker chờ xác minh', submitted:'28/09/2026', originalDecision:'Từ chối bởi Moderator Trang — giá niêm yết 1.200.000đ chênh lệch >40% so với mặt bằng danh mục.', appealReason:'Khăn dùng lụa tơ tằm tự nhiên 100% + chàm hữu cơ 6 lần nhuộm, thời gian hoàn thành 12 ngày. Đã bổ sung bảng đối chiếu chi phí.', status:'resolved', resolution:'reversed', note:'Admin Nam đảo ngược: giá hợp lý với chất liệu, yêu cầu bổ sung ảnh quy trình nhuộm.'},
];

let blacklist = [
  {word:'thần dược', severity:'block', flagged:14, addedBy:'Admin Nam', date:'02/01/2026'},
  {word:'chữa bách bệnh', severity:'block', flagged:9, addedBy:'Moderator Trang', date:'15/02/2026'},
  {word:'gia truyền bí truyền', severity:'warn', flagged:22, addedBy:'Admin Nam', date:'03/03/2026'},
  {word:'hàng hiếm duy nhất', severity:'warn', flagged:11, addedBy:'Moderator Tâm', date:'21/04/2026'},
  {word:'đầu tơ sinh lợi', severity:'block', flagged:6, addedBy:'Admin Nam', date:'10/06/2026'},
  {word:'nhuộm hóa chất an toàn tuyệt đối', severity:'warn', flagged:4, addedBy:'Moderator Trang', date:'18/08/2026'},
  {word:'mật ong rừng nguyên chất 100%', severity:'warn', flagged:8, addedBy:'Moderator Tâm', date:'02/09/2026'},
];
