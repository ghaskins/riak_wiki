
util = { 
	
	default_vals: {
		n_total_keys: 50000000,
		n_key_size: 15,
		n_record_size: 2000,
		n_bucket_size: 15,
		n_ram: 4,
		n_nval: 3,
		nval: 3,
		key_size: 15,
		bucket_size: 15,
		value_size: 2000,
		ram: 4,
		nodes: 3
	}	
}

$(document).ready(function(){
	$.each(util.default_vals, function(k,v){
		$("#"+k).val(v)
	})
	
    if($('#key_size').length == 0){
		return
	}else{
  
		node_calculator = new NodeCalculator()
		node_calculator.update_nodes()
		node_calculator.update_keydir()
  
		bitcask_calculator = new BitcaskCalculator()
		bitcask_calculator.update_overhead()
		bitcask_calculator.update_capacity()
   
	}

	//nodes handlers
	$('#n_total_keys, #n_bucket_size, #n_key_size, #n_record_size, #n_ram, #n_nval, #total').keyup(function () { 
	  
	  $.each(util.default_vals, function(k,v){
	    $("#"+k+"_error").text("")
	    if(!/(^-?\d\d*$)/.test($("#"+k).val())){
	      $("#"+k+"_error").text("Must be an integer")
	      return
	    }
  	})
    node_calculator.update_keydir()
		node_calculator.update_nodes()
	})



	//bitcask handlers
	$('#key_size').keyup(function () {    
		bitcask_calculator.update_overhead()
	});
	$('#nodes, #value_size, #ram, #nval').keyup(function () {
		bitcask_calculator.update_capacity()
	});

	$('#key_size').focusin(function () {    
	  $('#entry_info').text("This is the approximate size of your keys, measured in bytes. Why does this matter? In addition to the standard 22 byte per key overhead that Bitcask requires, you need to factor in the key's actual size that will be unique to your application and use case.")
	});
  $('#bucket_size').focusin(function () {    
	  $('#entry_info').text("This is the approximate size of your bucket name, measured in bytes.")
	});
	
	$('#value_size').focusin(function () {    
	  $('#entry_info').text("This is how large you expect your values to be. We use this variable to calculate how much disk space you'll need in your cluster. ")
	});

	$('#key_size, #value_size').focusout(function () {    
	  $('#entry_info').text("")
  
	});
  
})


function NodeCalculator(){
  

  this.total_keys = function () {
    return parseFloat($('#n_total_keys').val())
  }
  
  this.record_size = function () {
    return parseFloat($('#n_record_size').val())
  }
  
  this.key_size = function () {
    var key_size = parseFloat($('#n_key_size').val())+22
    return key_size
  }

  this.nval = function () {
    return parseFloat($('#n_nval').val())
  }
  
  this.bucket_size = function () {
    return parseFloat($('#n_bucket_size').val())
  }
  
  
  this.ram = function (){
    return parseFloat($('#n_ram').val()) * 1073741824
  }
  
  this.keydir_calc = function () {
    var total_size = ((this.key_size()+this.bucket_size())*this.total_keys()*this.nval())/1073741824
    return Math.round(total_size*10)/10
    
    
    return ((this.key_size()+this.bucket_size()) * this.total_keys() *this.nval())/1073741824
  }
  
  this.nodes = function () {  

    var nnodes = (((this.key_size()+this.bucket_size()) * this.total_keys())*this.nval())/this.ram()

    if(nnodes < this.nval()) {
      nnodes = this.nval()
    }
    if(nnodes < 3) {
      nnodes = 3
    }
    return Math.ceil(nnodes)
  }
  
  
  this.update_nodes = function () {
    var disk = (((this.record_size() * this.total_keys())*this.nval())/1073741824)/this.nodes()
    if(disk < 1){
      disk = "Less than 1"
    }
    $('#node_count').text(this.nodes()+" ("+Math.ceil(disk)+" GB Storage per Node)")

  }
  
  this.update_keydir = function () {
    $('#node_keydir').text(this.keydir_calc()+" GB")
  }
  
}


function BitcaskCalculator(){
  
  this.key_overhead = function () {
    var key_size = parseFloat($('#key_size').val())
    return key_size + this.bucket_size() + 22
  }
  
  this.bucket_size = function () {
    return parseFloat($('#bucket_size').val())
  }
  
  
  this.value_size = function () {
    return parseFloat($('#value_size').val())
  }
  

  this.nval = function () {
    return parseFloat($('#nval').val())
  }
  
  
  this.total_ram = function (){
    var ram = parseFloat($('#ram').val()) * 1073741824
    return ram * parseFloat($('#nodes').val())
  }
  
  this.total_doc_raw = function () {
    return Math.ceil(this.total_ram()/(this.key_overhead()*this.nval()))
  }
  
  this.total_docs = function () {
    return this.total_doc_raw().toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")  
  }
  
  this.total_docs = function () {
    return this.total_doc_raw().toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    
  }
  
  this.disk_space = function () {
    var disk_space_raw = ((this.value_size()*this.total_doc_raw())*this.nval())/1073741824
    return disk_space_raw.toFixed().toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
  }
  
  this.update_overhead = function () {
    $('#key_overhead').text(this.key_overhead() + " Bytes (22 Byte Overhead)")
  }
  
  this.update_capacity = function () {
    $('#total_documents').text(this.total_docs())
    $('#total_disk_space').text(this.disk_space() + " GB of Disk Space")
  } 
}