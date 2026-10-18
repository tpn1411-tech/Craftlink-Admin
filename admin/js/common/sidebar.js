// Nút đăng xuất ở góc trên phải của thanh điều hướng
function logoutDemo(){
  showToast('Đã đăng xuất khỏi bảng quản trị (demo)','success');
  setTimeout(function(){location.href='../../index.html';},1000);
}
