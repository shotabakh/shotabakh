// ფუნქცია, რომელიც სთხოვს მომხმარებელს შედგეს რომელ გვერდზე უნდა გადადოს
document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // აიკრძალება ლინკზე მიანიშნება, რათა გვერდი არ გადაიტვირთოს
  
      let პასუხი = prompt("საიტის რომელ გვერდზე გინდა გადასვლა? (მთავარი, შესახებ, კონტაქტი)");
  
      if (პასუხი !== null) {
        პასუხი = პასუხი.toLowerCase();
  
        if (პასუხი === "მთავარი") {
          window.location.href = "index.html";
        } else if (პასუხი === "შესახებ") {
          window.location.href = "2.html";
        } else if (პასუხი === "კონტაქტი") {
          window.location.href = "მესამე.html";
        } else {
          alert("ასეთი გვერდი არ არსებობს");
        }
      }
    });
  });
  